import firebase from 'firebase/app';
import _ from 'lodash';
import config from '../config/config.json';
import { Event, EventStudentJoin, EventWelcome } from './events';
import * as errors from './errors';
import * as eventSender from './event-sender';

export async function generateId(): Promise<string> {
  return generateIdInner(config.rooms.minIdLength, 0);
}

export async function deleteCurrentRoom(): Promise<void> {
  let existingQuery = await firebase
    .firestore()
    .collection('rooms')
    .where('teacherUid', '==', firebase.auth().currentUser?.uid)
    .get();

  await Promise.all(existingQuery.docs.map((doc) => deleteRoom(doc.id)));
}

export function listen(
  id: string,
  callback: (update: ListenerUpdate | undefined | null) => void
): () => void {
  let latestRoom: Room | undefined;
  let latestEvents: Event[] | undefined;
  let hasReachedCompleteData: boolean;

  let unsubscribeRoom = firebase
    .firestore()
    .collection('rooms')
    .doc(id)
    .onSnapshot(
      (snap) => {
        latestRoom = snap.data() as Room | undefined;

        if (latestRoom && latestEvents) {
          hasReachedCompleteData = true;
          callback({ room: latestRoom, events: latestEvents });
        }

        if (hasReachedCompleteData && !latestRoom) {
          callback(null);
        }
      },
      (err) => {
        // Permission errors will occur if someone other than the room creator
        // tries to access this room.
        errors.handleError(err);
        callback(undefined);
      }
    );

  let unsubscribeEvents = firebase
    .firestore()
    .collection('rooms')
    .doc(id)
    .collection('events')
    .where('recipientUids', 'array-contains', firebase.auth().currentUser?.uid)
    .orderBy('when', 'desc')
    .onSnapshot(
      (snap) => {
        latestEvents = snap.docs.map((doc) => doc.data() as Event);

        if (latestRoom && latestEvents) {
          hasReachedCompleteData = true;
          callback({ room: latestRoom, events: latestEvents });
        }
      },
      (err) => {
        // Permission errors will occur if someone other than the room creator
        // tries to access this room.
        errors.handleError(err);
        callback(undefined);
      }
    );

  return () => {
    unsubscribeRoom();
    unsubscribeEvents();
  };
}

export async function join(
  id: string,
  name: string
): Promise<Room | undefined> {
  if (firebase.auth().currentUser) {
    await firebase.auth().signOut();
  }

  let result = await firebase.auth().signInAnonymously();
  await firebase
    .firestore()
    .collection('rooms')
    .doc(id)
    .update({
      [`students.${result.user?.uid}`]: { name, uid: result.user?.uid },
    });
  let room = await firebase.firestore().collection('rooms').doc(id).get();

  return room.data() as Room | undefined;
}

export async function checkRoomExists(id: string): Promise<boolean> {
  let doc = await firebase.firestore().collection('rooms').doc(id).get();
  return doc.exists;
}

export async function checkNameAvailable(
  id: string,
  name: string
): Promise<boolean> {
  let doc = await firebase.firestore().collection('rooms').doc(id).get();
  return !Object.values(doc.data()?.students || {}).some(
    (student) => (student as { name: string }).name === name
  );
}

export async function deleteRoom(id: string): Promise<void> {
  let idToken = await firebase.auth().currentUser?.getIdToken();
  await fetch('/api/teachers/delete-all-events', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      roomId: id,
    }),
  });
}

async function generateIdInner(
  length: number,
  iterations: number
): Promise<string> {
  let attempt = generateIdString(length);

  let doc = await firebase.firestore().collection('rooms').doc(attempt).get();

  if (doc.exists) {
    if (iterations + 1 >= config.rooms.increaseTrigger) {
      return await generateIdInner(length + 1, 0);
    } else {
      return await generateIdInner(length, iterations + 1);
    }
  } else {
    let user = firebase.auth().currentUser!;

    let room: Room = {
      teacherUid: user.uid,
      teacherName: user.displayName || 'Teacher',
      teacherPhoto: user.photoURL || undefined,
      id: attempt,
      students: {},
      options: {
        studentsCanMessageEachOther: true,
      },
    };

    await firebase.firestore().collection('rooms').doc(attempt).set(room);
    await eventSender.sendWelcomeMessage(room, user.uid as string);

    return attempt;
  }
}

function generateIdString(length: number): string {
  let out = '';

  for (let i = 0; i < length; i++) {
    if (out.length === 0) {
      out += _.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    } else {
      out += _.sample(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
    }
  }

  return out;
}

export interface ListenerUpdate {
  room: Room;
  events: Event[];
}

export interface Room {
  id: string;
  teacherUid: string;
  teacherName: string;
  teacherPhoto?: string;
  students: Record<string, { name: string; uid: string }>;
  options: {
    studentsCanMessageEachOther: boolean | undefined;
  };
}
