import React, { useState } from 'react';
import { Event } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import MessagesSheet from '../MessagesSheet';

let MessagesButton: React.FC<{ room: Room; events: Event[] }> = (props) => {
  let [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <button onClick={() => setShowSheet(true)}>Messages</button>
      {showSheet ? (
        <MessagesSheet
          room={props.room}
          events={props.events}
          onClose={() => setShowSheet(false)}
        />
      ) : null}
    </>
  );
};

export default MessagesButton;
