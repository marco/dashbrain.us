import React from 'react';
import { SenderDetails } from '../../../lib/events';

let RaiseHandEvent: React.FC<{ senderDetails: SenderDetails }> = (props) => {
  if (props.senderDetails.isCurrentUser) {
    return <div>You raised your hand.</div>;
  } else {
    // TODO: Include photo if available.
    return <div>{props.senderDetails.name} raised their hand.</div>;
  }
};

export default RaiseHandEvent;
