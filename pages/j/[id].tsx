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
import LogoType from '../../frontend/components/LogoType';
import styles from '../../styles/pages/teachers-students.module.scss';
import TeacherNavBar from '../../frontend/components/NavBar';
import BottomController from '../../frontend/components/BottomController';
import classNames from 'classnames';
import EventsList from '../../frontend/components/events/Events';
import IndexTiles from '../../frontend/components/index/Tiles';
import { toast } from 'react-toastify';

let StudentRoomPage: React.FC = () => {
  let router = useRouter();
  let [hasJoined, setHasJoined] = useState(false);
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined | null>();
  let [messageSheetState, setMessageSheetState] = useState<
    MessagesSheetState | undefined
  >();
  let [seenMessageIds, setSeenMessageIds] = useState<Set<string>>(new Set());

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
        roomId={router.query.id as string}
        onSubmit={async (values) => {
          let room = await rooms.join(router.query.id as string, values.name);

          if (!room) {
            // TODO: Show error;
            return;
          }

          await Promise.all([
            await eventSender.sendWelcomeMessage(
              room,
              firebase.auth().currentUser?.uid as string
            ),
            await eventSender.sendStudentJoin(
              room,
              firebase.auth().currentUser?.uid as string
            ),
          ]);
          setHasJoined(true);
        }}
      />
    );
  }

  if (update === null) {
    return (
      <div className={classNames(styles.bodyDiv, 'h-full')}>
        <TeacherNavBar roomId={router.query.id as string} />
        <div className="p-4 pb-32 h-full flex flex-col items-center justify-center w-96 mx-auto">
          <p>
            This Dashbrain does not exist or has been ended. Please try another
            ID.
          </p>
          <button
            className="blueButton text-white w-full mt-4"
            onClick={() => {
              router.push('/');
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (update === undefined) {
    return <Loading />;
  }

  return (
    <div className={styles.bodyDiv}>
      <TeacherNavBar roomId={update.room.id} />
      <div>
        <EventsList
          room={update.room}
          events={update.events}
          seenIds={seenMessageIds}
          selectedMessageGroup={
            messageSheetState?.state === 'in_group'
              ? messageSheetState.selectedGroup
              : undefined
          }
          onClickEvent={(event) => {
            if (event.type === 'message') {
              setMessageSheetState({
                selectedGroup: getGroupForEvent(event, update!.room),
                state: 'in_group',
              });
            }
          }}
        />
      </div>
      <BottomController>
        <div className="flex items-stretch h-60 w-full">
          <div className="flex items-stretch flex-col flex-1">
            <QuestionButton room={update!.room} />
            <MessagesButton
              onClick={() => setMessageSheetState({ state: 'groups_list' })}
              flatStyle={false}
            />
          </div>
          <RaiseHandButton room={update!.room} events={update!.events} />
        </div>
      </BottomController>
      <MessagesSheet
        hidden={!messageSheetState}
        room={update.room}
        events={update.events}
        state={messageSheetState || { state: 'groups_list' }}
        onSetState={setMessageSheetState}
        onClose={() => setMessageSheetState(undefined)}
        onSeeMessages={(newSeenIds) => {
          setSeenMessageIds((oldSeenIds) => {
            let newSet = new Set(oldSeenIds);
            for (let id of newSeenIds) {
              newSet.add(id);
            }
            return newSet;
          });
        }}
      />
    </div>
  );
};

let NamePrompt: React.FC<{
  roomId: string;
  onSubmit: (values: { name: string }) => Promise<void>;
}> = (props) => {
  return (
    <div className="h-full w-full relative overflow-hidden">
      <div className="flex items-center justify-center h-full flex-col pb-6">
        <LogoType color="blue" className="text-center" size="xl" />
        <Formik
          initialValues={{ name: '' }}
          onSubmit={async (values) => {
            let available = await rooms.checkNameAvailable(
              props.roomId,
              values.name
            );
            if (available) {
              await props.onSubmit(values);
              toast.dismiss();
            } else {
              toast.error('That name is already taken.');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="w-64">
              <Field
                name="name"
                required
                className="input w-full mt-6 text-center text-lg py-0.5"
                placeholder="Your Name"
              />
              <button
                type="submit"
                className="blueButton block w-full text-white font-black mt-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <IndexTiles />
    </div>
  );
};

export default StudentRoomPage;
