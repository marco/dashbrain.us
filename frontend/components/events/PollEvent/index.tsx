import React, { useState } from 'react';
import firebase from 'firebase/app';
import {
  Event,
  EventPollResponse,
  EventPollStart,
  SenderDetails,
} from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import * as eventSender from '../../../lib/event-sender';

let PollEvent: React.FC<{
  room: Room;
  event: EventPollStart;
  senderDetails: SenderDetails;
  events: Event[];
  endVotes?: number[];
  className?: string;
}> = (props) => {
  let [choiceIndex, setChoiceIndex] = useState<number | undefined>(undefined);
  let voteTotals = getVoteTotals();

  return (
    <div className={props.className}>
      <p>
        {props.senderDetails.name} {props.endVotes ? 'ended a ' : 'sent a '}
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
      {checkShouldSeeVoters() ? (
        <>
          <p>
            <strong>Responses</strong> (only visible to you)
          </p>
          <ul>
            {getResponses().map((response, index) => (
              <li key={index}>
                {response.name}: {response.response}
              </li>
            ))}
          </ul>
        </>
      ) : null}
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

  function getResponses(): { name: string; response: string }[] {
    // This array would be empty for students, except for the user's own vote,
    // if `showLiveResults` is false, since no public choice events would be sent.
    let filteredEvents = props.events.filter(
      (event) =>
        event.type === 'poll_response' && event.pollEventId === props.event.id
    ) as EventPollResponse[];
    return filteredEvents.map((event) => {
      if (event.senderUid === props.room.teacherUid) {
        return {
          name: props.room.teacherName,
          response: props.event.options[event.answerIndex],
        };
      }

      return {
        name: props.room.students[event.senderUid].name || 'A student',
        response: props.event.options[event.answerIndex],
      };
    });
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

  function checkShouldSeeVoters() {
    if (firebase.auth().currentUser?.uid === props.event.senderUid) {
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
