import firebase from 'firebase/app';
import { Room } from './rooms';

export function getSenderDetails(
  event: Event,
  room: Room
): {
  name: string;
  photo?: string;
  isCurrentUser: boolean;
} {
  if (firebase.auth().currentUser?.uid === event.senderUid) {
    return { name: 'You', isCurrentUser: true };
  }

  if (room.teacherUid === event.senderUid) {
    return {
      name: room.teacherName,
      photo: room.teacherPhoto,
      isCurrentUser: false,
    };
  }

  let foundStudent = Object.values(room.students).find(
    (student) => student.uid === event.senderUid
  );

  if (foundStudent) {
    return { name: foundStudent.name, isCurrentUser: false };
  }

  return { name: 'Anonymous', isCurrentUser: false };
}

interface EventCommon {
  id: string;
  type: string;
  when: firebase.firestore.Timestamp;
  senderUid: string;
  recipientUids: string[];
}

interface EventHand extends EventCommon {
  type: 'hand';
}

interface EventThumbup extends EventCommon {
  type: 'thumbup';
}

interface EventQuestion extends EventCommon {
  type: 'question';
  text: string;
}

interface EventMessage extends EventCommon {
  type: 'message';
  text: string;
}

interface EventPollStart extends EventCommon {
  type: 'poll_start';
  options: string[];
  showLiveResults: boolean;
}

interface EventPollResponse extends EventCommon {
  type: 'poll_response';
  answer: string;
}

interface EventPollEnd extends EventCommon {
  type: 'poll_start';
  options: string[];
  votes: number[];
}

export type Event =
  | EventHand
  | EventThumbup
  | EventQuestion
  | EventMessage
  | EventPollStart
  | EventPollResponse
  | EventPollEnd;
