import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';

let StudentJoinEvent: React.FC<{
  room: Room;
  event: EventStudentJoin;
  className?: string;
}> = (props) => {
  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/smile/white.png"
        alt="A Student Joined Dashbrain"
        className={eventStyles.iconSmall}
      />
      <p className="font-bold">
        {props.room.students[props.event.studentUid]?.name || 'A student'}
      </p>
      <p className="-mt-1.5">joined the Dashbrain.</p>
    </div>
  );
};

export default StudentJoinEvent;
