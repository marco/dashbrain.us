import React from 'react';
import { SenderDetails } from '../../../lib/events';
import styles from './event.module.scss';
import eventStyles from '../events.module.scss';
import classNames from 'classnames';

let RaiseHandEvent: React.FC<{
  senderDetails: SenderDetails;
  className?: string;
}> = (props) => {
  let image = (
    <img
      src="/assets/hand/white.png"
      alt="Raise Hand"
      className={eventStyles.iconSmall}
    />
  );

  if (props.senderDetails.isCurrentUser) {
    return (
      <div className={classNames(props.className, styles.event)}>
        {image}
        <p className="font-bold">You</p>
        <p className="-mt-1.5">raised your hand.</p>
      </div>
    );
  } else {
    // TODO: Include photo if available.
    return (
      <div className={classNames(props.className, styles.event)}>
        {image}
        <p className="font-bold">{props.senderDetails.name}</p>
        <p className="-mt-1.5">raised their hand.</p>
      </div>
    );
  }
};

export default RaiseHandEvent;
