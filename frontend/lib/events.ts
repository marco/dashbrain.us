import firebase from 'firebase/app';
import { Room } from './rooms';

export function getUidDetails(uid: string, room: Room): SenderDetails {
  if (firebase.auth().currentUser?.uid === uid) {
    return { name: 'You', isCurrentUser: true };
  }

  if (room.teacherUid === uid) {
    return {
      name: room.teacherName,
      photo: room.teacherPhoto,
      isCurrentUser: false,
    };
  }

  let foundStudent = Object.values(room.students).find(
    (student) => student.uid === uid
  );

  if (foundStudent) {
    return { name: foundStudent.name, isCurrentUser: false };
  }

  return { name: 'Anonymous', isCurrentUser: false };
}

export function getSenderDetails(event: Event, room: Room): SenderDetails {
  return getUidDetails(event.senderUid, room);
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
  displayAsSentToEveryone: boolean;
}

export interface EventPollStart extends EventCommon {
  type: 'poll_start';
  text: string;
  options: string[];
  showLiveResults: boolean;
}

export interface EventPollResponse extends EventCommon {
  type: 'poll_response';
  pollEventId: string;
  answerIndex: number;
}

export interface EventPollEnd extends EventCommon {
  type: 'poll_end';
  pollEventId: string;
  votes: number[];
}

export interface EventWelcome extends EventCommon {
  type: 'welcome';
}

export interface EventStudentJoin extends EventCommon {
  type: 'student_join';
  studentUid: string;
}

export type Event =
  | EventHand
  | EventQuestion
  | EventQuestionUpvote
  | EventMessage
  | EventPollStart
  | EventPollResponse
  | EventPollEnd
  | EventWelcome
  | EventStudentJoin;

export interface SenderDetails {
  name: string;
  photo?: string;
  isCurrentUser: boolean;
}
