import React from 'react';

export const EditableTag = ({text, editable=false, setText, onDelete}: {
    text: string
    editable?: boolean
    setText: (text: string) => void
    onDelete: () => void
  }) => {
  const saveTag = (e: React.FormEvent<HTMLSpanElement>) => {
    setText(e.currentTarget.innerText);
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
