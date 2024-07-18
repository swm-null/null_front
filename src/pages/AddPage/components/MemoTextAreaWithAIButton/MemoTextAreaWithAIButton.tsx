import React from 'react';

interface MemoTextAreaWithAIButtonProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
  status: 'default' | 'loading' | 'success' | 'error';
}

export const MemoTextAreaWithAIButton = ({
  value,
  placeholder,
  onChange,
  onButtonClick,
  status,
}: MemoTextAreaWithAIButtonProps) => {
  const isDisabled = status === 'loading';

  return (
    <div>
      <textarea
        value={value}
        onChange={onChange}
        className="px-4 py-2 h-[120px] w-full focus:outline-none resize-none rounded-xl border-[0.12rem]"
        placeholder={placeholder}
        rows={4}
      />
      <div className="w-full flex flex-row mb-10">
        <span className="mt-3 flex flex-1 items-center">
          AI로 관련 태그를 생성해드립니다.{' '}
        </span>
        <button
          className="mt-2 ml-4 bg-gray2 text-white rounded-full py-2 px-6"
          onClick={onButtonClick}
          disabled={isDisabled}
        >
          {status === 'loading' ? '로딩 중...' : '메모 AI로 생성하기'}
        </button>
      </div>
    </div>
  );
};
