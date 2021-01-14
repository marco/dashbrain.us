import React, { useEffect } from 'react';
import * as errors from '../frontend/lib/errors';
import * as rooms from '../frontend/lib/rooms';
import Loading from '../frontend/components/Loading';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import * as analytics from '../frontend/lib/analytics';
import { toast } from 'react-toastify';

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
        analytics.sendEventNewRoom(roomId);

        // In case the user went to "Join a Dashbrain," prompted an error,
        // went back, and tried to create a room, delete any toasts.
        toast.dismiss();

        router.push('/t/' + roomId);
      } catch (error) {
        errors.handleError(error);
      }
    })();
  }, []);

  return <Loading />;
};

export default TeacherPage;
