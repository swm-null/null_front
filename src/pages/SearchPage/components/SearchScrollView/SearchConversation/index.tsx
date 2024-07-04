import React from 'react';
import { MemoSearchConversation } from 'interfaces/MemoInterface';
import { RightMessage } from './RightMessage';
import { LeftMessage } from './LeftMessage';

export const SearchConversation = ({data, userName, chatBotName, userImageUrl, chatBotImageUrl, removeSearchConversation}: 
  {
    data: MemoSearchConversation,
    userName: string,
    chatBotName: string, 
    userImageUrl: string,
    chatBotImageUrl: string,
    removeSearchConversation: (id: string) => string
  }) => {
  return (
    <div key={data.id}>
      <RightMessage name={userName} contentText={data.query} imageUrl={userImageUrl}/>
      <LeftMessage name={chatBotName} imageUrl={chatBotImageUrl} content={data.answer}/>
      {/* <button
          onClick={() => removeSearchConversation(searchQuery.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button> */}
    </div>
  )
};