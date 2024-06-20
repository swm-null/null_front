import React from 'react';

export const SearchChat = ({data, chatBotImageUrl, userImageUrl, removeSearchQuery}: 
  {
    data: {id: string, query: string, answer: string},
    chatBotImageUrl: string,
    userImageUrl: string,
    removeSearchQuery: (id: string) => void
  }) => {

  return (
    <div key={data.id} >
      <div className="mb-2 flex" style={{width: '100%'}}>
        <div className='flex flex-col flex-1 overflow-clip'>
          <p className="text-lg text-right">민지</p>
          <div className="p-3 inline-block self-end bg-gray0 rounded-lg overflow-hidden max-w-70p">
            <p className="text-lg inline text-right whitespace-normal break-words">{data.query}</p>
          </div>
        </div>
        <img src={userImageUrl} alt="Placeholder" className="w-10 h-10 ml-4 object-cover rounded" />
      </div>
      <div className="h-24 flex flex-1 flex-row mb-2 relative">
        <img src={chatBotImageUrl} alt="Placeholder" className="w-10 h-10 mr-4 object-cover rounded" />
        <div className='flex flex-col flex-1 '>
          <p className="text-lg">챗봇</p>
          <div className="p-3 inline-block self-start bg-gray0 rounded-lg  max-w-70p">
            <p className="text-lg inline">{data.answer}</p>
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