import React, { useState } from 'react';
import firebase from 'firebase/app';
import * as rooms from '../../../lib/rooms';
import * as events from '../../../lib/events';
import * as eventSender from '../../../lib/event-sender';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './RaiseHandButton.module.scss';
import classNames from 'classnames';

let RaiseHandButton: React.FC<{ room: rooms.Room; events: events.Event[] }> = (
  props
) => {
  let raiseEvent = props.events.find(
    (event) =>
      event.type === 'hand' &&
      event.senderUid == firebase.auth().currentUser?.uid
  ) as events.EventHand | undefined;

  return (
    <button
      onClick={onClick}
      className={classNames(
        styles.button,
        sharedStyles.bottomButtonSquare,
        'ml-1.5 flex-1 flex flex-col',
        { [sharedStyles.bottomButtonSquareInsetShadow]: raiseEvent }
      )}
    >
      <div className="flex-1 items-center justify-center flex">
        <img
          src={'/assets/hand/blue.png'}
          alt="Raise Hand"
          className="h-14 ml-1 mt-1"
        />
      </div>
      {raiseEvent ? 'Lower Hand' : 'Raise Hand'}
    </button>
  );

  async function onClick() {
    if (raiseEvent) {
      await eventSender.deleteEvent(props.room, raiseEvent);
    } else {
      await eventSender.raiseHand(props.room);
    }
  }
};

export default RaiseHandButton;
