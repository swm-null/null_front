import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from './hook';
import { CameraIcon, MicIcon, SearchIcon } from 'assets/icons';

interface MemoTextAreaWithMicAndCameraButtonProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onMicButtonClick: () => void;
  onCameraButtonClick: () => void;
}

const MemoTextAreaWithMicAndCameraButton = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  onMicButtonClick,
  onCameraButtonClick,
}: MemoTextAreaWithMicAndCameraButtonProps) => {
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: onSubmit,
  });

  return (
    <div className="flex flex-shrink-0 items-center rounded-3xl bg-[#FFF6E3CC] border-[1px] border-[#0000001A] px-4 py-3 overflow-hidden ">
      <SearchIcon />
      <TextareaAutosize
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handlePressEnterFetch}
        minRows={1}
        maxRows={20}
        className="flex-1 flex-shrink-0 focus:outline-none resize-none mr-4 ml-2 bg-transparent min-h-9 content-center"
      />
      <MicIcon className="cursor-pointer mr-1" onClick={onMicButtonClick} />
      <CameraIcon className="cursor-pointer" onClick={onCameraButtonClick} />
    </div>
  );
};

export default MemoTextAreaWithMicAndCameraButton;
