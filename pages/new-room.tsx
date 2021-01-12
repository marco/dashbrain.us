import React, { useEffect } from 'react';
import * as errors from '../frontend/lib/errors';
import * as rooms from '../frontend/lib/rooms';
import Loading from '../frontend/components/Loading';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';

let TeacherPage: React.FC = () => {
  let router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        if (!firebase.auth().currentUser?.uid) {
          return;
        }

        await rooms.deleteCurrentRoom();
        let roomId = await rooms.generateId();
        router.push('/t/' + roomId);
      } catch (error) {
        errors.handleError(error);
      }
    })();
  }, []);

  return <Loading />;
};

export default TeacherPage;
