import React, { useState } from 'react';
import { Event } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import MessagesSheet from '../sheets/MessagesSheet';
import classNames from 'classnames';
import styles from './MessagesButton.module.scss';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';

let MessagesButton: React.FC<{ onClick: () => void; flatStyle: boolean }> = (
  props
) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames({
        [sharedStyles.bottomButtonFlat]: props.flatStyle,
        [styles.flatButton]: props.flatStyle,
      })}
    >
      {props.flatStyle ? (
        <img src={'/assets/message/green.png'} alt="Messages" className="w-4" />
      ) : null}
      Messages
    </div>
  );
};

export default MessagesButton;
