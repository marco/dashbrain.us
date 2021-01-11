import Head from 'next/head';
import config from '../frontend/config/config.json';
import firebase from 'firebase/app';
import React from 'react';
import styles from '../styles/pages/index.module.scss';
import LogoType from '../frontend/components/LogoType';
import classNames from 'classnames';
import FeatureItem from '../frontend/components/index/FeatureItem';
import IndexButton from '../frontend/components/index/Button';

let Home: React.FC = () => {
  return (
    <div className={classNames(styles.bodyDiv, 'text-white overflow-hidden')}>
      <Head>
        <title>{config.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="mb-6">
        <LogoType color="white" className="ml-3 mt-3.5 inline-block" />
      </nav>
      <h2 className={classNames(styles.heroText, 'mb-5')}>
        Level Up Your
        <br />
        Zoom Rooms
      </h2>
      <p className="text-base leading-1 text-center tracking-tighter mb-12">
        Dashbrain helps everyone stay in-sync over video calls.
      </p>
      <FeatureItem
        imgSrc="assets/hand-icon.png"
        imgAlt="Raise Hand"
        imgClassName="w-4"
        className="w-56 mx-auto mb-4"
        description="Notifications when someone raises their hand."
      />
      <FeatureItem
        imgSrc="assets/poll-icon.png"
        imgAlt="Poll"
        imgClassName="w-4.5"
        className="w-56.5 mx-auto mb-4"
        description="Send polls — make sure everyone’s on the same page."
      />
      <FeatureItem
        imgSrc="assets/message-icon.png"
        imgAlt="Send Message"
        imgClassName="w-4.5"
        className="w-56.5 mx-auto mb-6.5"
        description="Messages to specific groups, even in breakout rooms."
      />
      <p className="text-center mb-10">. . . and more!</p>
      <p className="font-black tracking-tighter text-center mb-1.5">Teacher?</p>
      <p className="w-76 leading-none tracking-tighter text-center mx-auto mb-4">
        Dashbrain works with any video-calling software. Just open a new
        Dashbrain, send the code to your students, and get connected!
      </p>
      <IndexButton
        onClick={teacherSignIn}
        title="Create a Dashboard"
        className="block mx-auto mb-11"
      />
      <p className="font-black tracking-tighter text-center mb-1.5">Student?</p>
      <IndexButton
        onClick={teacherSignIn}
        title="Join a Dashboard"
        className="block mx-auto mb-12"
      />
      <div className={styles.backgroundTiles}></div>
      <div className={styles.backgroundGradient}></div>
    </div>
  );

  async function teacherSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    window.location.href = '/new-room';
  }
};

export default Home;
