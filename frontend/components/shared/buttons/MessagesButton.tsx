import React, { useState } from 'react';
import { Event } from '../../../lib/events';
import { Room } from '../../../lib/rooms';
import MessagesSheet from '../sheets/MessagesSheet';
import classNames from 'classnames';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './MessagesButton.module.scss';

let MessagesButton: React.FC<{
  onClick: () => void;
  flatStyle: boolean;
  unreadCount?: number;
}> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames({
        [sharedStyles.bottomButtonFlat]: props.flatStyle,
        [styles.flatButton]: props.flatStyle,
        [sharedStyles.bottomButtonSquare]: !props.flatStyle,
        [styles.squareButton]: !props.flatStyle,
      })}
    >
      {props.flatStyle ? (
        <img src="/assets/message/green.png" alt="Messages" className={'w-4'} />
      ) : (
        <div className="flex-1 items-center justify-center flex">
          <img
            src="/assets/message/green.png"
            alt="Messages"
            className={'h-10'}
          />
        </div>
      )}
      <span>
        Messages
        {props.unreadCount ? (
          <span
            className={classNames(
              'bg-red-600 px-3 py-0 rounded-full ml-1 text-white font-normal text-sm',
              {
                'align-middle': props.flatStyle,
                'align-1': !props.flatStyle,
              }
            )}
          >
            {props.unreadCount}
          </span>
        ) : null}
      </span>
    </div>
  );
};

export default MessagesButton;
