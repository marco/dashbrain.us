import React from 'react';

let Sheet: React.FC<{ onClose: () => void }> = (props) => {
  return (
    <div className="fixed bottom-0">
      <button onClick={props.onClose}>
        {
          // TODO: Use an SVG for close.
        }
        x
      </button>
      {props.children}
    </div>
  );
};

export default Sheet;
