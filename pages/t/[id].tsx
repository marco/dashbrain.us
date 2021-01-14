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
import EventsList from '../../frontend/components/events/Events';
import Head from 'next/head';
import * as devices from '../../frontend/lib/devices';

let TeacherRoomPage: React.FC = () => {
  let router = useRouter();
  let [update, setUpdate] = useState<rooms.ListenerUpdate | undefined | null>();
  let [seenMessageIds, setSeenMessageIds] = useState<Set<string>>(new Set());
  let [messageSheetState, setMessageSheetState] = useState<
    MessagesSheetState | undefined
  >();

  useEffect(() => {
    if (!firebase.auth().currentUser?.uid) {
      return;
    }

    return rooms.listen(router.query.id as string, (update) => {
      setUpdate(update);
    });
  }, [router.query.id]);

  if (!update) {
    return <Loading />;
  }

  return (
    <div className={styles.bodyDiv}>
      <Head>
        <title>Dashbrain | #{router.query.id}</title>
      </Head>
      <TeacherNavBar
        roomId={router.query.id as string}
        room={update.room}
        events={update.events}
        allowLogoCollapse={true}
      />
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
        <div className="h-72"></div>
      </div>
      <BottomController>
        <div>
          <MessagesButton
            onClick={() => setMessageSheetState({ state: 'groups_list' })}
            flatStyle={true}
            unreadCount={
              update.events.filter(
                (event) =>
                  event.type === 'message' && !seenMessageIds.has(event.id)
              ).length
            }
          />
          <PollButton room={update!.room} events={update!.events} />
          {devices.isMobileSafari() ? null : <ExportButton />}
          <ExitButton room={update!.room} />
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

export default TeacherRoomPage;
