import React from 'react';
import Loading from '../Loading';
import { Event, getSenderDetails } from '../../lib/events';
import { Room } from '../../lib/rooms';
import RaiseHandEventComponent from './RaiseHandEvent';
import QuestionEvent from './QuestionEvent';

let EventComponent: React.FC<{ event: Event; room: Room; events: Event[] }> = (
  props
) => {
  let senderDetails = getSenderDetails(props.event, props.room);

  if (props.event.type === 'hand') {
    return <RaiseHandEventComponent senderDetails={senderDetails} />;
  }

  if (props.event.type === 'question') {
    return (
      <QuestionEvent
        room={props.room}
        event={props.event}
        senderDetails={senderDetails}
        events={props.events}
      />
    );
  }

  if (props.event.type === 'question_upvote') {
    return null;
  }

  // TODO: Other event types.
  return <Loading />;
};

export default EventComponent;
