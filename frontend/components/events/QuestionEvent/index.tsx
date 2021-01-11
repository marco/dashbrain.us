import React, { useState } from 'react';
import { Event, EventQuestion, SenderDetails } from '../../../lib/events';
import * as eventSender from '../../../lib/event-sender';
import { Room } from '../../../lib/rooms';
import pluralize from 'pluralize';

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
    <div className={props.className}>
      {props.senderDetails.name} asked, &ldquo;{props.event.text}&rdquo;{' '}
      {upvoteCount > 0 ? pluralize('Likes', upvoteCount, true) + ' ' : ''}
      <button onClick={onClickUpvote} disabled={hasUpvoted}>
        Upvote
      </button>
    </div>
  );

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
};

export default QuestionEvent;
