import React, { useState } from 'react';
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
          disabled={choiceIndex !== undefined || !!props.endVotes}
        >
          {option}
          {choiceIndex !== undefined && props.event.showLiveResults
            ? voteTotals[index] + ' '
            : null}
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

    // This array would be empty if `showLiveResults` is false, since no
    // public choice events would be sent.
    let filteredEvents = props.events.filter(
      (event) => event.type === 'poll_response'
    ) as EventPollResponse[];

    for (let voteEvent of filteredEvents) {
      votes[voteEvent.answerIndex]++;
    }

    return votes;
  }
};

export default PollEvent;
