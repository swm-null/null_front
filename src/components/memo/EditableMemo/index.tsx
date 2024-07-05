import React, { useEffect, useState } from 'react';
import { Memo } from 'interfaces/MemoInterface';
import { TagManager } from './TagManager';
import { TextareaAutosize } from '@mui/material';

const EditableMemoText = ({ message, setMessage, editable = false }: {
  message: string
  setMessage: (newMessage: string) => void
  editable?: boolean
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <TextareaAutosize
      className='p-2 mb-1 w-full bg-transparent focus:outline-none resize-none rounded-xl'
      value={message}
      onChange={handleChange}
      readOnly={!editable}
    />
  );
};

export const EditableMemo = ({ memo, updateMemo, deleteMemo, editable = false }: {
  memo: Memo
  updateMemo?: (newMemo: Memo) => void
  deleteMemo?: () => void
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
      updateMemo && updateMemo(newMemo);
    }
  }, [id, message, tags, memo, updateMemo]);

  return (
    <div className='p-2 grid first-letter:flex-col bg-gray1 rounded-md border-[1px]'>
      <EditableMemoText message={message} setMessage={setMessage} editable={editable}/>
      <TagManager tags={tags} setTags={setTags} editable={editable}/>
      {editable &&
        <button className="text-right justify-self-end mt-2 bg-gray2 text-white rounded-full py-2 px-6"
          onClick={deleteMemo}>삭제
        </button>
      }
    </div>
  );
};
