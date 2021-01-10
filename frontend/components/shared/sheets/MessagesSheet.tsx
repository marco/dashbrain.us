import React, { useState } from 'react';
import { Event, EventMessage, getUidDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import Sheet from '../../Sheet';
import _ from 'lodash';
import firebase from 'firebase/app';
import * as eventSender from '../../../lib/event-sender';
import { Field, Form, Formik } from 'formik';

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
        <>
          <div onClick={() => props.onSetState({ state: 'new_group' })}>
            + New Message
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
        </>
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
        <>
          <div>
            <button
              onClick={() => {
                props.onSetState({ state: 'groups_list' });
              }}
            >
              Back
            </button>{' '}
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
        </>
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
          >
            <p>{group.title}</p>
            <p>
              {getUidDetails(group.lastEvent!.senderUid, props.room).name} —{' '}
              {group.lastEvent!.text}
            </p>
          </div>
        ))}
    </div>
  );
};

let NewGroup: React.FC<{
  room: Room;
  onSubmit: (group: Group) => Promise<void>;
}> = (props) => {
  return (
    <div>
      <p>Send a message to everyone...</p>
      <div onClick={() => props.onSubmit(new EveryoneGroup())}>
        {
          // TODO: "next" caret.
        }
        Everyone &gt;
      </div>
      <p>
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
            <div>
              {props.room.teacherName}
              <Field
                name="selected"
                type="checkbox"
                value={props.room.teacherUid}
              />
            </div>
            {Object.values(props.room.students).map((student) => (
              <div key={student.uid}>
                {student.name}
                <Field name="selected" type="checkbox" value={student.uid} />
              </div>
            ))}
            <div>
              <button disabled={isSubmitting || values.selected.length === 0}>
                Done
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
    <div>
      <p>{props.event.text}</p>
      <p>{getUidDetails(props.event.senderUid, props.room).name}</p>
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
        <Form>
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
