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
import * as users from '../frontend/lib/users';

let Home: React.FC = () => {
  let router = useRouter();

  return (
    <div>
      <div className={classNames(styles.bodyDiv, 'text-black overflow-hidden')}>
        <nav className="mb-10">
          <LogoType color="blue" className="ml-3 mt-3.5 inline-block" />
        </nav>
        <p className={classNames(styles.heroText, 'mb-4')}>
          Level Up Your
          <br />
          Zoom Rooms
        </p>
        <h2 className="text-base text-center tracking-tight mb-10">
          Dashbrain keeps teachers and students in-sync.
        </h2>
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
          description="Send polls to make sure everyone’s on the same page."
        />
        <FeatureItem
          imgSrc="assets/message/green.png"
          imgAlt="Send Message"
          imgClassName="w-4.5"
          className="w-56.5 mx-auto mb-6"
          description="Messages to specific groups, even in breakout rooms."
        />
        <p className="text-center mb-10">. . . and more!</p>
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
          className="block mx-auto mb-32"
        />
        <IndexTiles />
      </div>
      <div
        className={classNames(
          styles.footer,
          'bg-white w-full px-9 py-8 text-sm'
        )}
      >
        <p className="font-bold">© Dashbrain 2021</p>
        <p className="text-gray-500">
          <a href="mailto:dashbrain@dashbrain.us">Contact Us</a>
        </p>
      </div>
    </div>
  );

  async function teacherSignIn() {
    await firebase.auth().setPersistence('session');
    let provider = new firebase.auth.GoogleAuthProvider();
    let result = await firebase.auth().signInWithPopup(provider);

    if (result.user) {
      // Saving the user can be done asynchronously.
      users.saveUser(result.user);

      router.push('/new-room');
    }
  }

  function studentSignIn() {
    router.push('/join');
  }
};

export default Home;
