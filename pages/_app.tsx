import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import '../styles/globals.css';
import config from '../frontend/config/config.json';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Loading from '../frontend/components/Loading';
import Head from 'next/head';

const AUTHED_PATHS = ['/new-room'];
const UNAUTHED_PATHS = ['/'];

if (firebase.apps.length === 0) {
  firebase.initializeApp(config.firebaseConfig);
}

let MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  let router = useRouter();
  let [authStateLoaded, setAuthStateLoaded] = useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setAuthStateLoaded(true);

      if (user) {
        if (!AUTHED_PATHS.includes(router.pathname)) {
          // window.location.href = AUTHED_PATHS[0];
        }
      } else {
        if (!UNAUTHED_PATHS.includes(router.pathname)) {
          // window.location.href = UNAUTHED_PATHS[0];
        }
      }
    });
  }, [router]);

  if (!authStateLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Dashbrain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
