import firebase from 'firebase/app';
import * as rooms from './rooms';
import * as events from './events';
import _ from 'lodash';

export async function raiseHand(room: rooms.Room): Promise<events.EventHand> {
  let reference = generateEventReference(room);

  let event: events.EventHand = {
    ...getUniversalEventValues(reference.id),
    type: 'hand',
    recipientUids: _.uniq([
      room.teacherUid,
      firebase.auth().currentUser?.uid as string,
    ]),
  };

  await reference.set(event);
  return event;
}

export async function askQuestion(
  room: rooms.Room,
  text: string
): Promise<events.EventQuestion> {
  let reference = generateEventReference(room);

  let event: events.EventQuestion = {
    ...getUniversalEventValues(reference.id),
    type: 'question',
    text: text,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);
  return event;
}

export async function upvoteQuestion(
  room: rooms.Room,
  questionEventId: string
): Promise<events.EventQuestionUpvote> {
  let reference = generateEventReference(room);

  let event: events.EventQuestionUpvote = {
    ...getUniversalEventValues(reference.id),
    type: 'question_upvote',
    questionEventId: questionEventId,
    recipientUids: getEveryoneUids(room),
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

export async function sendPollStart(
  room: rooms.Room,
  options: string[],
  showLiveResults: boolean
): Promise<events.EventPollStart> {
  let reference = generateEventReference(room);

  let event: events.EventPollStart = {
    ...getUniversalEventValues(reference.id),
    type: 'poll_start',
    options: options,
    showLiveResults: showLiveResults,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);
  return event;
}

export async function sendPollEnd(
  room: rooms.Room,
  pollEventId: string,
  optionsCount: number,
  voteEvents: events.EventPollResponse[]
): Promise<events.Event> {
  let reference = generateEventReference(room);

  let scores = new Array(optionsCount).fill(0);
  for (let voteEvent of voteEvents) {
    scores[voteEvent.answerIndex]++;
  }

  let event: events.Event = {
    ...getUniversalEventValues(reference.id),
    type: 'poll_end',
    votes: scores,
    pollEventId: pollEventId,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);
  return event;
}

function generateEventReference(room: rooms.Room) {
  return firebase
    .firestore()
    .collection('rooms')
    .doc(room.id)
    .collection('events')
    .doc();
}

function getUniversalEventValues(
  id: string
): {
  id: string;
  when: firebase.firestore.Timestamp;
  senderUid: string;
} {
  return {
    id: id,
    when: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    senderUid: firebase.auth().currentUser?.uid as string,
  };
}

function getEveryoneUids(room: rooms.Room) {
  return _.uniq([
    room.teacherUid,
    ...Object.keys(room.students),
    firebase.auth().currentUser?.uid as string,
  ]);
}
