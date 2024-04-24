import { useRef } from 'react';

export const Counter = () => {
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return (
    <div className="top-0 left-0 fixed text-red-600 font-semibold z-50">
      Renders: {renderCounter.current}
    </div>
  );
};
