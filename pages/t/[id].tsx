import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import * as rooms from '../../frontend/lib/rooms';
import Loading from '../../frontend/components/Loading';
import EventComponent from '../../frontend/components/events/Event';
import PollButton from '../../frontend/components/teachers/buttons/PollButton';
import MessagesButton from '../../frontend/components/shared/buttons/MessagesButton';
import MessagesSheet, {
  MessagesSheetState,
  getGroupForEvent,
} from '../../frontend/components/shared/sheets/MessagesSheet';
import LogoType from '../../frontend/components/LogoType';
import TeacherNavBar from '../../frontend/components/NavBar';
import BottomController from '../../frontend/components/BottomController';
import styles from '../../styles/pages/teachers-students.module.scss';
import ExportButton from '../../frontend/components/teachers/export/ExportButton';
import ExitButton from '../../frontend/components/teachers/exit/ExitButton';

let TeacherRoomPage: React.FC = () => {
  let router = useRouter();
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined>();
  let [messageSheetState, setMessageSheetState] = useState<
    MessagesSheetState | undefined
  >();

  useEffect(() => {
    return rooms.listen(router.query.id as string, (update) => {
      setUpdate(update);
    });
  }, [router.query.id]);

  if (!update) {
    return <Loading />;
  }

  return (
    <div className={styles.bodyDiv}>
      <TeacherNavBar roomId={router.query.id as string} />
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
        <div className="h-72"></div>
      </div>
      <BottomController>
        <div>
          <MessagesButton
            onClick={() => setMessageSheetState({ state: 'groups_list' })}
            flatStyle={true}
          />
          <PollButton room={update!.room} events={update!.events} />
          <ExportButton />
          <ExitButton />
        </div>
      </BottomController>
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

export default TeacherRoomPage;
