import React, { useRef } from 'react';

interface Props{
  value: string;
  addTag: (text: string) => void;
}

export const specialCharsPattern = /[#,. \t\v\r\n\f\s]/g;

export const TagCreateInput = ({
  value,
  addTag,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleInputEvent = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.currentTarget.innerText;

    // 압력에 태그에 들어갈 수 없는 문자가 나오면, 새로운 태그 생성
    if (specialCharsPattern.test(inputText)) {
      if (ref.current) {
        ref.current.innerHTML=''
        const newTagText = inputText.replace(specialCharsPattern, '');
        addTag(newTagText)
      }
    }
  };

  return (
    <div
      className='flex flex-1 text-left focus:outline-none break-words self-center focus:self-center cursor:empty:before text-lg'
      ref={ ref }
      contentEditable
      suppressContentEditableWarning
      onInput={ handleInputEvent }
    >{value}</div>
  );
};