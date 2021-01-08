import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import '../styles/globals.css';
import config from '../frontend/config/config.json';
import { useRouter } from 'next/router';

const AUTHED_PATHS = ['/t'];
const UNAUTHED_PATHS = ['/'];

if (firebase.apps.length === 0) {
  firebase.initializeApp(config.firebaseConfig);
}

function MyApp({ Component, pageProps }) {
  let router = useRouter();

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!AUTHED_PATHS.includes(router.pathname)) {
          window.location.href = AUTHED_PATHS[0];
        }
      } else {
        if (!UNAUTHED_PATHS.includes(router.pathname)) {
          window.location.href = UNAUTHED_PATHS[0];
        }
      }
    });
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
