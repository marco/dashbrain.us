import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import eventStyles from '../events.module.scss';
import styles from './event.module.scss';
import classNames from 'classnames';
import firebase from 'firebase/app';

let WelcomeEvent: React.FC<{ className?: string; room: Room }> = (props) => {
  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/logo/blue.png"
        alt="Dashbrain"
        className={eventStyles.iconLarge}
      />
      <p className="font-bold">Welcome to Dashbrain!</p>
      {getCopy()}
    </div>
  );

  function getCopy() {
    if (props.room.teacherUid === firebase.auth().currentUser?.uid) {
      return (
        <>
          <p>Your Dashbrain code is {props.room.id}.</p>
          <p className="mt-3">
            You will receive notifications in this list as students join, ask
            questions, raise their hands, and more!
          </p>
          <p className="mt-3">
            Below, you can start a poll, send private messages to students, or
            export this Dashbrain as a PDF.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>
            You will receive notifications in this list as classmates join, ask
            questions, raise their hands, and more!
          </p>
          <p className="mt-3">
            Below, you can ask a question, raise your hand, or send a message.
          </p>
        </>
      );
    }
  }
};

export default WelcomeEvent;
