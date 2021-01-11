import React, { useState } from 'react';
import { Event, EventMessage, getUidDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import Sheet from '../../Sheet';
import _ from 'lodash';
import firebase from 'firebase/app';
import * as eventSender from '../../../lib/event-sender';
import { Field, Form, Formik } from 'formik';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import classNames from 'classnames';

let MessagesSheet: React.FC<{
  room: Room;
  events: Event[];
  state: MessagesSheetState;
  onClose: () => void;
  onSetState: (state: MessagesSheetState) => void;
}> = (props) => {
  let groups = getExistingGroups();

  return <Sheet onClose={props.onClose}>{renderContents()}</Sheet>;

  function renderContents() {
    if (props.state.state === 'groups_list') {
      return (
        <div className="p-8">
          <p className="font-bold text-xl tracking-tight">Messages</p>
          <div
            onClick={() => props.onSetState({ state: 'new_group' })}
            className={classNames(
              // 'mt-2 py-4 border-b-2 border-t-2 border-gray-200 cursor-pointer',
              'mt-4 py-4 mb-1 cursor-pointer text-blue-600 border-b-2 border-t-2 border-gray-200 flex'
            )}
          >
            <div>New Group</div>
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
        </div>
      );
    }
    if (props.state.state === 'new_group') {
      return (
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
      );
    }
    if (props.state.state === 'in_group') {
      let selectedGroup = props.state.selectedGroup;

      return (
        <div className="p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#0054D2"
            onClick={() => {
              props.onSetState({ state: 'groups_list' });
            }}
            className="absolute left-1 top-2 w-8"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <div className="font-bold text-center text-xl">
            {selectedGroup.title}
          </div>
          <MessagesList
            events={props.events}
            room={props.room}
            group={selectedGroup}
          />
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
    return <div>No messages yet...</div>;
  }

  return (
    <div>
      {props.groups
        .filter((group) => group.lastEvent)
        .map((group, index) => (
          <div
            key={group.computedUidsString}
            onClick={() => props.onSelect(index)}
            className="flex py-2 border-b-2 border-gray-200 cursor-pointer"
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
    (student) => student.uid !== firebase.auth().currentUser?.uid
  );

  if (!shouldShowTeacher && filteredStudents.length === 0) {
    return <div>You are the only one in the room.</div>;
  }

  return (
    <div className="p-8">
      <p className="font-bold text-xl tracking-tight">New Group</p>
      <p className="mt-2 mb-1 text-left text-sm">Send a message to everyone:</p>
      <div
        onClick={() => props.onSubmit(new EveryoneGroup())}
        className={classNames('text-white text-center mb-6 blueButton')}
      >
        <div>Message Everyone</div>
      </div>
      <p className="text-sm">
        Or select who to message. Choose more than one to start a group chat.
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
                {props.room.teacherName}
                <Field
                  name="selected"
                  type="checkbox"
                  value={props.room.teacherUid}
                />
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
                  'text-white text-center mb-6 block w-full mt-2 blueButton'
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

let MessagesList: React.FC<{ group: Group; events: Event[]; room: Room }> = (
  props
) => {
  let filteredEvents = props.events.filter(
    (event) => event.type === 'message' && checkEventMatchesGroup(event)
  ) as EventMessage[];

  if (filteredEvents.length === 0) {
    return <div>No messages yet...</div>;
  }

  return (
    <div>
      {filteredEvents.map((event) => (
        <MessageBubble event={event} room={props.room} key={event.id} />
      ))}
    </div>
  );

  function checkEventMatchesGroup(event: EventMessage) {
    if (event.displayAsSentToEveryone && props.group.displayAsEveryone) {
      return true;
    }

    // The user would only ever have access to messages that were in *one* of their
    // groups, but this specific message could belong in their group with another
    // user.
    let messageMembers = new Set(event.recipientUids.concat(event.senderUid));
    let groupMembers = new Set((props.group as SpecificGroup).uids);

    if (messageMembers.size !== groupMembers.size) {
      return false;
    }

    for (let memberUid in messageMembers) {
      if (!groupMembers.has(memberUid)) {
        return false;
      }
    }

    return true;
  }
};

let MessageBubble: React.FC<{ event: EventMessage; room: Room }> = (props) => {
  return (
    <div
      className={classNames(
        'max-w-3/4 py-2 px-3 rounded-md inline-block my-1 shadow-sm',
        {
          'bg-blue-700 text-right text-white float-left clear-left':
            props.event.senderUid === firebase.auth().currentUser?.uid,
          'bg-gray-100 float-left clear-left':
            props.event.senderUid !== firebase.auth().currentUser?.uid,
        }
      )}
    >
      <p>{props.event.text}</p>
      <p className="text-sm leading-none">
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
      {({ isSubmitting }) => (
        <Form className="absolute bottom-0 left-0 right-0">
          <Field name="text" required={true} />
          <button type="submit" disabled={isSubmitting}>
            Send
          </button>
        </Form>
      )}
    </Formik>
  );
};

interface Group {
  title: string;
  computedUidsString: string;
  lastEvent?: EventMessage;
  displayAsEveryone: boolean;
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
