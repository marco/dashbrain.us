import React from 'react';
import { EventStudentJoin } from '../../../lib/events';
import { Room } from '../../../lib/rooms';

let WelcomeEvent: React.FC<{ className?: string }> = (props) => {
  return <div className={props.className}>Welcome to Dashbrain!</div>;
};

export default WelcomeEvent;
