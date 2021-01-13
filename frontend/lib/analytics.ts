import firebase from 'firebase/app';
import { Event } from './events';
declare let gtag: any;

export function sendEventFirstUserSignIn(id: string) {
  gtag('event', 'custom_user_first_sign_in', {
    event_category: 'teachers',
    event_label: `{ "uid": "${firebase.auth().currentUser?.uid || ''}" }`,
  });
}

export function sendEventNewRoom(id: string) {
  gtag('event', 'custom_new_room', {
    event_category: 'teachers',
    event_label: `{ "uid": "${
      firebase.auth().currentUser?.uid || ''
    }", "roomId": "${id}" }`,
  });
}

export function sendEventJoinRoom(id: string) {
  gtag('event', 'custom_join_room', {
    event_category: 'students',
    event_label: `{ "uid": "${
      firebase.auth().currentUser?.uid || ''
    }", "roomId": "${id}" }`,
  });
}

export function sendEventForEvent(event: Event) {
  gtag('event', 'custom_send_event_' + event.type, {
    event_category: 'events',
    event_label: `{ "senderUid": "${event.senderUid}", "id": "${event.id}" }`,
  });
}

export function sendEventForDeleteEvent(event: Event) {
  gtag('event', 'custom_delete_event_' + event.type, {
    event_category: 'events',
    event_label: `{ "senderUid": "${event.senderUid}", "id": "${event.id}" }`,
  });
}
