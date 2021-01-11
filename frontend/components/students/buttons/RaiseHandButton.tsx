import React, { useState } from 'react';
import firebase from 'firebase/app';
import * as rooms from '../../../lib/rooms';
import * as events from '../../../lib/events';
import * as eventSender from '../../../lib/event-sender';

let RaiseHandButton: React.FC<{ room: rooms.Room; events: events.Event[] }> = (
  props
) => {
  let raiseEvent = props.events.find(
    (event) =>
      event.type === 'hand' &&
      event.senderUid == firebase.auth().currentUser?.uid
  ) as events.EventHand | undefined;

  if (raiseEvent) {
    return <button onClick={onClick}>Lower Hand</button>;
  } else {
    return <button onClick={onClick}>Raise Hand</button>;
  }

  async function onClick() {
    if (raiseEvent) {
      await eventSender.deleteEvent(props.room, raiseEvent);
    } else {
      await eventSender.raiseHand(props.room);
    }
  }
};

export default RaiseHandButton;
