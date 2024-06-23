import React from 'react';
import { SearchQuery } from '../interface/SearchResultInterface.tsx';
import { RightMessage } from './conversation/RightMessage.tsx';
import { LeftMessage } from './conversation/LeftMessage.tsx';

export const SearchConversation = ({data, userName, chatBotName, userImageUrl, chatBotImageUrl, removeSearchQuery}: 
  {
    data: SearchQuery,
    userName: string,
    chatBotName: string, 
    userImageUrl: string,
    chatBotImageUrl: string,
    removeSearchQuery: (id: string) => string
  }) => {
  return (
    <div key={data.id}>
      <RightMessage name={userName} contentText={data.query} imageUrl={userImageUrl}/>
      <LeftMessage name={chatBotName} imageUrl={chatBotImageUrl} content={data.answer}/>
      {/* <button
          onClick={() => removeSearchQuery(data.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button> */}
    </div>
  )
};