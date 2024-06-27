import React, { useState } from 'react';
import { Header } from '../component/Header';
import { EditableMemo } from './component/EditableMemo';
import { Memo } from '../search/interface/SearchResultInterface';

export const AddPage = () => {
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState<Memo[]>([
    {id: "1", content: '메모 테스트1', tags: ['태그1']},
    {id: "2", content: '메모 테스트2', tags: ['태그2']}
  ]);

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setMessage(e.target.value);
  };

  const updateMemo = (index:number, newMemo: Memo) => {
    setMemos(prev => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  return (
    <div className='flex flex-col h-screen text-gray2'>
      <Header text={'메모 추가하기'}/>
      <div className='p-4 flex flex-col flex-1 overflow-hidden'>
        <div>
          <textarea
            value={message}
            onChange={handleInputChange}
            className="px-4 py-2 h-[120px] w-full focus:outline-none resize-none rounded-xl border-[0.12rem]"
            placeholder="입력 프롬프트"
            rows={4}
          />
          <div className='w-full flex flex-row mb-10'>
            <span className='mt-3 flex flex-1 items-center'>AI로 관련 태그를 생성해드립니다. </span>
            <button className="mt-2 ml-4 bg-gray2 text-white rounded-full py-2 px-6">
              메모 AI로 생성하기
            </button>
          </div>
        </div>
        <div className='flex flex-col flex-1'>
          <span className='mt-3'>AI로 생성한 메모를 추가했습니다. </span>
          <div className='flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4'>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
              {
                memos.map((memo, index) => 
                  <EditableMemo editable key={memo.id} memo={memo} updateMemo={(newMemo) => updateMemo(index, newMemo)}/>
                )
              }
            </div>
          </div>
        </div>
        <button className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6">
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
