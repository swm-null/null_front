import React from 'react';
import { SearchQuery } from './interface/SearchQuery';

export const SearchChat = ({data, chatBotImageUrl, userImageUrl, removeSearchQuery}: 
  {
    data: SearchQuery,
    chatBotImageUrl: string,
    userImageUrl: string,
    removeSearchQuery: (id: string) => void
  }) => {

  return (
    <div key={data.id}>
      <div className="mb-2 flex w-full">
        <div className='flex flex-col flex-1 overflow-clip'>
          <p className="text-lg text-right">민지</p>
          <div className="p-3 inline-block self-end bg-gray0 rounded-lg overflow-hidden max-w-3/4">
            <p className="text-lg inline text-right whitespace-normal break-words">{data.query}</p>
          </div>
        </div>
        <img src={userImageUrl} alt="Placeholder" className="w-10 h-10 ml-4 object-cover rounded" />
      </div>
      <div className="mb-2 flex w-full">
        <img src={chatBotImageUrl} alt="Placeholder" className="w-10 h-10 mr-4 object-cover rounded" />
        <div className='flex flex-col flex-1 overflow-clip'>
          <p className="text-lg">챗봇</p>
          <div className="p-3 inline-block self-start bg-gray0 rounded-lg overflow-hidden max-w-3/4">
            <p className="text-lg inline whitespace-normal break-words">{data.answer.text}</p>
            <div className='flex w-full flex-row overflow-x-scroll no-scrollbar gap-4'>
              {
                data.answer.memos && [...data.answer.memos, ...data.answer.memos]?.map((memo) => {
                  return (
                    <div className="p-3 bg-gray1 rounded-lg w-72 min-w-72 whitespace-normal break-words">
                      {memo.content}
                      <br/><br/>
                      {/* 태그가 null로 오길래 일단 태그1, 태그2로 하드코딩 */}
                      {['태그1', '태그2'].map((tag) => {
                        return `#${tag} `;
                      })}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
      {/* <button
          onClick={() => removeSearchQuery(data.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button> */}
    </div>
  )
};