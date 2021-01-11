import React from 'react';
import { EventMessage, SenderDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';
import pluralize from 'pluralize';

let MessageEvent: React.FC<{
  room: Room;
  event: EventMessage;
  senderDetails: SenderDetails;
  className?: string;
}> = (props) => {
  return (
    <div
      className={classNames(props.className, styles.event, 'cursor-pointer')}
    >
      <img
        src="/assets/message/white.png"
        alt="Message"
        className={eventStyles.iconMedium}
      />
      <p className="font-bold">
        {props.senderDetails.name} sent {namesList()} a message
      </p>
      <p className="-mt-1.5">{props.event.text}</p>
      <p className="text-xs mt-2.5">Click to open &amp; reply</p>
    </div>
  );

  function namesList() {
    if (props.event.displayAsSentToEveryone) {
      return 'everyone';
    }

    let recipientsExcludingSender = props.event.recipientUids.filter(
      (uid) => uid !== props.event.senderUid
    );
    if (recipientsExcludingSender.length <= 1) {
      return 'you';
    }

    return `you and ${pluralize(
      'other',
      recipientsExcludingSender.length,
      true
    )}`;
  }
};

export default MessageEvent;
