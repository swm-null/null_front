import React from 'react';

interface MemoInputProps {
  value: string;
  placeholder: string;
  buttonText: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
}

export const MemoInput = ({
    value,
    placeholder,
    buttonText,
    onChange,
    onButtonClick,
  }: MemoInputProps) => {
  
  return (
    <div>
      <textarea
        value={value}
        onChange={onChange}
        className="px-4 py-2 h-[120px] w-full focus:outline-none resize-none rounded-xl border-[0.12rem]"
        placeholder={placeholder}
        rows={4}
      />
      <div className='w-full flex flex-row mb-10'>
        <span className='mt-3 flex flex-1 items-center'>AI로 관련 태그를 생성해드립니다. </span>
        <button className="mt-2 ml-4 bg-gray2 text-white rounded-full py-2 px-6" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};