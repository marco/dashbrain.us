import React from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

let BottomController: React.FC = (props) => {
  return (
    <div
      className={classNames(
        'fixed bottom-0 left-0 right-0 py-4 px-3 bg-white',
        styles.controller
      )}
    >
      {props.children}
    </div>
  );
};

export default BottomController;
