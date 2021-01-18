import React, { useEffect, useRef, useState } from 'react';
import { Event, EventMessage, getUidDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import Sheet from '../../Sheet';
import _ from 'lodash';
import firebase from 'firebase/app';
import * as eventSender from '../../../lib/event-sender';
import { Field, Form, Formik } from 'formik';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import classNames from 'classnames';
import * as vocab from '../../../lib/vocabulary';

let MessagesSheet: React.FC<{
  room: Room;
  events: Event[];
  state: MessagesSheetState;
  hidden: boolean;
  onClose: () => void;
  onSetState: (state: MessagesSheetState) => void;
  onSeeMessages: (eventIds: string[]) => void;
}> = (props) => {
  let [optionsSaveState, setOptionsSaveState] = useState<
    'none' | 'saving' | 'saved'
  >('none');
  let groups = getExistingGroups();

  return (
    <Sheet
      hidden={props.hidden}
      onClose={() => {
        props.onClose();
        setOptionsSaveState('none');
      }}
      className="h-120 max-h-7/8"
    >
      {renderContents()}
    </Sheet>
  );

  function renderContents() {
    if (props.state.state === 'groups_list') {
      return (
        <div className="p-8 pb-0 flex flex-col h-full overflow-scroll">
          <p className="font-bold text-xl tracking-tight mb-3">
            Messages
            <div
              onClick={() => props.onSetState({ state: 'new_group' })}
              className={classNames(
                'p-2.5 ml-2 cursor-pointer text-white blueButton inline-block align-middle'
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#fff"
                className="w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </p>
          <GroupsList
            groups={groups}
            room={props.room}
            onSelect={(index) => {
              props.onSetState({
                state: 'in_group',
                selectedGroup: groups[index],
              });
            }}
          />
          {props.room.teacherUid === firebase.auth().currentUser?.uid ? (
            <>
              <p className="font-bold text-lg tracking-tight mt-4">
                Options
                {optionsSaveState === 'saving'
                  ? ' (Saving...)'
                  : optionsSaveState === 'saved'
                  ? ' (Saved!)'
                  : ''}
              </p>
              <p className="text-gray-500 mb-2">
                This section is only visible to you.
              </p>
              <p className="w-full pb-8">
                <input
                  type="checkbox"
                  className="inline"
                  checked={props.room.options.studentsCanMessageEachOther}
                  onChange={async (event) => {
                    setOptionsSaveState('saving');
                    await firebase
                      .firestore()
                      .collection('rooms')
                      .doc(props.room.id)
                      .update({
                        [`options.studentsCanMessageEachOther`]: event.target
                          .checked,
                      });
                    setOptionsSaveState('saved');
                  }}
                />{' '}
                Let {vocab.getParticipantWord()}s message each other.
              </p>
            </>
          ) : null}
        </div>
      );
    }
    if (props.state.state === 'new_group') {
      return (
        <>
          {renderBackButton()}
          <NewGroup
            room={props.room}
            onSubmit={async (group: Group) => {
              if (!group.displayAsEveryone) {
                (group as SpecificGroup).uids = _.uniq(
                  (group as SpecificGroup).uids.concat([
                    firebase.auth().currentUser?.uid as string,
                  ])
                );
              }

              props.onSetState({
                state: 'in_group',
                selectedGroup: group,
              });
            }}
          />
        </>
      );
    }
    if (props.state.state === 'in_group') {
      let selectedGroup = props.state.selectedGroup;

      return (
        <div className="p-8 pb-0 flex flex-col h-full">
          {renderBackButton()}
          <div className="font-bold text-center text-xl">
            {selectedGroup.title}
          </div>
          <hr className="mt-2" />
          <MessagesList
            events={props.events}
            room={props.room}
            group={selectedGroup}
            onSeeMessages={props.onSeeMessages}
          />
          <hr />
          <MessageSendBox
            onSubmit={async (values) => {
              let uids = selectedGroup.displayAsEveryone
                ? _.uniq(
                    [props.room.teacherUid].concat(
                      Object.keys(props.room.students)
                    )
                  )
                : (selectedGroup as SpecificGroup).uids;

              eventSender.sendMessage(
                props.room,
                uids,
                values.text,
                selectedGroup.displayAsEveryone
              );
            }}
          />
        </div>
      );
    }

    function renderBackButton() {
      return (
        <div className="text-brand-blue absolute left-1 top-2 w-8 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={() => {
              props.onSetState({ state: 'groups_list' });
            }}
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    }
  }

  function getExistingGroups(): Group[] {
    let groups: Group[] = [];
    let seenGroupUidStrings = new Set<string>();

    for (let event of props.events) {
      if (event.type === 'message') {
        let group = getGroupForEvent(event, props.room);

        if (seenGroupUidStrings.has(group.computedUidsString)) {
          continue;
        }

        if (
          !group.displayAsEveryone &&
          getGroupUidsExcludingCurrentUser((group as SpecificGroup).uids)
            .length === 0
        ) {
          continue;
        }

        groups.push(group);
        seenGroupUidStrings.add(group.computedUidsString);
      }
    }

    return groups;
  }
};

function getGroupUidsExcludingCurrentUser(uids: string[]): string[] {
  return uids.filter((uid) => uid !== firebase.auth().currentUser?.uid);
}

let GroupsList: React.FC<{
  groups: Group[];
  room: Room;
  onSelect: (index: number) => void;
}> = (props) => {
  if (props.groups.length === 0) {
    return (
      <div className="text-center py-2 pb-8 space-y-3 text-gray-500 flex-1">
        <p>You haven&apos;t sent or received any messages yet.</p>
        <p>
          You can send a new message to a specific person, group, or everyone by
          clicking the &ldquo;+&rdquo; button above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-8">
      <div className="border-b-2 border-gray-200"></div>
      {props.groups
        .filter((group) => group.lastEvent)
        .map((group, index) => (
          <div
            key={group.computedUidsString}
            onClick={() => props.onSelect(index)}
            className="flex py-2 border-b-2 border-gray-200 cursor-pointer items-center"
          >
            <div className="flex-shrink overflow-hidden">
              <p className="font-bold">{group.title}</p>
              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                {group.lastEvent!.text}
              </p>
            </div>
            <div className="flex-1"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#bbb"
              className="w-5"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
    </div>
  );
};

let NewGroup: React.FC<{
  room: Room;
  onSubmit: (group: Group) => Promise<void>;
}> = (props) => {
  let shouldShowTeacher =
    props.room.teacherUid !== firebase.auth().currentUser?.uid;
  let filteredStudents = Object.values(props.room.students).filter(
    (student) =>
      student.uid !== firebase.auth().currentUser?.uid &&
      props.room.options.studentsCanMessageEachOther
  );

  if (!shouldShowTeacher && filteredStudents.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-10 text-center">
        You are the only one in Dashbrain right now.
      </div>
    );
  }

  return (
    <div className="p-8 pt-12 overflow-scroll h-full">
      <p className="font-bold text-xl tracking-tight">New Group</p>
      <p className="mt-4 mb-1 text-left text-sm text-gray-500">
        Send a message to everyone in the Dashbrain:
      </p>
      <div
        onClick={() => props.onSubmit(new EveryoneGroup())}
        className={classNames(
          'text-white text-center mb-6 blueButton cursor-pointer'
        )}
      >
        <div>Message Everyone</div>
      </div>
      <hr className="border-1 mb-4" />
      <p className="text-sm text-gray-500 mb-1">
        Or select who to message.
        {!props.room.options.studentsCanMessageEachOther &&
        shouldShowTeacher ? (
          <>
            {' '}
            {vocab.isSchool() ? 'Your teacher' : 'The host'} has disabled
            messages between {vocab.getParticipantWord()}s, but you can still
            message everyone at once using the “Message&nbsp;Everyone” button
            above.
          </>
        ) : (
          ''
        )}
        {(shouldShowTeacher ? 1 : 0) + filteredStudents.length > 1
          ? ' You can choose more than one user to start a group chat.'
          : ''}
      </p>
      <Formik
        initialValues={{ selected: [] as string[] }}
        onSubmit={(values) =>
          props.onSubmit(new SpecificGroup(props.room, values.selected))
        }
      >
        {({ isSubmitting, values }) => (
          <Form>
            {shouldShowTeacher ? (
              <div>
                <Field
                  name="selected"
                  type="checkbox"
                  value={props.room.teacherUid}
                />{' '}
                {props.room.teacherName}
              </div>
            ) : null}
            {filteredStudents.map((student) => (
              <div key={student.uid}>
                <Field name="selected" type="checkbox" value={student.uid} />{' '}
                {student.name}
              </div>
            ))}
            <div>
              <button
                disabled={isSubmitting || values.selected.length === 0}
                className={classNames(
                  'text-white text-center mb-6 block w-full mt-2 blueButton',
                  { 'cursor-default': values.selected.length === 0 }
                )}
              >
                Message Selected
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

let MessagesList: React.FC<{
  group: Group;
  events: Event[];
  room: Room;
  onSeeMessages: (eventIds: string[]) => void;
}> = (props) => {
  let listElementRef = useRef<HTMLDivElement | null>(null);
  let [
    lastMessageCountWhenScrolled,
    setLastMessageCountWhenScrolled,
  ] = useState(0);

  let filteredEvents = props.events.filter(
    (event) =>
      event.type === 'message' && checkEventMatchesGroup(event, props.group)
  ) as EventMessage[];

  useEffect(() => {
    if (filteredEvents.length > lastMessageCountWhenScrolled) {
      listElementRef.current?.scroll(0, listElementRef.current?.scrollHeight);
      setLastMessageCountWhenScrolled(filteredEvents.length);
      props.onSeeMessages(filteredEvents.map((event) => event.id));
    }
  }, [filteredEvents]);

  if (filteredEvents.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-6 flex-1">
        No messages yet...
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-scroll scroll-smooth px-3 pt-2"
      ref={listElementRef}
    >
      {_.reverse(filteredEvents).map((event) => (
        <MessageBubble event={event} room={props.room} key={event.id} />
      ))}
    </div>
  );
};

let MessageBubble: React.FC<{ event: EventMessage; room: Room }> = (props) => {
  return (
    <div
      className={classNames(
        'max-w-3/4 py-2 px-3 rounded-lg rounded-br-sm inline-block my-1 shadow-inner clear-both',
        {
          'bg-brand-blue text-left text-white float-right':
            props.event.senderUid === firebase.auth().currentUser?.uid,
          'bg-gray-100 float-left':
            props.event.senderUid !== firebase.auth().currentUser?.uid,
        }
      )}
    >
      <p className="leading-tight mb-1">{props.event.text}</p>
      <p className="text-xs leading-none">
        {getUidDetails(props.event.senderUid, props.room).name}
      </p>
    </div>
  );
};

let MessageSendBox: React.FC<{
  onSubmit: (values: { text: string }) => Promise<void>;
}> = (props) => {
  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={async (values, formik) => {
        formik.setFieldValue('text', '');
        await props.onSubmit(values);
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="w-full py-2 flex">
          <Field
            name="text"
            required={true}
            className="input flex-1"
            placeholder="Your message"
          />
          <button
            type="submit"
            disabled={isSubmitting || !values.text}
            className={classNames('blueButton text-white px-2 ml-2', {
              blueButtonDisabled: !values.text,
            })}
          >
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
};

export interface Group {
  title: string;
  computedUidsString: string;
  lastEvent?: EventMessage;
  displayAsEveryone: boolean;
}

export function checkEventMatchesGroup(event: EventMessage, group: Group) {
  if (event.displayAsSentToEveryone && group.displayAsEveryone) {
    return true;
  }

  // The user would only ever have access to messages that were in *one* of their
  // groups, but this specific message could belong in their group with another
  // user.
  let messageMembers = new Set(event.recipientUids.concat(event.senderUid));
  let groupMembers = new Set((group as SpecificGroup).uids);

  if (messageMembers.size !== groupMembers.size) {
    return false;
  }

  for (let memberUid of Array.from(messageMembers)) {
    if (!groupMembers.has(memberUid)) {
      return false;
    }
  }

  // Even if they completely match, this still shouldn't be grouped into
  // the same as the "everyone" category.
  if (event.displayAsSentToEveryone !== group.displayAsEveryone) {
    return false;
  }

  return true;
}

class SpecificGroup implements Group {
  title: string;
  computedUidsString: string;
  displayAsEveryone = false;

  constructor(
    room: Room,
    public uids: string[],
    public lastEvent?: EventMessage
  ) {
    this.title = getGroupUidsExcludingCurrentUser(uids)
      .map((uid) => getUidDetails(uid, room).name)
      .join(', ');
    this.computedUidsString = _.sortBy(uids).join('__');
  }
}

class EveryoneGroup implements Group {
  title = 'Everyone';
  computedUidsString = 'everyone';
  displayAsEveryone = true;

  constructor(public lastEvent?: EventMessage) {}
}

export function getGroupForEvent(event: EventMessage, room: Room): Group {
  if (event.displayAsSentToEveryone) {
    return new EveryoneGroup(event);
  } else {
    return new SpecificGroup(room, event.recipientUids, event);
  }
}

export type MessagesSheetState =
  | { state: 'groups_list' }
  | { state: 'new_group' }
  | { state: 'in_group'; selectedGroup: Group };

export default MessagesSheet;
