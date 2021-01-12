import Head from 'next/head';
import config from '../frontend/config/config.json';
import firebase from 'firebase/app';
import React from 'react';
import styles from '../styles/pages/index.module.scss';
import LogoType from '../frontend/components/LogoType';
import classNames from 'classnames';
import FeatureItem from '../frontend/components/index/FeatureItem';
import IndexButton from '../frontend/components/index/Button';
import IndexTiles from '../frontend/components/index/Tiles';
import { useRouter } from 'next/router';

let Home: React.FC = () => {
  let router = useRouter();

  return (
    <div className={classNames(styles.bodyDiv, 'text-black overflow-hidden')}>
      <nav className="mb-8">
        <LogoType color="blue" className="ml-3 mt-3.5 inline-block" />
      </nav>
      <h2 className={classNames(styles.heroText, 'mb-4')}>
        Level Up Your
        <br />
        Zoom Rooms
      </h2>
      <p className="text-base leading-1 text-center tracking-tight mb-12">
        Dashbrain helps everyone stay in-sync over video calls.
      </p>
      <FeatureItem
        imgSrc="assets/hand/blue.png"
        imgAlt="Raise Hand"
        imgClassName="w-4"
        className="w-56 mx-auto mb-4"
        description="Notifications when someone raises their hand."
      />
      <FeatureItem
        imgSrc="assets/poll/orange.png"
        imgAlt="Poll"
        imgClassName="w-4.5"
        className="w-56.5 mx-auto mb-4"
        description="Send polls — make sure everyone’s on the same page."
      />
      <FeatureItem
        imgSrc="assets/message/green.png"
        imgAlt="Send Message"
        imgClassName="w-4.5"
        className="w-56.5 mx-auto mb-6.5"
        description="Messages to specific groups, even in breakout rooms."
      />
      <p className="text-center mb-12">. . . and more!</p>
      <p className="font-black tracking-tight text-center mb-1.5">Teacher?</p>
      <p className="w-76 leading-none tracking-tight text-center mx-auto mb-4">
        Dashbrain works with any video-calling software. Just open a new
        Dashbrain, send the code to your students, and get connected!
      </p>
      <IndexButton
        onClick={teacherSignIn}
        title="Create a Dashbrain"
        className="block mx-auto mb-8"
      />
      <p className="font-black tracking-tight text-center mb-1.5">Student?</p>
      <IndexButton
        onClick={studentSignIn}
        title="Join a Dashbrain"
        className="block mx-auto mb-8"
      />
      <IndexTiles />
    </div>
  );

  async function teacherSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    router.push('/new-room');
  }

  function studentSignIn() {
    router.push('/j');
  }
};

export default Home;
