import React, { useEffect } from 'react';
import * as errors from '../frontend/lib/errors';
import * as rooms from '../frontend/lib/rooms';
import Loading from '../frontend/components/Loading';

let TeacherPage: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        let roomId = await rooms.generateId();
        window.location.href = '/t/' + roomId;
      } catch (error) {
        errors.handleError(error);
      }
    })();
  }, []);

  return <Loading />;
};

export default TeacherPage;
