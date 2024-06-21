import React, { LegacyRef } from 'react';
import { SearchChat } from './SearchChat.tsx';
import { SearchQuery } from './interface/SearchQuery.tsx';

export const SearchScrollView = (({searchQueries, removeSearchQuery, lastElementRef}:{
  searchQueries: SearchQuery[]
  removeSearchQuery: (id: string) => string
  lastElementRef: LegacyRef<HTMLDivElement>
}) => {

  const userImageUrl = 'https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg';
  const chatBotImageUrl = 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg';

  return (
    <div className="flex flex-col-reverse overflow-y-scroll no-scrollbar flex-1 pl-12 pr-12">
      {searchQueries.map((searchQuery) => (
        <SearchChat key={searchQuery.id} data={searchQuery} userImageUrl={userImageUrl} chatBotImageUrl={chatBotImageUrl} removeSearchQuery={removeSearchQuery}/>
      ))}
      <div ref={lastElementRef}/>
    </div>
  );
});