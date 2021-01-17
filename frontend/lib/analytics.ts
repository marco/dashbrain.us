import firebase from 'firebase/app';
import { Event } from './events';
import * as vocab from './vocabulary';
declare let gtag: any;

export function sendEventFirstUserSignIn(id: string) {
  gtag('event', 'custom_user_first_sign_in' + suffix(), {
    event_category: 'teachers',
    event_label: `{ "uid": "${firebase.auth().currentUser?.uid || ''}" }`,
  });
}

export function sendEventNewRoom(id: string) {
  gtag('event', 'custom_new_room' + suffix(), {
    event_category: 'teachers',
    event_label: `{ "uid": "${
      firebase.auth().currentUser?.uid || ''
    }", "roomId": "${id}" }`,
  });
}

export function sendEventJoinRoom(id: string) {
  gtag('event', 'custom_join_room' + suffix(), {
    event_category: 'students',
    event_label: `{ "uid": "${
      firebase.auth().currentUser?.uid || ''
    }", "roomId": "${id}" }`,
  });
}

export function sendEventForEvent(event: Event) {
  gtag('event', 'custom_send_event_' + event.type + suffix(), {
    event_category: 'events',
    event_label: `{ "senderUid": "${event.senderUid}", "id": "${event.id}" }`,
  });
}

export function sendEventForDeleteEvent(event: Event) {
  gtag('event', 'custom_delete_event_' + event.type + suffix(), {
    event_category: 'events',
    event_label: `{ "senderUid": "${event.senderUid}", "id": "${event.id}" }`,
  });
}

function suffix(): string {
  if (vocab.isSchool()) {
    return '_school';
  } else {
    return '';
  }
}
