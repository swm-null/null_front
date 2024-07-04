import React from 'react';
import { SearchConversation } from './SearchConversation';
import { MemoSearchConversation } from 'interfaces/MemoInterface';

export const SearchScrollView = (({searchConversations, removeSearchConversation}:{
  searchConversations: MemoSearchConversation[]
  removeSearchConversation: (id: string) => string
}) => {
  // FIXME: user, chatbot 데이터 따로 관리하고, 거기서 데이터 가져오는 코드 추가
  const userName = '민지';
  const chatBotName = '오트서처';
  const userImageUrl = 'https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg';
  const chatBotImageUrl = 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg';

  return (
    <div className="flex-1 overflow-y-scroll no-scrollbar flex flex-col-reverse pl-12 pr-12">
      {searchConversations.map((searchConversation) => (
        <SearchConversation key={searchConversation.id} 
          data={searchConversation} removeSearchConversation={removeSearchConversation}
          userName={userName} userImageUrl={userImageUrl} 
          chatBotImageUrl={chatBotImageUrl} chatBotName={chatBotName}/>
      ))}
    </div>
  );
});