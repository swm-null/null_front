import { ChangeEvent } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from './hook';
import { CameraIcon, MicIcon, SearchIcon } from 'assets/icons';

interface MemoTextAreaWithMicAndCameraButtonProps {
  value: string;
  iconVisible: boolean;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onMicButtonClick: () => void;
  onCameraButtonClick: () => void;
}

const MemoTextAreaWithMicAndCameraButton = ({
  value,
  iconVisible,
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
    <div
      className="flex flex-shrink-0 px-4 py-3 items-start rounded-2xl overflow-hidden gap-4
        bg-[#FFF6E3CC] border-[1px] border-[#E3BFA4] font-regular shadow-custom"
    >
      <div className="flex flex-1 gap-2">
        {iconVisible && <SearchIcon />}
        <TextareaAutosize
          className="flex-1 flex-shrink-0 focus:outline-none resize-none min-h-9 content-center 
            text-[#111111] bg-transparent placeholder-custom"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={handlePressEnterFetch}
          minRows={1}
          maxRows={20}
        />
      </div>
      <div className="flex gap-1">
        <MicIcon className="cursor-pointer" onClick={onMicButtonClick} />
        <CameraIcon className="cursor-pointer" onClick={onCameraButtonClick} />
      </div>
    </div>
  );
};

export default MemoTextAreaWithMicAndCameraButton;
