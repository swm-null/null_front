import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from './hook';
import { SearchIcon } from 'assets/icons';
import { cameraUrl, mikeUrl } from 'assets/images';

interface MemoTextAreaWithAIButtonProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onButtonClick: () => void;
}

const MemoTextAreaWithAIButton = ({
  value,
  placeholder,
  onChange,
  onButtonClick,
}: MemoTextAreaWithAIButtonProps) => {
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: onButtonClick,
  });

  return (
    <div className="flex items-start rounded-3xl border-[0.12rem] px-4 py-2 overflow-hidden">
      <SearchIcon className="w-5 h-5 mt-[2px]" />
      <TextareaAutosize
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handlePressEnterFetch}
        minRows={1}
        maxRows={20}
        className="flex-1 focus:outline-none resize-none mr-4 ml-2"
      />

      <img src={mikeUrl} className="w-6 h-6 mr-1" />
      <img src={cameraUrl} className="w-6 h-6" />
    </div>
  );
};

export default MemoTextAreaWithAIButton;
