import React from 'react';
import { Event } from '../../lib/events';
import { Room } from '../../lib/rooms';
import EventComponent from './Event';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styles from './events.module.scss';

let EventsList: React.FC<{
  room: Room;
  events: Event[];
  seenIds: Set<string>;
  onClickEvent: (event: Event) => void;
}> = (props) => {
  return (
    <TransitionGroup>
      {props.events
        .filter((event) => !props.seenIds.has(event.id))
        .map((event) => {
          let eventComponent = (
            <EventComponent
              event={event}
              room={props.room}
              events={props.events}
            />
          );

          if (!eventComponent) {
            return null;
          }

          let eventWrapper = (
            <div
              key={event.id}
              onClick={() => {
                props.onClickEvent(event);
              }}
              className="overflow-hidden"
            >
              {eventComponent}
            </div>
          );

          return (
            <CSSTransition
              timeout={2000}
              key={event.id}
              classNames={{
                enter: styles.eventContainerEnter,
                enterActive: styles.eventContainerEnterActive,
                exit: styles.eventContainerExit,
                exitActive: styles.eventContainerExitActive,
              }}
            >
              {eventWrapper}
            </CSSTransition>
          );
        })}
    </TransitionGroup>
  );
};

export default EventsList;
