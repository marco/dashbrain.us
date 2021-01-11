import React from 'react';
import { SenderDetails } from '../../../lib/events';

let RaiseHandEvent: React.FC<{
  senderDetails: SenderDetails;
  className?: string;
}> = (props) => {
  if (props.senderDetails.isCurrentUser) {
    return <div className={props.className}>You raised your hand.</div>;
  } else {
    // TODO: Include photo if available.
    return (
      <div className={props.className}>
        {props.senderDetails.name} raised their hand.
      </div>
    );
  }
};

export default RaiseHandEvent;
