import React from 'react';
import { Answer } from '../../interface/SearchResultInterface';
export const LeftMessage = ({name, imageUrl, content}: 
  {
    name: string,
    imageUrl: string,
    content: Answer,
  }) => {
    
  const processedMessageContent = (
    content.memos?.map((memo) => {
      const tags = memo.tags;

      return (
        <div className="flex flex-col p-3 bg-gray1 rounded-lg w-72 min-w-72 whitespace-normal break-words text-base">
          {memo.content}
          <div className='flex-1 m-1'/>
          {tags.map((tag) => {
            return `#${tag} `;
          })}
        </div>
      );
  }));

  return (
    <div className="mb-2 flex w-full">
        <img src={imageUrl} alt="Placeholder" className="w-10 h-10 mr-4 object-cover rounded" />
        <div className='flex flex-col flex-1 overflow-clip'>
          <p className="text-lg font-semibold">{name}</p>
          <div className="p-3 inline-block self-start bg-gray0 rounded-lg overflow-hidden max-w-3/4">
            <p className="inline whitespace-normal break-words">{content.text}</p>
            <div className='flex w-full flex-row overflow-x-scroll no-scrollbar gap-4 mt-2'>
              {processedMessageContent}
            </div>
          </div>
        </div>
      </div>
  )
};