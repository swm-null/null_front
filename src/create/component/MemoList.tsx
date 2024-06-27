import React from 'react';
import { EditableMemo } from './memo/EditableMemo';
import { Memo } from '../../search/interface/SearchResultInterface';

interface MemoListProps {
  memos: Memo[];
  updateMemo: (index: number, newMemo: Memo) => void;
  deleteMemo: (index: number) => void;
}

const MemoList = (props: MemoListProps) => {
  const { memos, updateMemo, deleteMemo } = props;

  return (
    <div className='flex flex-col flex-1 overflow-y-scroll no-scrollbar my-4'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
        {memos.map((memo, index) => (
          <EditableMemo key={memo.id} memo={memo} updateMemo={(newMemo) => updateMemo(index, newMemo)} deleteMemo={()=> deleteMemo(index)}/>
        ))}
      </div>
    </div>
  );
};

export default MemoList;
