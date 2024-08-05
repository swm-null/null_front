import { ChangeEvent } from 'react';
import { usePressEnterFetch } from './hook';

interface MemoTextAreaWithAIButtonProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
  isDisabled: boolean;
  buttonText: string;
}

const MemoTextAreaWithAIButton = ({
  value,
  placeholder,
  onChange,
  onButtonClick,
  isDisabled,
  buttonText,
}: MemoTextAreaWithAIButtonProps) => {
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: onButtonClick,
  });

  return (
    <div className="flex rounded-full border-[0.12rem] p-1 overflow-hidden">
      <textarea
        value={value}
        onChange={onChange}
        className="pl-4 py-2 flex flex-1 focus:outline-none resize-none no-scrollbar"
        placeholder={placeholder}
        onKeyDown={handlePressEnterFetch}
      />
      <button
        className="ml-4 bg-gray2 text-white rounded-full py-2 px-6"
        onClick={onButtonClick}
        disabled={isDisabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MemoTextAreaWithAIButton;
