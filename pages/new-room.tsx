import React, { useEffect } from 'react';
import * as errors from '../frontend/lib/errors';
import * as rooms from '../frontend/lib/rooms';
import Loading from '../frontend/components/Loading';
import { useRouter } from 'next/router';

let TeacherPage: React.FC = () => {
  let router = useRouter();

  useEffect(() => {
    (async () => {
      try {
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
