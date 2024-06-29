import React from 'react';
import { SearchQuery } from '../interface/SearchResultInterface';
import { RightMessage } from './conversation/RightMessage';
import { LeftMessage } from './conversation/LeftMessage';

export const SearchConversation = ({searchQuery, userName, chatBotName, userImageUrl, chatBotImageUrl, removeSearchQuery}: 
  {
    searchQuery: SearchQuery,
    userName: string,
    chatBotName: string, 
    userImageUrl: string,
    chatBotImageUrl: string,
    removeSearchQuery: (id: string) => string
  }) => {
  return (
    <div key={searchQuery.id}>
      <RightMessage name={userName} contentText={searchQuery.query} imageUrl={userImageUrl}/>
      <LeftMessage name={chatBotName} imageUrl={chatBotImageUrl} content={searchQuery.answer}/>
      {/* <button
          onClick={() => removeSearchQuery(searchQuery.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button> */}
    </div>
  )
};