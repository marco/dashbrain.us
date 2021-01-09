import React from 'react';
import { EventQuestion, SenderDetails } from '../../lib/events';

let QuestionEvent: React.FC<{
  event: EventQuestion;
  senderDetails: SenderDetails;
}> = (props) => {
  return (
    <div>
      {props.senderDetails.name} asked, &ldquo;{props.event.text}&rdquo;
    </div>
  );
};

export default QuestionEvent;
