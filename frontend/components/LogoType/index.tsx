import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

let LogoType: React.FC<{
  color: 'black' | 'white' | 'blue';
  className: string;
}> = (props) => {
  return (
    <span className={props.className}>
      <img
        src={`/assets/logo/${props.color}.png`}
        className="h-4.5 mr-1 inline -align-1"
      />
      <h1
        className={classNames(
          {
            'text-black': props.color === 'black',
            'text-white': props.color === 'white',
            [styles.textBlue]: props.color === 'blue',
          },
          ['font-black', 'text-base', 'tracking-tighter', 'inline']
        )}
      >
        Dashbrain
      </h1>
    </span>
  );
};

export default LogoType;
