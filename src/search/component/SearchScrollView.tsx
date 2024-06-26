import React from 'react';
import { SearchConversation } from './SearchConversation.tsx';
import { SearchQuery } from '../interface/SearchResultInterface.tsx';

export const SearchScrollView = (({searchQueries, removeSearchQuery}:{
  searchQueries: SearchQuery[]
  removeSearchQuery: (id: string) => string
}) => {
  // FIXME: user, chatbot 데이터 따로 관리하고, 거기서 데이터 가져오는 코드 추가
  const userName = '민지';
  const chatBotName = '챗봇';
  const userImageUrl = 'https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg';
  const chatBotImageUrl = 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg';

  return (
    <div className="flex flex-col-reverse overflow-y-scroll no-scrollbar flex-1 pl-12 pr-12">
      {searchQueries.map((searchQuery) => (
        <SearchConversation key={searchQuery.id} 
          searchQuery={searchQuery} removeSearchQuery={removeSearchQuery}
          userName={userName} userImageUrl={userImageUrl} 
          chatBotImageUrl={chatBotImageUrl} chatBotName={chatBotName}/>
      ))}
    </div>
  );
});