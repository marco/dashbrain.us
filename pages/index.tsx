import Head from 'next/head';
import config from '../frontend/config/config.json';
import firebase from 'firebase/app';
import React from 'react';

let Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>{config.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-white text-center pt-12 pb-20 px-6 relative">
        <div className="transform -skew-y-6 bg-blue-600 -z-1 absolute top-0 bottom-2 left-0 right-0 origin-top-left"></div>
        <h2 className="text-2xl font-black text-shadow-lg">
          Fix Your Zoom Rooms
        </h2>
        <div className="text-shadow-lg">
          <p className="inline">With </p>
          <h1 className="inline">{config.appName}</h1>
          <p className="inline">
            , teachers can receive questions, send polls, and keep large groups
            of students engaged from one realtime dashboard.
          </p>
        </div>
      </div>
      <p>Teacher?</p>
      <button onClick={teacherSignIn}>Start a Room</button>
      <p>Student?</p>
      <button>Join {config.appName} Room</button>
    </div>
  );

  async function teacherSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    window.location.href = '/new-room';
  }
};

export default Home;
