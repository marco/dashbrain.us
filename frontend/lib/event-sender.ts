import firebase from 'firebase/app';
import * as rooms from './rooms';
import * as events from './events';

export async function raiseHand(room: rooms.Room): Promise<void> {
  let reference = firebase
    .firestore()
    .collection('rooms')
    .doc(room.id)
    .collection('events')
    .doc();

  let event: events.Event = {
    id: reference.id,
    type: 'hand',
    when: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    senderUid: firebase.auth().currentUser?.uid as string,
    recipientUids: [
      room.teacherUid,
      firebase.auth().currentUser?.uid as string,
    ],
  };

  await reference.set(event);
}