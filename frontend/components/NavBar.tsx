import React from 'react';
import config from '../config/config.json';
import firebase from 'firebase/app';
import LogoType from './LogoType';
import { Event } from '../lib/events';
import { Room } from '../lib/rooms';
import pluralize from 'pluralize';

let TeacherNavBar: React.FC<{
  roomId: string;
  room?: Room;
  events?: Event[];
}> = (props) => {
  return (
    <>
      <nav className="flex p-2 justify-between">
        <LogoType color="black" className="inline-block" />
        {renderMiddleComponent()}
        <span>#{props.roomId}</span>
      </nav>
    </>
  );

  function renderMiddleComponent() {
    if (
      props.room &&
      props.events &&
      props.room.teacherUid === firebase.auth().currentUser?.uid
    ) {
      return (
        <>
          <span className="text-gray-500">
            {pluralize(
              'student',
              Object.keys(props.room.students).length,
              true
            )}
          </span>
          <span className="text-gray-500">
            {pluralize(
              'hand',
              Object.keys(props.events.filter((event) => event.type === 'hand'))
                .length,
              true
            )}{' '}
          </span>
          <span className="text-gray-500">
            {pluralize(
              'question',
              Object.keys(
                props.events.filter((event) => event.type === 'question')
              ).length,
              true
            )}
          </span>
        </>
      );
    }

    return null;
  }
};

export default TeacherNavBar;
