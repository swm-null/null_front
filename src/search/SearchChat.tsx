import React from 'react';

export const SearchChat = ({data, imageUrl, removeView}: 
  {
    data: {id: string, text: string, left: boolean},
    imageUrl: string,
    removeView: (id: string) => void
  }) => {

  return (
    data.left ? 
      <div key={data.id} className="h-24 flex flex-1 flex-row mb-2 relative">
        <img src={imageUrl} alt="Placeholder" className="w-10 h-10 mr-4" />
        <div className='flex-1'>
          <p className="text-lg">챗봇</p>
          <div className="p-3" style={{backgroundColor: '#F9F9F9'}}>
            <p className="text-lg">{data.text}</p>
          </div>
        </div>
        <button
          onClick={() => removeView(data.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button>
      </div>
      : 
      <div key={data.id} className="mb-2 flex" style={{width: '100%'}}>
        <button
          onClick={() => removeView(data.id)}
          className="h-8 top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >Remove</button>
        <div className='flex-1 overflow-clip'>
          <p className="text-lg text-right">챗봇</p>
          <div className="p-3 flex-1" style={{backgroundColor: '#F9F9F9'}}>
            <p className="text-lg text-right whitespace-normal break-words">{data.text}</p>
          </div>
        </div>
        <img src={imageUrl} alt="Placeholder" className="w-10 h-10 ml-4" />
      </div>
  )
};