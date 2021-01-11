import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import eventStyles from '../events.module.scss';
import styles from './event.module.scss';
import classNames from 'classnames';

let WelcomeEvent: React.FC<{ className?: string; room: Room }> = (props) => {
  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/logo/blue.png"
        alt="Dashbrain"
        className={eventStyles.iconLarge}
      />
      <p className="font-bold">Welcome to Dashbrain!</p>
      <p>Your Dashbrain code is {props.room.id}.</p>
      <p className="mt-1">
        You will receive notifications in this list as students join, ask
        questions, raise their hands, and more!
      </p>
      <p className="mt-1">
        Below, you can start a poll, send private messages to students, or
        export this Dashbrain as a PDF.
      </p>
    </div>
  );
};

export default WelcomeEvent;
