import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from './hook';
import { SearchIcon } from 'assets/icons';
import { cameraUrl, mikeUrl } from 'assets/images';

interface MemoTextAreaWithMikeAndCameraButtonProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onMikeButtonClick: () => void;
  onCameraButtonClick: () => void;
}

const MemoTextAreaWithMikeAndCameraButton = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  onMikeButtonClick,
  onCameraButtonClick,
}: MemoTextAreaWithMikeAndCameraButtonProps) => {
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: onSubmit,
  });

  return (
    <div className="flex flex-shrink-0 items-start rounded-3xl border-[0.12rem] px-4 py-2 overflow-hidden">
      <SearchIcon className="w-5 h-5 mt-[2px]" />
      <TextareaAutosize
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handlePressEnterFetch}
        minRows={1}
        maxRows={20}
        className="flex-1 flex-shrink-0 focus:outline-none resize-none mr-4 ml-2"
      />

      <img
        src={mikeUrl}
        className="w-6 h-6 mr-1 cursor-pointer"
        onClick={onMikeButtonClick}
      />
      <img
        src={cameraUrl}
        className="w-6 h-6 cursor-pointer"
        onClick={onCameraButtonClick}
      />
    </div>
  );
};

export default MemoTextAreaWithMikeAndCameraButton;
