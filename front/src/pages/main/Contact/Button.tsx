import React from 'react';

interface ButtonProps {
  isSecondary?: boolean;
  icon?: React.ReactNode;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ isSecondary, icon, text }) => {
  return (
    <button className={`px-6 py-2.5 flex items-center justify-center gap-2 min-w-[220px] cursor-pointer ${isSecondary ? 'border border-black text-black bg-white w-full text-[20px]' : 'bg-black text-white text-[16px]'} rounded-md`}>
      {icon}
      {text}
    </button>
  );
};

export default Button;
