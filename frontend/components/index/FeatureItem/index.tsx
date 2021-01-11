import classNames from 'classnames';
import React from 'react';

let FeatureItem: React.FC<{
  imgSrc: string;
  imgAlt: string;
  imgClassName: string;
  className?: string;
  description: string;
}> = (props) => {
  return (
    <div
      className={classNames(
        'flex justify-between items-start text-left',
        props.className
      )}
    >
      <img
        src={props.imgSrc}
        alt={props.imgAlt}
        className={props.imgClassName}
      />
      <p className="w-48 tracking-tight leading-none">{props.description}</p>
    </div>
  );
};

export default FeatureItem;
