import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { LightSearchIcon, RightArrowIcon } from 'assets/icons';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { TextareaAutosize } from '@mui/material';
import { useHiddenTextareaManager } from 'pages/home/subPages/create/components/MemoCreateTextArea/hook';
import { HiddenTextarea } from './HiddenTextarea';

interface MemoSearchTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent) => void;
  onSubmit: () => void;
}

const MemoSearchTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
}: MemoSearchTextAreaProps) => {
  const { hiddenTextareaRef, isMultiline } = useHiddenTextareaManager(value);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const [focus, setFocus] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  const { handlePressEnterFetch } = usePressEnterFetch({
    handleEnterWithCtrl: onSubmit,
  });

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setFocus(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (containerRef.current) {
      setHiddenTextareaWidth(containerRef.current?.clientWidth);
    }
  }, [containerRef.current]);

  return (
    <div className="p-4">
      <div
        className="flex flex-shrink-0 px-4 py-3 rounded-2xl overflow-hidden gap-4 bg-[#FFF6E3CC] border
        border-black border-opacity-10 font-regular shadow-custom backdrop-blur-lg"
        onBlur={handleBlur}
      >
        <form
          ref={containerRef}
          className={`flex flex-1 gap-2 h-fit ${isMultiline ? 'flex-col' : 'flex-row items-center'}`}
          onSubmit={handleSubmit}
        >
          <HiddenTextarea
            value={value}
            hiddenTextareaWidth={hiddenTextareaWidth}
            hiddenTextareaRef={hiddenTextareaRef}
          />
          <div className="flex w-full gap-2">
            <LightSearchIcon className="items-center my-[7px] text-brown1 w-[1.375rem] h-[1.375rem]" />
            <TextareaAutosize
              className="flex-auto focus:outline-none resize-none min-h-9 content-center
              text-[#111111] bg-transparent placeholder-custom"
              value={value}
              onFocus={() => {
                setFocus(true);
              }}
              onChange={onChange}
              placeholder={placeholder}
              onKeyDown={handlePressEnterFetch}
              minRows={1}
              maxRows={20}
            />
          </div>
          {focus && (
            <div
              className={`flex-1 flex justify-end ${
                isMultiline ? 'w-full' : 'w-fit'
              }`}
            >
              <RightArrowIcon
                tabIndex={0}
                className="h-7 w-7 mx-1 p-1 cursor-pointer rounded-full bg-[#F4CDB1] self-end justify-center flex-shrink-0"
                onClick={() => {
                  onSubmit && onSubmit();
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MemoSearchTextArea;
