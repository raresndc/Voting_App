import React from 'react';

interface InputFieldProps {
  placeholder: string;
  iconSrc: string;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, iconSrc }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center px-4 py-3.5 mt-9 w-full text-sm rounded-lg bg-slate-800 min-h-[44px] text-white text-opacity-60">
      <img loading="lazy" src={iconSrc} alt="" className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.05]" />
      <input type="text" placeholder={placeholder} className="self-stretch my-auto bg-transparent border-none outline-none" />
    </div>
  );
};

export default InputField;