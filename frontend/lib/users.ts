import firebase from 'firebase/app';
import _ from 'lodash';
import * as analytics from './analytics';

export async function saveUser(user: firebase.User): Promise<void> {
  let doc = await firebase.firestore().collection('users').doc(user.uid).get();

  if (!doc.exists) {
    let pickedProperties = {
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      providerData: user.providerData.map((data) => ({
        uid: data?.uid,
        providerId: data?.providerId,
      })),
      metadata: {
        creationTime: user.metadata.creationTime,
      },
    };

    await firebase.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      initialSignInProperties: pickedProperties,
    });
    analytics.sendEventFirstUserSignIn(user.uid);
  }
}
