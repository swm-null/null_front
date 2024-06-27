import React, { useRef } from 'react';

interface Props{
  value: string;
  onChange: (text: string) => void;
}

export const TagCreateInput = ({
  value,
  onChange,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleInputEvent = (e: React.FormEvent<HTMLDivElement>) => {
    const inputText = e.currentTarget.innerText;
    
    const specialCharsPattern = /[#,. \t\v\r\n\f\s]/g;
    if (specialCharsPattern.test(inputText)) {
      if (ref.current) {
        ref.current.innerHTML=''
        const newTagText = inputText.replace(specialCharsPattern, '');
        onChange(newTagText)
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