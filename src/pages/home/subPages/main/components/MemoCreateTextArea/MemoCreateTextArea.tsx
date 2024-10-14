import { ChangeEvent, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { CameraIcon, MicIcon } from 'assets/icons';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';

interface MemoCreateTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onMicButtonClick: () => void;
  onCameraButtonClick: () => void;
}

const MemoCreateTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  onMicButtonClick,
  onCameraButtonClick,
}: MemoCreateTextAreaProps) => {
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleCtrlSubmit: onSubmit,
  });
  const [focus, setFocus] = useState(false);
  const getBackgroundColor = () => {
    if (focus) {
      return 'bg-[#FFF6E3]';
    } else {
      return 'bg-[#FFF6E3CC]';
    }
  };

  return (
    <div
      className={`flex flex-shrink-0 px-4 py-3 items-start rounded-2xl overflow-hidden gap-4
        ${getBackgroundColor()} border-[1px] border-black border-opacity-10 bg-clip-padding 
        font-regular shadow-custom backdrop-blur-lg`}
    >
      <div className="flex flex-1 gap-2">
        <TextareaAutosize
          className="flex-1 flex-shrink-0 focus:outline-none resize-none min-h-9 content-center 
            text-[#111111] bg-transparent placeholder-custom"
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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

export default MemoCreateTextArea;
