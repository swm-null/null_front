import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';
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
    <div className="flex items-start rounded-3xl border-[0.12rem] px-4 py-2 overflow-hidden">
      <TextareaAutosize
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handlePressEnterFetch}
        minRows={1}
        maxRows={20}
        className="flex-1 focus:outline-none resize-none"
        style={{
          marginRight: '1rem', // Add space between the textarea and button
        }}
      />
      <button
        className="bg-gray2 text-white rounded-full py-2 px-6 h-12"
        onClick={onButtonClick}
        disabled={isDisabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MemoTextAreaWithAIButton;
