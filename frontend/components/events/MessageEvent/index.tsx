import React from 'react';
import { EventMessage, SenderDetails } from '../../../lib/events';
import { Room } from '../../../lib/rooms';

let MessageEvent: React.FC<{
  room: Room;
  event: EventMessage;
  senderDetails: SenderDetails;
  className?: string;
}> = (props) => {
  return (
    <div className={props.className}>
      <p>New message from {props.senderDetails.name}</p>
      <p>{props.event.text}</p>
      <p>Click to view &amp; reply</p>
    </div>
  );
};

export default MessageEvent;
