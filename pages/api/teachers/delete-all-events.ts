import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase-admin';
import { initFirebase } from '../../../server/lib/firebase';
import { getTokenFromRequest } from '../../../server/lib/api-tokens';

initFirebase();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let token = getTokenFromRequest(req);

  if (token === undefined) {
    res.status(401).end();
    return;
  }

  let decoded: firebase.auth.DecodedIdToken;

  try {
    decoded = await firebase.auth().verifyIdToken(token as string);
  } catch (error) {
    res.status(401).end();
    return;
  }

  let roomId = req.body.roomId;

  if (!roomId) {
    res.status(401).end();
    return;
  }

  let doc = await firebase.firestore().collection('rooms').doc(roomId).get();

  if (!doc.exists || doc.data()?.teacherUid !== decoded.uid) {
    res.status(401).end();
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      deleteBatch(roomId, resolve as () => void, reject);
    });
  } catch (error) {
    res.status(500).end();
    return;
  }

  res.status(200).end();
};

// See https://firebase.google.com/docs/firestore/manage-data/delete-data#collections.
async function deleteBatch(
  roomId: string,
  resolve: () => void,
  reject: (err: any) => void
) {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('events')
      .limit(100)
      .get();

    if (snapshot.size === 0) {
      resolve();
      return;
    }

    const batch = firebase.firestore().batch();

    for (let doc of snapshot.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();

    process.nextTick(() => {
      deleteBatch(roomId, resolve, reject);
    });
  } catch (error) {
    reject(error);
  }
}
