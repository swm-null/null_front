import React, { useState } from 'react';
import { Header } from '../component/Header';
import MemoList from './component/MemoList';
import { Memo } from '../search/interface/SearchResultInterface';
import { MemoInput } from './component/MemoInput';

export const AddPage = () => {
  const [message, setMessage] = useState('');
  // FIXME: BE와 통신해서, 결과를 memos에 저장하게 수정하기
  const [memos, setMemos] = useState<Memo[]>([]);

  const updateMemo = (index: number, newMemo: Memo) => {
    setMemos((prev) => prev.map((memo, i) => (i === index ? newMemo : memo)));
  };

  const deleteMemo = (index: number) => {
    setMemos((prev) => prev.filter((memo, i) => i !== index ));
  };

  const handleMemoCreation = () => {
    // FIXME: BE와 통신하는 코드 여기에 추가 작성하기
    setMemos([
      {id: '1', content: '메모 테스트1', tags: ['태그1']},
      {id: '2', content: '메모 테스트2', tags: ['태그2']},
    ]);
  };

  const handleRefresh = () => {
    setMemos([]);
  };

  return (
    <div className="flex flex-col h-screen text-gray2">
      <Header text={'메모 추가하기'} />
      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <MemoInput
          value={message}
          onChange={setMessage}
          placeholder="입력 프롬프트"
          onButtonClick={handleMemoCreation}
          buttonText="메모 AI로 생성하기"
        />
        <div className="flex flex-col flex-1">
          {memos.length !== 0 && <span className="mt-3">AI로 생성한 메모를 추가했습니다. </span>}
          <MemoList memos={memos} updateMemo={updateMemo} deleteMemo={deleteMemo}/>
        </div>
        <button className="mt-2 bg-gray2 text-white rounded-lg py-2 px-6" onClick={handleRefresh}>
          새로고침(임시 버튼)
        </button>
      </div>
    </div>
  );
};
