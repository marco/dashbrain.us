import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';

let IndexButton: React.FC<{
  title: string;
  onClick: () => void;
  className?: string;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={classNames(props.className, styles.button)}
    >
      {props.title}
    </button>
  );
};

export default IndexButton;
