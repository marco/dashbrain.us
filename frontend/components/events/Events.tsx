import React from 'react';
import { Event } from '../../lib/events';
import { Room } from '../../lib/rooms';
import EventComponent from './Event';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styles from './events.module.scss';
import { Group, checkEventMatchesGroup } from '../shared/sheets/MessagesSheet';
import firebase from 'firebase/app';

let EventsList: React.FC<{
  room: Room;
  events: Event[];
  seenIds: Set<string>;
  selectedMessageGroup: Group | undefined;
  onClickEvent: (event: Event) => void;
  isPrinting?: boolean;
}> = (props) => {
  if (props.isPrinting) {
    return <div>{renderInternal()}</div>;
  } else {
    return <TransitionGroup>{renderInternal()}</TransitionGroup>;
  }

  function renderInternal() {
    return props.events
      .filter((event) => {
        if (event.type === 'message') {
          if (props.isPrinting) {
            if (event.displayAsSentToEveryone) {
              return true;
            } else {
              return false;
            }
          } else {
            if (
              event.senderUid === firebase.auth().currentUser?.uid ||
              props.seenIds.has(event.id) ||
              (props.selectedMessageGroup &&
                checkEventMatchesGroup(event, props.selectedMessageGroup))
            ) {
              return false;
            } else {
              return true;
            }
          }
        }

        return true;
      })
      .map((event) => {
        let eventComponent = (
          <EventComponent
            event={event}
            room={props.room}
            events={props.events}
            isPrinting={props.isPrinting}
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
      });
  }
};

export default EventsList;
