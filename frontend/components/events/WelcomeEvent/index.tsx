import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import eventStyles from '../events.module.scss';
import styles from './event.module.scss';
import classNames from 'classnames';
import firebase from 'firebase/app';
import * as vocab from '../../../lib/vocabulary';

let WelcomeEvent: React.FC<{ className?: string; room: Room }> = (props) => {
  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/logo/blue.png"
        alt="Dashbrain"
        className={eventStyles.iconLarge}
      />
      <p className="font-bold">Welcome to Dashbrain</p>
      {getCopy()}
    </div>
  );

  function getCopy() {
    if (props.room.teacherUid === firebase.auth().currentUser?.uid) {
      return (
        <>
          <p>
            Your Dashbrain code is {props.room.id}.{' '}
            {vocab.isSchool() ? 'Students' : 'Participants'} can join by vising{' '}
            <a href="/" target="_blank" className="underline" rel="noreferrer">
              dashbrain.us
            </a>{' '}
            and entering the code.
          </p>
          <p className="mt-3">
            Or, you can send them this custom link:{' '}
            <span className="inline-block">
              <a
                href={`https://${
                  vocab.isSchool() ? 'school.' : ''
                }dashbrain.us/join/${props.room.id}`}
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                {vocab.isSchool() ? 'school.' : ''}dashbrain.us/join/
                {props.room.id}
              </a>
              .
            </span>
          </p>
          <p className="mt-3">
            You will receive notifications in this list as{' '}
            {vocab.getParticipantWord()}s join, ask questions, raise their
            hands, and more! Below, you can start a poll, send private messages
            to {vocab.getParticipantWord()}s, or export this Dashbrain as a PDF.
          </p>
          <p className="mt-3 font-bold">Our Recommendation</p>
          <p className="">
            Dashbrain works best in a smaller window next to your Zoom room,
            Google Meet call, or any other video calling software.
          </p>
          <p className="mt-3">
            <img
              className="w-full max-w-2xl"
              src="/assets/welcome-screenshot.png"
              alt="Dashbrain works best side-by-side with your video call application."
            />
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>
            You will receive notifications in this list as{' '}
            {vocab.isSchool() ? 'classmates' : 'people'} join, ask questions,
            raise their hands, and more!
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
