import React from 'react';
import { specialCharsPattern } from './TagCreateInput';

export const EditableTag = ({text, editable=false, setText, onDelete}: {
    text: string
    editable?: boolean
    setText: (text: string) => void
    onDelete: () => void
  }) => {
  // tag 수정 시, tag에 특정 문자가 있으면 필터링 하고 표시
  const saveTag = (e: React.FormEvent<HTMLSpanElement>) => {
    const innerText = e.currentTarget.innerText.replace(specialCharsPattern, '');
    setText(innerText);
    e.currentTarget.innerText=innerText;
  };

  return (
    <div className='grid'>
      <div className='flex justify-self-start px-3 py-1 bg-blue-300 rounded-full'>
        <span className='focus:outline-none break-words align-middle' 
          contentEditable={editable}
          suppressContentEditableWarning
          onBlur={saveTag}
          >{text}</span>
        {editable && 
          <svg className='ml-1 w-4 h-4 inline align-middle self-center' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            onClick={onDelete}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M5 5L19 19M5 19L19 5" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g>
          </svg>
        }
      </div>
    </div>
  );
};
