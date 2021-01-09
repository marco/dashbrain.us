import React from 'react';
import { EventHand, SenderDetails } from '../../lib/events';
import { Room } from '../../lib/rooms';

let RaiseHandEvent: React.FC<{ senderDetails: SenderDetails }> = (props) => {
  if (props.senderDetails.isCurrentUser) {
    return <div>You raised your hand.</div>;
  } else {
    // TODO: Include photo if available.
    return <div>{props.senderDetails.name} raised their hand.</div>;
  }
};

export default RaiseHandEvent;
