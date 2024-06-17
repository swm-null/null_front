import React, { LegacyRef } from 'react';
import { SearchChat } from './SearchChat.tsx';

export const SearchScrollView = ({views, removeView, ref, lastElementRef}: 
  {
    views: {id: string, text: string, left: boolean}[]
    removeView: (id: string) => string
    ref: LegacyRef<HTMLDivElement>
    lastElementRef: LegacyRef<HTMLDivElement>
  }) => {
  const imageUrl = 'https://via.placeholder.com/150';

  return (
    <div ref={ref} className="flex flex-col-reverse overflow-y-scroll no-scrollbar flex-1 pl-4 pr-4">
      {views.map((view) => (
        <SearchChat data={view} imageUrl={imageUrl} removeView={removeView}/>
      ))}
      <div ref={lastElementRef}/>
    </div>
  );
};