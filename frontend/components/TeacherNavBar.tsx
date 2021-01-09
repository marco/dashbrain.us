import React from 'react';
import config from '../config/config.json';
import firebase from 'firebase/app';

let TeacherNavBar: React.FC = () => {
  return (
    <div className="flex">
      <h1>
        <a href="/t">{config.appName}</a>
      </h1>
      <div className="flex-1"></div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );

  async function signOut() {
    await firebase.auth().signOut();
    window.location.href = '/';
  }
};

export default TeacherNavBar;
