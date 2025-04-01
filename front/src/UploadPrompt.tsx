import React from 'react';

const UploadPrompt: React.FC = () => {
  return (
    <>
      <h2 className="mt-5 text-5xl font-bold leading-none text-center uppercase text-zinc-100 max-md:max-w-full max-md:text-4xl">
        please upload you file
      </h2>
      <div className="flex gap-4 items-center mt-5 text-xs font-bold text-sky-900 uppercase">
        <button className="gap-3 self-stretch px-4 py-3 my-auto whitespace-nowrap bg-amber-400 rounded-lg min-h-[38px]">
          history
        </button>
        <button className="gap-3 self-stretch px-4 py-3 my-auto rounded-lg bg-zinc-100 min-h-[38px]">
          next step
        </button>
      </div>
    </>
  );
};

export default UploadPrompt;