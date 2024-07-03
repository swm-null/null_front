import React, { useEffect, useState } from 'react';
import { Memo } from '../../interface/MemoInterface';
import { TagManager } from './memo/TagManager';
import { EditableMemoText } from './memo/EditableMemoText';

// 원래 생각한 이름 : EditableMemo
export const ResultMemo = ({ memo, updateMemo, deleteMemo, editable = false }: {
  memo: Memo
  updateMemo: (newMemo: Memo) => void
  deleteMemo: () => void
  editable?: boolean
}) => {
  const { id, content, tags: originTags } = memo;
  const [message, setMessage] = useState(content);
  const [tags, setTags] = useState(originTags);

  // 메모 내용에 변경이 있을 경우, 메모 업데이트
  useEffect(() => {
    const arraysEqual = (a: any[], b: any[]) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };

    const newMemo = { id, content: message, tags };
    if (memo.content !== newMemo.content || !arraysEqual(memo.tags, newMemo.tags)) {
      updateMemo(newMemo);
    }
  }, [id, message, tags, memo, updateMemo]);

  return (
    <div className='p-2 grid first-letter:flex-col rounded-md border-[1px]'>
      <EditableMemoText message={message} setMessage={setMessage} editable={editable}/>
      <TagManager tags={tags} setTags={setTags} editable={editable} />
      {editable &&
        <button className="text-right justify-self-end mt-2 bg-gray2 text-white rounded-full py-2 px-6"
          onClick={deleteMemo}>삭제
        </button>
      }
    </div>
  );
};