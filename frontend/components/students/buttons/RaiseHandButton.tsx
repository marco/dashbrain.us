import React, { useState } from 'react';
import * as rooms from '../../../lib/rooms';
import * as events from '../../../lib/events';
import * as eventSender from '../../../lib/event-sender';

let RaiseHandButton: React.FC<{ room: rooms.Room }> = (props) => {
  let [state, setState] = useState<RaisingHandState>({
    state: 'lowered',
  });

  switch (state.state) {
    case 'lowered':
    case 'lowering':
      return <button onClick={onClick}>Raise Hand</button>;
    case 'raised':
    case 'raising':
      return <button onClick={onClick}>Lower Hand</button>;
  }

  async function onClick() {
    switch (state.state) {
      case 'raising':
      case 'lowering':
        break;
      case 'lowered': {
        setState({ state: 'raising' });
        let event = await eventSender.raiseHand(props.room);
        setState({ event, state: 'raised' });
        break;
      }
      case 'raised': {
        setState({ state: 'lowering' });
        await eventSender.deleteEvent(props.room, state.event);
        setState({ state: 'lowered' });
      }
    }
  }
};

type RaisingHandState =
  | { state: 'lowered' }
  | { state: 'raising' }
  | { state: 'raised'; event: events.Event }
  | { state: 'lowering' };

export default RaiseHandButton;
