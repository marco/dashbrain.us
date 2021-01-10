import React, { useState } from 'react';
import { Event } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import MessagesSheet from '../sheets/MessagesSheet';

let MessagesButton: React.FC<{ onClick: () => void }> = (props) => {
  return <button onClick={props.onClick}>Messages</button>;
};

export default MessagesButton;
