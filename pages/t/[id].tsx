import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as rooms from '../../frontend/lib/rooms';
import Loading from '../../frontend/components/Loading';
import EventComponent from '../../frontend/components/events/Event';

let TeacherRoomPage: React.FC = () => {
  let router = useRouter();
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined>();

  useEffect(() => {
    return rooms.listen(router.query.id as string, (update) => {
      setUpdate(update);
    });
  }, [router.query.id]);

  if (!update) {
    return <Loading />;
  }

  return (
    <div>
      <div>Room Code: {update.room.id}</div>
      <div>
        {update.events.map((event) => (
          <EventComponent event={event} room={update!.room} key={event.id} />
        ))}
      </div>
    </div>
  );
};

export default TeacherRoomPage;
