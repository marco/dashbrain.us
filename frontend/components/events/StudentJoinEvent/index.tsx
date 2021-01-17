import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';
import * as vocab from '../../../lib/vocabulary';

let StudentJoinEvent: React.FC<{
  room: Room;
  event: EventStudentJoin;
  className?: string;
}> = (props) => {
  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/smile/white.png"
        alt={`A ${
          vocab.isSchool() ? 'Student' : 'Participant'
        } Joined Dashbrain`}
        className={eventStyles.iconMedium}
      />
      <p className="font-bold">
        {props.room.students[props.event.studentUid]?.name ||
          `A ${vocab.getParticipantWord()}`}
      </p>
      <p className="-mt-1.5">joined the Dashbrain.</p>
    </div>
  );
};

export default StudentJoinEvent;
