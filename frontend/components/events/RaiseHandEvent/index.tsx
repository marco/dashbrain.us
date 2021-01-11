import React from 'react';
import { EventHand, SenderDetails } from '../../../lib/events';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';
import { Room } from '../../../lib/rooms';
import firebase from 'firebase/app';
import * as eventSender from '../../../lib/event-sender';

let RaiseHandEvent: React.FC<{
  senderDetails: SenderDetails;
  className?: string;
  room: Room;
  event: EventHand;
}> = (props) => {
  let image = (
    <img
      src="/assets/hand/white.png"
      alt="Raise Hand"
      className={eventStyles.iconSmall}
    />
  );

  if (props.senderDetails.isCurrentUser) {
    return (
      <div className={classNames(props.className, styles.event)}>
        {image}
        <p className="font-bold">You</p>
        <p className="-mt-1.5">raised your hand.</p>
      </div>
    );
  } else {
    // TODO: Include photo if available.
    return (
      <div
        className={classNames(props.className, styles.event, 'cursor-pointer')}
        onClick={onClick}
      >
        {image}
        <p className="font-bold">{props.senderDetails.name}</p>
        <p className="-mt-1.5">raised their hand.</p>
        {firebase.auth().currentUser?.uid === props.room.teacherUid ? (
          <p className="text-xs mt-2.5">Click to lower their hand.</p>
        ) : undefined}
      </div>
    );
  }

  async function onClick() {
    if (firebase.auth().currentUser?.uid !== props.room.teacherUid) {
      return;
    }

    await eventSender.deleteEvent(props.room, props.event);
  }
};

export default RaiseHandEvent;
