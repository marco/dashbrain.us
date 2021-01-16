import React, { useState } from 'react';
import { Event, EventQuestion, SenderDetails } from '../../../lib/events';
import * as eventSender from '../../../lib/event-sender';
import { Room } from '../../../lib/rooms';
import pluralize from 'pluralize';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';
import firebase from 'firebase/app';

let QuestionEvent: React.FC<{
  room: Room;
  event: EventQuestion;
  senderDetails: SenderDetails;
  events: Event[];
  className?: string;
}> = (props) => {
  let [hasUpvoted, setHasUpvoted] = useState(false);
  let upvoteCount = getUpvoteCount();

  return (
    <div className={classNames(props.className, styles.event)}>
      <img
        src="/assets/question/white.png"
        alt="Question"
        className={eventStyles.iconXS}
      />
      <p className="font-bold">
        {shouldSeeName() ? props.senderDetails.name : 'Someone'} asked
      </p>
      <p className="leading-tight">&ldquo;{props.event.text}&rdquo; </p>
      {shouldShowLikeButton() ? (
        <button
          onClick={onClickUpvote}
          disabled={hasUpvoted}
          className={styles.button}
        >
          {hasUpvoted ? 'Liked' : 'Like'}
        </button>
      ) : null}
      <span className="text-sm">{stringifyLikes(upvoteCount)}</span>
    </div>
  );

  function shouldSeeName(): boolean {
    if (props.room.teacherUid === firebase.auth().currentUser?.uid) {
      return true;
    }

    if (props.event.senderUid === firebase.auth().currentUser?.uid) {
      return true;
    }

    if (props.event.senderUid === props.room.teacherUid) {
      return true;
    }

    return false;
  }

  function getUpvoteCount(): number {
    return props.events.filter(
      (event) =>
        event.type === 'question_upvote' &&
        event.questionEventId === props.event.id
    ).length;
  }

  async function onClickUpvote() {
    setHasUpvoted(true);
    eventSender.upvoteQuestion(props.room, props.event.id);
  }

  function shouldShowLikeButton() {
    if (firebase.auth().currentUser?.uid === props.room.teacherUid) {
      return false;
    }

    if (firebase.auth().currentUser?.uid === props.event.senderUid) {
      return false;
    }

    return true;
  }

  function stringifyLikes(likes: number): string | null {
    if (likes === 0) {
      return null;
    }

    if (likes === 1) {
      return '1 student has liked this question.';
    }

    return `${likes} students have liked this question.`;
  }
};

export default QuestionEvent;
