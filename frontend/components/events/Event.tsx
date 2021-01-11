import React from 'react';
import Loading from '../Loading';
import { Event, EventPollStart, getSenderDetails } from '../../lib/events';
import { Room } from '../../lib/rooms';
import RaiseHandEventComponent from './RaiseHandEvent';
import QuestionEvent from './QuestionEvent';
import PollEvent from './PollEvent';
import MessageEvent from './MessageEvent';
import StudentJoinEvent from './StudentJoinEvent';
import WelcomeEvent from './WelcomeEvent';
import styles from './events.module.scss';
import firebase from 'firebase/app';

let EventComponent: React.FC<{
  event: Event;
  room: Room;
  events: Event[];
}> = (props) => {
  let senderDetails = getSenderDetails(props.event, props.room);

  if (props.event.type === 'hand') {
    return (
      <RaiseHandEventComponent
        senderDetails={senderDetails}
        className={styles.event}
        event={props.event}
        room={props.room}
      />
    );
  }

  if (props.event.type === 'question') {
    return (
      <QuestionEvent
        room={props.room}
        event={props.event}
        senderDetails={senderDetails}
        events={props.events}
        className={styles.event}
      />
    );
  }

  if (props.event.type === 'poll_start') {
    if (
      !props.events.some(
        (event) =>
          event.type === 'poll_end' && event.pollEventId === props.event.id
      )
    ) {
      return (
        <PollEvent
          room={props.room}
          event={props.event}
          senderDetails={senderDetails}
          events={props.events}
          className={styles.event}
        />
      );
    } else {
      return null;
    }
  }

  if (props.event.type === 'poll_end') {
    let pollEventId = props.event.pollEventId;
    let originalEvent = props.events.find(
      (event) => event.type === 'poll_start' && event.id === pollEventId
    ) as EventPollStart;

    if (!originalEvent) {
      return null;
    }

    return (
      <PollEvent
        room={props.room}
        event={originalEvent}
        senderDetails={senderDetails}
        events={props.events}
        endVotes={props.event.votes}
        className={styles.event}
      />
    );
  }

  if (props.event.type === 'message') {
    if (props.event.senderUid === firebase.auth().currentUser?.uid) {
      return null;
    }

    return (
      <MessageEvent
        room={props.room}
        event={props.event}
        senderDetails={senderDetails}
        className={styles.event}
      />
    );
  }

  if (props.event.type === 'student_join') {
    if (props.event.senderUid === firebase.auth().currentUser?.uid) {
      return null;
    }

    return (
      <StudentJoinEvent
        room={props.room}
        event={props.event}
        className={styles.event}
      />
    );
  }

  if (props.event.type === 'welcome') {
    return <WelcomeEvent className={styles.event} room={props.room} />;
  }

  if (
    props.event.type === 'question_upvote' ||
    props.event.type === 'poll_response'
  ) {
    return null;
  }

  // TODO: Other event types.
  return <Loading />;
};

export default EventComponent;
