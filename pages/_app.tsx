import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import config from '../frontend/config/config.json';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Loading from '../frontend/components/Loading';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

const AUTHED_PATHS = ['/t/[id]', '/new-room'];

if (firebase.apps.length === 0) {
  firebase.initializeApp(config.firebaseConfig);
}

let MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  let router = useRouter();
  let [authStateLoaded, setAuthStateLoaded] = useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setAuthStateLoaded(true);

      if (!user && AUTHED_PATHS.includes(router.pathname)) {
        router.push('/');
      }
    });
  }, [router]);

  if (!authStateLoaded && AUTHED_PATHS.includes(router.pathname)) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Dashbrain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7K7KGWWDHE"
        ></script>
        <script src="/static/analytics.js"></script>
      </Head>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={false}
        draggable={false}
        closeButton={false}
      />
    </>
  );
};

export default MyApp;
