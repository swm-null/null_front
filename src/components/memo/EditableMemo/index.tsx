import React, { useEffect, useRef, useState } from 'react';
import { Memo } from 'interfaces/MemoInterface';
import { TagManager } from './TagManager';

const EditableMemoText = ({ message, setMessage, editable = false }: {
  message: string
  setMessage: (newMessage: string) => void
  editable?: boolean
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 초기 높이를 자동으로 설정
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용물에 따라 높이 설정
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <textarea
      ref={textareaRef}
      className='p-2 mb-1 w-full bg-transparent focus:outline-none resize-none rounded-xl'
      value={message}
      rows={1}
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
    <div className='p-2 grid first-letter:flex-col rounded-md border-[1px]'>
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
