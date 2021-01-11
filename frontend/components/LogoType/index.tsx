import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

let LogoType: React.FC<{
  color: 'black' | 'white' | 'blue';
  className: string;
  size?: 'normal' | 'xl';
}> = (props) => {
  let size = props.size || 'normal';

  return (
    <span className={props.className}>
      <img
        src={`/assets/logo/${props.color}.png`}
        className={classNames('mr-1 inline', {
          'h-4.5 -align-1': size === 'normal',
          'h-8 -align-1.5': size === 'xl',
        })}
      />
      <h1
        className={classNames(
          {
            'text-black': props.color === 'black',
            'text-white': props.color === 'white',
            [styles.textBlue]: props.color === 'blue',
          },
          ['font-black', 'tracking-tighter', 'inline'],
          { 'text-base': size === 'normal', 'text-4xl': size === 'xl' }
        )}
      >
        Dashbrain
      </h1>
    </span>
  );
};

export default LogoType;
