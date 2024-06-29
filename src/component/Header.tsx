import React from 'react';

export const Header = ({text}: {text: string}) => {

  return (
    <div className='px-4 py-4'>
      <p className='font-semibold text-lg'>{text}</p>
    </div>
  );
};
