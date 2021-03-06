import React, { useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

let Sheet: React.FC<{
  hidden: boolean;
  onClose: () => void;
  className?: string;
}> = (props) => {
  return (
    <>
      <div
        className={classNames(
          'fixed bg-white left-0 right-0',
          { [styles.containerHiding]: props.hidden },
          styles.container,
          props.className
        )}
      >
        <button onClick={props.onClose} className="w-6 absolute right-3 top-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#bbb"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {props.children}
      </div>
      <div
        className={classNames(styles.cover, {
          [styles.coverHiding]: props.hidden,
        })}
        onClick={props.onClose}
      ></div>
    </>
  );
};

export default Sheet;
