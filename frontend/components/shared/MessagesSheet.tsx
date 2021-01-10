import React, { useState } from 'react';
import { Event, EventMessage, getUidDetails } from '../../lib/events';
import { Room } from '../../lib/rooms';
import Sheet from '../Sheet';
import _ from 'lodash';
import firebase from 'firebase/app';
import * as eventSender from '../../lib/event-sender';
import { Field, Form, Formik } from 'formik';

let MessagesSheet: React.FC<{
  onClose: () => void;
  room: Room;
  events: Event[];
}> = (props) => {
  let [state, setState] = useState<'groups_list' | 'new_group' | 'in_group'>(
    'groups_list'
  );
  let [selectedGroup, setSelectedGroup] = useState<Group | undefined>();
  let groups = getExistingGroups();

  return (
    <Sheet onClose={props.onClose}>
      {state === 'groups_list' ? (
        <>
          <div onClick={() => setState('new_group')}>+ New Message</div>
          <GroupsList
            groups={groups}
            room={props.room}
            onSelect={(index) => {
              setSelectedGroup(groups[index]);
              setState('in_group');
            }}
          />
        </>
      ) : null}
      {state === 'new_group' ? (
        <NewGroup
          room={props.room}
          onSubmit={async (selectedUids, displaySentToEveryone) => {
            let uidsWithCurrentUid = _.uniq(
              selectedUids.concat([firebase.auth().currentUser?.uid as string])
            );

            setSelectedGroup({
              uids: uidsWithCurrentUid,
              title: convertUidsToTitle(selectedUids),
              computedUidsString: convertUidsToString(uidsWithCurrentUid),
              displayAsEveryone: displaySentToEveryone,
            });
            setState('in_group');
          }}
        />
      ) : null}
      {state === 'in_group' ? (
        <>
          <div>
            <button
              onClick={() => {
                setState('groups_list');
                setSelectedGroup(undefined);
              }}
            >
              Back
            </button>{' '}
            {selectedGroup!.title}
          </div>
          <MessagesList
            events={props.events}
            room={props.room}
            group={selectedGroup!}
          />
          <MessageSendBox
            onSubmit={async (values) => {
              eventSender.sendMessage(
                props.room,
                selectedGroup!.uids,
                values.text,
                selectedGroup!.displayAsEveryone
              );
            }}
          />
        </>
      ) : null}
    </Sheet>
  );

  function getExistingGroups(): ExistingGroup[] {
    let groups: ExistingGroup[] = [];
    let seenGroupUidStrings = new Set<string>();

    let currentUid = firebase.auth().currentUser?.uid;

    for (let event of props.events) {
      if (event.type === 'message') {
        // It's important to have the most up-to-date version of "everyone",
        // since the last sent message to everyone could actually be missing
        // some recently joined members (or have some who have left). If
        // the old value is used instead of a recomputed one, not everyone
        // would receive a newly sent message from the currently authed user.
        //
        // Also, this is useful because it means the same group UID array
        // will be found (and therefore same computed string) for even the old,
        // now-innacurate group events. By using the same string for all events
        // sent to "everyone," all these messages will produce one group. Otherwise,
        // there would be a separate "everyone" for each distinct phase of
        // `groupUids` when someone, for example, joined after an everyone message
        // had already been sent.
        let groupUids = event.displayAsSentToEveryone
          ? _.uniq(
              [props.room.teacherUid].concat(Object.keys(props.room.students))
            )
          : _.uniq([event.senderUid].concat(event.recipientUids));

        let groupUidString = convertUidsToString(groupUids);

        if (seenGroupUidStrings.has(groupUidString)) {
          continue;
        }

        if (getGroupUidsExcludingCurrentUser(groupUids).length === 0) {
          continue;
        }

        groups.push({
          uids: groupUids,
          computedUidsString: groupUidString,
          title: event.displayAsSentToEveryone
            ? 'Everyone'
            : convertUidsToTitle(groupUids),
          lastEvent: event,
          displayAsEveryone: event.displayAsSentToEveryone,
        });
        seenGroupUidStrings.add(groupUidString);
      }
    }

    return groups;
  }

  function convertUidsToString(uids: string[]): string {
    let sorted = _.sortBy(uids);
    return sorted.join('__');
  }

  function getGroupUidsExcludingCurrentUser(uids: string[]): string[] {
    return uids.filter((uid) => uid !== firebase.auth().currentUser?.uid);
  }

  function convertUidsToTitle(uids: string[]): string {
    return getGroupUidsExcludingCurrentUser(uids)
      .map((uid) => getUidDetails(uid, props.room).name)
      .join(', ');
  }
};

let GroupsList: React.FC<{
  groups: ExistingGroup[];
  room: Room;
  onSelect: (index: number) => void;
}> = (props) => {
  if (props.groups.length === 0) {
    return <div>No messages yet...</div>;
  }

  return (
    <div>
      {props.groups.map((group, index) => (
        <div
          key={group.computedUidsString}
          onClick={() => props.onSelect(index)}
        >
          <p>{group.title}</p>
          <p>
            {getUidDetails(group.lastEvent.senderUid, props.room).name} —{' '}
            {group.lastEvent.text}
          </p>
        </div>
      ))}
    </div>
  );
};

let NewGroup: React.FC<{
  room: Room;
  onSubmit: (uids: string[], displaySentToEveryone: boolean) => Promise<void>;
}> = (props) => {
  return (
    <div>
      <p>Send a message to everyone...</p>
      <div
        onClick={() =>
          props.onSubmit(
            _.uniq(
              [props.room.teacherUid].concat(Object.keys(props.room.students))
            ),
            true
          )
        }
      >
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
        onSubmit={(values) => props.onSubmit(values.selected, false)}
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
    // The user would only ever have access to messages that were in *one* of their
    // groups, but this specific message could belong in their group with another
    // user.
    let messageMembers = new Set(event.recipientUids.concat(event.senderUid));
    let groupMembers = new Set(props.group.uids);

    // Similar to the check when generating the groups listing, the check here
    // will actually allow the messages to show up *inside of* this everyone group,
    // even if the recipients has changed slightly.
    if (event.displayAsSentToEveryone && props.group.displayAsEveryone) {
      return true;
    }

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
  uids: string[];
  computedUidsString: string;
  displayAsEveryone: boolean;
}

interface ExistingGroup extends Group {
  lastEvent: EventMessage;
}

export default MessagesSheet;
