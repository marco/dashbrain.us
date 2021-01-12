import React from 'react';
import IndexTiles from './index/Tiles';

let Loading: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <p className="text-brand-blue font-black text-2xl">Loading...</p>
      <IndexTiles />
    </div>
  );
};

export default Loading;
