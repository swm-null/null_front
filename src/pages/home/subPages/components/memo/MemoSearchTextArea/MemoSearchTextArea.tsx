import { ChangeEvent, useContext, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { LightSearchIcon } from 'assets/icons';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { BottomNavContext } from 'utils';

interface MemoSearchTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const MemoSearchTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
}: MemoSearchTextAreaProps) => {
  const { isSmallScreen } = useContext(BottomNavContext);

  const { handlePressEnterFetch } = usePressEnterFetch({
    handleEnter: onSubmit,
  });
  const [focus, setFocus] = useState(false);
  const getBackgroundColor = () => (focus ? 'bg-[#FFF6E3]' : 'bg-[#FFF6E3CC]');

  return (
    <div className="p-4">
      <div
        className={`flex flex-shrink-0 px-4 py-3 items-start rounded-2xl overflow-hidden gap-4
          ${getBackgroundColor()} border-[1px] border-[#E3BFA4] font-regular shadow-custom`}
      >
        <div className="flex flex-1 gap-2">
          <LightSearchIcon
            className={`self-center text-brown1 ${isSmallScreen ? 'w-[1.125rem] h-[1.125rem]' : 'w-[1.375rem] h-[1.375rem]'}`}
          />
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
      </div>
    </div>
  );
};

export default MemoSearchTextArea;
