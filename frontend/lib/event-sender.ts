import firebase from 'firebase/app';
import * as rooms from './rooms';
import * as events from './events';

export async function raiseHand(room: rooms.Room): Promise<events.Event> {
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
  return event;
}

export async function askQuestion(
  room: rooms.Room,
  text: string
): Promise<events.Event> {
  let reference = firebase
    .firestore()
    .collection('rooms')
    .doc(room.id)
    .collection('events')
    .doc();

  let event: events.Event = {
    id: reference.id,
    type: 'question',
    text: text,
    when: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    senderUid: firebase.auth().currentUser?.uid as string,
    recipientUids: [
      room.teacherUid,
      firebase.auth().currentUser?.uid as string,
    ],
  };

  await reference.set(event);
  return event;
}

export async function upvoteQuestion(
  room: rooms.Room,
  questionEventId: string
): Promise<events.Event> {
  let reference = firebase
    .firestore()
    .collection('rooms')
    .doc(room.id)
    .collection('events')
    .doc();

  let event: events.Event = {
    id: reference.id,
    type: 'question_upvote',
    questionEventId: questionEventId,
    when: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    senderUid: firebase.auth().currentUser?.uid as string,
    recipientUids: [
      room.teacherUid,
      firebase.auth().currentUser?.uid as string,
    ],
  };

  await reference.set(event);
  return event;
}

export async function deleteEvent(
  room: rooms.Room,
  event: events.Event
): Promise<void> {
  await firebase
    .firestore()
    .collection('rooms')
    .doc(room.id)
    .collection('events')
    .doc(event.id)
    .delete();
}
