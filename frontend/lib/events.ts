import firebase from 'firebase/app';
import { Room } from './rooms';

export function getSenderDetails(event: Event, room: Room): SenderDetails {
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

export interface EventHand extends EventCommon {
  type: 'hand';
}

export interface EventQuestion extends EventCommon {
  type: 'question';
  text: string;
}

export interface EventQuestionUpvote extends EventCommon {
  type: 'question_upvote';
  questionEventId: string;
}

export interface EventMessage extends EventCommon {
  type: 'message';
  text: string;
}

export interface EventPollStart extends EventCommon {
  type: 'poll_start';
  options: string[];
  showLiveResults: boolean;
}

export interface EventPollResponse extends EventCommon {
  type: 'poll_response';
  answer: string;
}

export interface EventPollEnd extends EventCommon {
  type: 'poll_start';
  options: string[];
  votes: number[];
}

export type Event =
  | EventHand
  | EventQuestion
  | EventQuestionUpvote
  | EventMessage
  | EventPollStart
  | EventPollResponse
  | EventPollEnd;

export interface SenderDetails {
  name: string;
  photo?: string;
  isCurrentUser: boolean;
}
