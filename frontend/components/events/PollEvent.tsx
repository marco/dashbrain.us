import React, { useState } from 'react';
import firebase from 'firebase/app';
import {
  Event,
  EventPollResponse,
  EventPollStart,
  SenderDetails,
} from '../../lib/events';
import { Room } from '../../lib/rooms';
import * as eventSender from '../../lib/event-sender';

let PollEvent: React.FC<{
  room: Room;
  event: EventPollStart;
  senderDetails: SenderDetails;
  events: Event[];
  endVotes?: number[];
}> = (props) => {
  let [choiceIndex, setChoiceIndex] = useState<number | undefined>(undefined);
  let voteTotals = getVoteTotals();

  return (
    <div>
      <p>
        {props.senderDetails.name} {props.endVotes ? 'ended the ' : 'sent a '}
        poll.
      </p>
      {props.event.text ? (
        <p>
          <strong>{props.event.text}</strong>
        </p>
      ) : null}
      {props.event.options.map((option, index) => (
        <button
          onClick={() => onClickOption(index)}
          key={index}
          disabled={!checkCanVote()}
        >
          {option}
          {checkShouldSeeVotes() ? voteTotals[index] + ' ' : null}
        </button>
      ))}
    </div>
  );

  function onClickOption(index: number) {
    setChoiceIndex(index);
    eventSender.sendPollResponse(props.room, props.event.id, index);
  }

  function getVoteTotals() {
    if (props.endVotes) {
      return props.endVotes;
    }

    let votes = new Array(props.event.options.length).fill(0);

    // If the end results haven't been published, and we aren't guaranteed access,
    // just return the 0s array.
    if (!checkShouldSeeVotes()) {
      return votes;
    }

    // This array would be empty, except for the user's own vote,
    // if `showLiveResults` is false, since no public choice events would be sent.
    let filteredEvents = props.events.filter(
      (event) =>
        event.type === 'poll_response' && event.pollEventId === props.event.id
    ) as EventPollResponse[];

    for (let voteEvent of filteredEvents) {
      votes[voteEvent.answerIndex]++;
    }

    return votes;
  }

  function checkShouldSeeVotes() {
    if (firebase.auth().currentUser?.uid === props.event.senderUid) {
      return true;
    }

    if (props.endVotes) {
      return true;
    }

    if (props.event.showLiveResults && choiceIndex !== undefined) {
      return true;
    }

    return false;
  }

  function checkCanVote() {
    if (firebase.auth().currentUser?.uid === props.event.senderUid) {
      return false;
    }

    if (props.endVotes) {
      return false;
    }

    if (choiceIndex !== undefined) {
      return false;
    }

    return true;
  }
};

export default PollEvent;
