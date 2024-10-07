import { ChangeEvent, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { SearchIcon } from 'assets/icons';

import { KeyboardEvent } from 'react';

// Enter keyboard 동작 확인 시, submit 동작 수행
// form 형식은 textarea 못 써서, keyboard 입력으로 직접 수행
const usePressEnterFetch = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const handlePressEnterFetch = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return { handlePressEnterFetch };
};

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
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleSubmit: onSubmit,
  });
  const [focus, setFocus] = useState(false);
  const getBackgroundColor = () => (focus ? 'bg-[#FFF6E3]' : 'bg-[#FFF6E3CC]');

  return (
    <div
      className={`flex flex-shrink-0 px-4 py-3 items-start rounded-2xl overflow-hidden gap-4
        ${getBackgroundColor()}
        border-[1px] border-[#E3BFA4] font-regular shadow-custom`}
    >
      <div className="flex flex-1 gap-2">
        <SearchIcon />
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
  );
};

export default MemoSearchTextArea;
