import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';

let StudentJoinEvent: React.FC<{
  room: Room;
  event: EventStudentJoin;
  className?: string;
}> = (props) => {
  return (
    <div className={props.className}>
      {props.room.students[props.event.studentUid]?.name || 'A student'} joined
      the Dashbrain.
    </div>
  );
};

export default StudentJoinEvent;
