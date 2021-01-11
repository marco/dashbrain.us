import React from 'react';
import config from '../config/config.json';
import firebase from 'firebase/app';
import LogoType from './LogoType';

let TeacherNavBar: React.FC<{ roomId: string }> = (props) => {
  return (
    <nav className="flex p-2">
      <LogoType color="black" className="inline-block" />
      <div className="flex-1"></div>
      <span>#{props.roomId}</span>
    </nav>
  );
};

export default TeacherNavBar;
