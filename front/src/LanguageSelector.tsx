import React from 'react';

const LanguageSelector: React.FC = () => {
  return (
    <div className="flex grow shrink gap-6 items-start text-sm text-white text-opacity-60 w-[183px]">
      <div className="flex gap-10 items-center py-4 pr-3 pl-4 rounded-lg bg-slate-600 min-h-[49px] w-[221px]">
        <div className="self-stretch my-auto">Detect language</div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/26c6eaf0080c5a952b64c24c54ca9eeafe3fb458e8438737e484f85f6f83ea4f?placeholderIfAbsent=true&apiKey=f430d78883ac4cb189ac6007c3dc82ed" alt="" className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]" />
      </div>
    </div>
  );
};

export default LanguageSelector;