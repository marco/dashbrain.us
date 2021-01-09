import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as rooms from '../../frontend/lib/rooms';
import Loading from '../../frontend/components/Loading';
import { Formik, Form, Field } from 'formik';
import EventComponent from '../../frontend/components/events/Event';
import * as eventSender from '../../frontend/lib/event-sender';

let StudentRoomPage: React.FC = () => {
  let router = useRouter();
  let [hasJoined, setHasJoined] = useState(false);
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined>();

  useEffect(() => {
    if (hasJoined) {
      return rooms.listen(router.query.id as string, (update) => {
        setUpdate(update);
      });
    }
  }, [hasJoined, router.query.id]);

  if (!hasJoined) {
    return (
      <NamePrompt
        onSubmit={async (values) => {
          await rooms.join(router.query.id as string, values.name);
          setHasJoined(true);
        }}
      />
    );
  }

  if (!update) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        {update.events.map((event) => (
          <EventComponent event={event} room={update!.room} key={event.id} />
        ))}
      </div>
      <div>
        <button onClick={() => eventSender.raiseHand(update!.room)} />
      </div>
    </div>
  );
};

let NamePrompt: React.FC<{
  onSubmit: (values: { name: string }) => Promise<void>;
}> = (props) => {
  return (
    <div>
      <Formik initialValues={{ name: '' }} onSubmit={props.onSubmit}>
        <Form>
          <Field name="name" required />
          <button type="submit">Join</button>
        </Form>
      </Formik>
    </div>
  );
};

export default StudentRoomPage;