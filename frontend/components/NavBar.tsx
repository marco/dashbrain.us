import React from 'react';
import config from '../config/config.json';
import firebase from 'firebase/app';
import LogoType from './LogoType';
import { Event } from '../lib/events';
import { Room } from '../lib/rooms';
import pluralize from 'pluralize';
import * as vocab from '../lib/vocabulary';

let TeacherNavBar: React.FC<{
  roomId: string;
  room?: Room;
  events?: Event[];
  allowLogoCollapse?: boolean;
}> = (props) => {
  return (
    <>
      <nav className="flex p-2 justify-between items-center">
        <LogoType
          size="normal"
          color="black"
          className="inline-block"
          allowCollapse={props.allowLogoCollapse}
        />
        {renderMiddleComponent()}
        <span className={props.allowLogoCollapse ? 'text-sm' : ''}>
          #{props.roomId}
        </span>
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
          <span className="text-gray-500 text-sm">
            {pluralize(
              vocab.getParticipantWord(),
              Object.keys(props.room.students).length,
              true
            )}
          </span>
          <span className="text-gray-500 text-sm">
            {pluralize(
              'hand',
              Object.keys(props.events.filter((event) => event.type === 'hand'))
                .length,
              true
            )}{' '}
          </span>
          <span className="text-gray-500 text-sm">
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
