import React from 'react';
import { EventMessage, SenderDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';
import pluralize from 'pluralize';
import firebase from 'firebase/app';
import MarkdownRenderer from '../../MarkdownRenderer';

let MessageEvent: React.FC<{
  room: Room;
  event: EventMessage;
  senderDetails: SenderDetails;
  className?: string;
}> = (props) => {
  return (
    <div
      className={classNames(props.className, styles.event, 'cursor-pointer', {
        'print:block': props.event.displayAsSentToEveryone,
        'print:hidden': !props.event.displayAsSentToEveryone,
      })}
    >
      <img
        src="/assets/message/white.png"
        alt="Message"
        className={eventStyles.iconMedium}
      />
      <p className="font-bold">
        {props.senderDetails.name} sent {namesList()} a{' '}
        {props.event.displayAsSentToEveryone ? '' : 'private '}message
      </p>
      <p className="leading-tight">
        <MarkdownRenderer>{props.event.text}</MarkdownRenderer>
      </p>
      <p className="text-xs mt-2.5 print:hidden">Click to open &amp; reply.</p>
    </div>
  );

  function namesList() {
    if (props.event.displayAsSentToEveryone) {
      return 'everyone';
    }

    let recipientsExcludingSenderAndCurrentUser = props.event.recipientUids.filter(
      (uid) =>
        uid !== props.event.senderUid &&
        uid !== firebase.auth().currentUser?.uid
    );
    if (recipientsExcludingSenderAndCurrentUser.length == 0) {
      return 'you';
    }

    return `you and ${pluralize(
      'other',
      recipientsExcludingSenderAndCurrentUser.length,
      true
    )}`;
  }
};

export default MessageEvent;
