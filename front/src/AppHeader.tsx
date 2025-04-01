import React from 'react';

interface AppHeaderProps {
  appName: string;
  logoSrc: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ appName, logoSrc }) => {
  return (
    <header className="flex gap-6 ml-60 text-4xl font-light leading-none text-center uppercase text-zinc-100 max-md:ml-2.5">
      <img loading="lazy" src={logoSrc} alt="App Logo" className="object-contain shrink-0 w-11 aspect-square" />
      <h1 className="flex-auto my-auto">{appName}</h1>
    </header>
  );
};

export default AppHeader;