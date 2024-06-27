import React, { useState } from 'react';
import { Header } from '../component/Header';
import MemoList from './component/MemoList';
import { Memo } from '../search/interface/SearchResultInterface';
import { MemoInput } from './component/MemoInput';

export const AddPage = () => {
  const [showResultMemos, setShowResultMemos] = useState(false);
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState<Memo[]>([
    {id: '1', content: '메모 테스트1', tags: ['태그1']},
    {id: '2', content: '메모 테스트2', tags: ['태그2']},
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const updateMemo = (index: number, newMemo: Memo) => {
    setMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteMemo = (index: number) => {
    setMemos((prev) => prev.filter((memo, i) => i !== index ));
  };

  const handleMemoCreation = () => {
    setShowResultMemos(true);
  };

  const handleRefresh = () => {
    setShowResultMemos(false);
  };

  return (
    <div className="flex flex-col h-screen text-gray2">
      <Header text={'메모 추가하기'} />
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <MemoInput
          value={message}
          onChange={handleInputChange}
          placeholder="입력 프롬프트"
          onButtonClick={handleMemoCreation}
          buttonText="메모 AI로 생성하기"
        />
        <div className="flex flex-col flex-1">
          {showResultMemos && 
          <>
            <span className="mt-3">AI로 생성한 메모를 추가했습니다. </span>
            <MemoList memos={memos} updateMemo={updateMemo} deleteMemo={deleteMemo}/>
          </>}
        </div>
        <button className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6" onClick={handleRefresh}>
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
