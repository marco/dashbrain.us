import firebase from 'firebase/app';
import * as rooms from './rooms';
import * as events from './events';
import _ from 'lodash';
import * as analytics from './analytics';

export async function raiseHand(room: rooms.Room): Promise<events.EventHand> {
  let reference = generateEventReference(room);

  let event: events.EventHand = {
    ...getUniversalEventValues(reference.id),
    type: 'hand',
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);

  afterSendEvent(event);
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

  afterSendEvent(event);
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

  afterSendEvent(event);
  return event;
}

export async function sendPollStart(
  room: rooms.Room,
  text: string,
  options: string[],
  showLiveResults: boolean
): Promise<events.EventPollStart> {
  let reference = generateEventReference(room);

  let event: events.EventPollStart = {
    ...getUniversalEventValues(reference.id),
    type: 'poll_start',
    text: text,
    options: options,
    showLiveResults: showLiveResults,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);

  afterSendEvent(event);
  return event;
}

export async function sendPollResponse(
  room: rooms.Room,
  pollEventId: string,
  voteIndex: number,
  sendToEveryone: boolean
): Promise<events.EventPollResponse> {
  let reference = generateEventReference(room);

  let event: events.EventPollResponse = {
    ...getUniversalEventValues(reference.id),
    type: 'poll_response',
    pollEventId,
    answerIndex: voteIndex,
    recipientUids: sendToEveryone
      ? getEveryoneUids(room)
      : getTeacherAndCurrentUserUids(room),
  };

  await reference.set(event);

  afterSendEvent(event);
  return event;
}

export async function sendPollEnd(
  room: rooms.Room,
  pollEventId: string,
  optionsCount: number,
  voteEvents: events.EventPollResponse[]
): Promise<events.EventPollEnd> {
  let reference = generateEventReference(room);

  let scores = new Array(optionsCount).fill(0);
  for (let voteEvent of voteEvents) {
    scores[voteEvent.answerIndex]++;
  }

  let event: events.EventPollEnd = {
    ...getUniversalEventValues(reference.id),
    type: 'poll_end',
    votes: scores,
    pollEventId: pollEventId,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);

  afterSendEvent(event);
  return event;
}

export async function sendMessage(
  room: rooms.Room,
  groupUids: string[],
  text: string,
  displayAsSentToEveryone: boolean
): Promise<events.EventMessage> {
  let reference = generateEventReference(room);

  let event: events.EventMessage = {
    ...getUniversalEventValues(reference.id),
    type: 'message',
    text: text,
    displayAsSentToEveryone: displayAsSentToEveryone,
    recipientUids: addCurrentUidIfNotIncluded(groupUids),
  };

  await reference.set(event);

  afterSendEvent(event);
  return event;
}

export async function sendStudentJoin(
  room: rooms.Room,
  uid: string
): Promise<events.EventStudentJoin> {
  let reference = generateEventReference(room);

  let event: events.EventStudentJoin = {
    ...getUniversalEventValues(reference.id),
    type: 'student_join',
    studentUid: uid,
    recipientUids: getEveryoneUids(room),
  };

  await reference.set(event);

  afterSendEvent(event);
  return event;
}

export async function sendWelcomeMessage(
  room: rooms.Room,
  forUid: string
): Promise<events.EventWelcome> {
  let reference = generateEventReference(room);

  let event: events.EventWelcome = {
    ...getUniversalEventValues(reference.id),
    type: 'welcome',
    recipientUids: [forUid],
  };

  await reference.set(event);

  afterSendEvent(event);
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
  afterDeleteEvent(event);
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

function getEveryoneUids(room: rooms.Room): string[] {
  return _.uniq([
    room.teacherUid,
    ...Object.keys(room.students),
    firebase.auth().currentUser?.uid as string,
  ]);
}

function getTeacherAndCurrentUserUids(room: rooms.Room): string[] {
  return _.uniq([room.teacherUid, firebase.auth().currentUser?.uid as string]);
}

function addCurrentUidIfNotIncluded(uids: string[]): string[] {
  return _.uniq(uids.concat([firebase.auth().currentUser?.uid as string]));
}

function afterSendEvent(event: events.Event) {
  analytics.sendEventForEvent(event);
}

function afterDeleteEvent(event: events.Event) {
  analytics.sendEventForDeleteEvent(event);
}
