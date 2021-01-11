import React from 'react';
import classNames from 'classnames';

let LogoType: React.FC<{ color: 'black' | 'white'; className: string }> = (
  props
) => {
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
