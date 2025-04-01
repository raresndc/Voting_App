import React from 'react';

interface SourceSelectorProps {
  options: string[];
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ options }) => {
  return (
    <div className="flex grow shrink gap-5 items-start self-stretch my-auto text-xs font-bold uppercase min-w-[240px] w-[237px]">
      {options.map((option, index) => (
        <button key={index} className="gap-3 self-stretch px-4 py-3 rounded-lg border-solid border-[1.12px] border-zinc-100">
          {option}
        </button>
      ))}
    </div>
  );
};

export default SourceSelector;