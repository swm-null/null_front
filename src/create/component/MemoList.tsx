import React from 'react';
import { ResultMemo } from './ResultMemo';
import { Memo } from '../../interface/MemoInterface';

interface MemoListProps {
  memos: Memo[];
  updateMemo: (index: number, newMemo: Memo) => void;
  deleteMemo: (index: number) => void;
}

const MemoList = ({memos, updateMemo, deleteMemo}: MemoListProps) => {

  return (
    <>
      <span className="mt-3">AI로 생성한 메모를 추가했습니다. </span>
      <div className='flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4'>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
          {memos.map((memo, index) => (
            <ResultMemo key={memo.id} memo={memo} updateMemo={(newMemo) => updateMemo(index, newMemo)} deleteMemo={()=> deleteMemo(index)}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default MemoList;
