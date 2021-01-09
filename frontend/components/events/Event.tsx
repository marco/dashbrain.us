import React from 'react';
import Loading from '../Loading';
import { Event, getSenderDetails } from '../../lib/events';
import { Room } from '../../lib/rooms';

let EventComponent: React.FC<{ event: Event; room: Room }> = (props) => {
  let senderDetails = getSenderDetails(props.event, props.room);

  if (props.event.type === 'hand') {
    if (senderDetails.isCurrentUser) {
      return <div>You raised your hand.</div>;
    } else {
      // TODO: Include photo if available.
      return <div>{senderDetails.name} raised their hand.</div>;
    }
  }

  // TODO: Other event types.
  return <Loading />;
};

export default EventComponent;
