import React, { useRef } from 'react';


interface EditableTagProps {
  text: string
  editable?: boolean
  /**
   * tag에 제외하고 싶은 문자 Regex 규칙 전달
   * ex: /[#,. \t\v\r\n\f\s]/g
   */
  invalidCharsPattern: RegExp
  /**
   * tag의 text 변경사항을 받고 싶은 경우, text를 저장하는 메소드 전달
   */
  onTextChange?: (text: string) => void
  /**
   * 태그 delete 기능을 넣고 싶은 경우, delete 설정 메소드 전달
   */
  onDelete?: () => void
}

export const EditableTag = ({ 
    text, 
    editable = false, 
    invalidCharsPattern,
    onTextChange, 
    onDelete, 
  }: EditableTagProps) => {
  
  const ref = useRef<HTMLSpanElement>(null);
  
  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    if (invalidCharsPattern.test(e.currentTarget.innerHTML)) {
      // 특정 단어가 들어가면, 공백으로 대체
      const innerText = e.currentTarget.innerText.replace(invalidCharsPattern, '');
      e.currentTarget.innerText=innerText;
      ref.current?.blur();

      // tag 수정하면, onTextChange를 이용하여 업데이트
      onTextChange && onTextChange(innerText);
    }
  };

  return (
    <div className='grid'>
      <div className='flex justify-self-start px-3 py-1 bg-blue-300 rounded-full'>
        <span className='focus:outline-none break-words align-middle' 
          contentEditable={editable}
          ref = {ref}
          suppressContentEditableWarning
          onInput={handleInput}
          >{text}</span>
        {editable && onDelete && 
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
