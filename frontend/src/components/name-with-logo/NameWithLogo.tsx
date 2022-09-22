import React from 'react';

interface NameWithLogoProps {
  name: string;
  logo: string;
}

const NameWithLogo = ({ name, logo }: NameWithLogoProps) => {
  return (
    <div className="flex flex-row items-center">
      <div className="h-10 w-10 mr-3 ">
        {logo ? (
          <img src={logo} className="h-full w-full rounded-full" />
        ) : (
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-500">
            <span className="text-xs font-medium leading-none text-white">{name[0]}</span>
          </span>
        )}
      </div>
      <span>{name}</span>
    </div>
  );
};

export default NameWithLogo;