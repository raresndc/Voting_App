import React from 'react';

interface ProcessedByProps {
  processor: string;
}

const ProcessedBy: React.FC<ProcessedByProps> = ({ processor }) => {
  return (
    <div className="grow self-end text-sm uppercase opacity-50 mt-[955px] text-neutral-400 max-md:mt-10">
      processed by: {processor}
    </div>
  );
};

export default ProcessedBy;