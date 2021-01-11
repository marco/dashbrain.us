import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as rooms from '../../frontend/lib/rooms';
import * as events from '../../frontend/lib/events';
import Loading from '../../frontend/components/Loading';
import firebase from 'firebase/app';
import { Formik, Form, Field } from 'formik';
import EventComponent from '../../frontend/components/events/Event';
import * as eventSender from '../../frontend/lib/event-sender';
import RaiseHandButton from '../../frontend/components/students/buttons/RaiseHandButton';
import QuestionButton from '../../frontend/components/students/buttons/QuestionButton';
import MessagesButton from '../../frontend/components/shared/buttons/MessagesButton';
import MessagesSheet, {
  MessagesSheetState,
  getGroupForEvent,
} from '../../frontend/components/shared/sheets/MessagesSheet';

let StudentRoomPage: React.FC = () => {
  let router = useRouter();
  let [hasJoined, setHasJoined] = useState(false);
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined>();
  let [messageSheetState, setMessageSheetState] = useState<
    MessagesSheetState | undefined
  >();

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
          let room = await rooms.join(router.query.id as string, values.name);

          if (!room) {
            // TODO: Show error;
            return;
          }

          await eventSender.sendStudentJoin(
            room,
            firebase.auth().currentUser?.uid as string
          );
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
          <div
            key={event.id}
            onClick={() => {
              if (event.type === 'message') {
                setMessageSheetState({
                  selectedGroup: getGroupForEvent(event, update!.room),
                  state: 'in_group',
                });
              }
            }}
          >
            <EventComponent
              event={event}
              room={update!.room}
              events={update!.events}
            />
          </div>
        ))}
      </div>
      <div>
        <RaiseHandButton room={update!.room} />
        <QuestionButton room={update!.room} />
        <MessagesButton
          onClick={() => setMessageSheetState({ state: 'groups_list' })}
        />
      </div>
      {messageSheetState ? (
        <MessagesSheet
          room={update.room}
          events={update.events}
          state={messageSheetState}
          onSetState={setMessageSheetState}
          onClose={() => setMessageSheetState(undefined)}
        />
      ) : null}
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
