import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { IconButtons } from './IconButtons';
import { HiddenTextarea } from './HiddenTextarea';

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
  const [focus, setFocus] = useState(false);
  const handleSubmit = () => {
    setFocus(false);
    onSubmit();
  };
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleCtrlSubmit: handleSubmit,
  });

  const [isMultiline, setIsMultiline] = useState(false);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hiddenTextareaRef.current && containerRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(hiddenTextareaRef.current).lineHeight
      );
      const maxLines = Math.floor(
        hiddenTextareaRef.current.clientHeight / lineHeight
      );
      setIsMultiline(maxLines > 1);
      setHiddenTextareaWidth(containerRef.current.clientWidth);
    }
  }, [value]);

  return (
    <div
      className={`flex flex-shrink-0 px-4 py-3 rounded-2xl overflow-hidden gap-4 
        bg-[#FFF6E3CC] border-[1px] border-black border-opacity-10 font-regular shadow-custom backdrop-blur-lg`}
      onBlur={(e) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.relatedTarget)
        ) {
          setFocus(false);
        }
      }}
    >
      <HiddenTextarea
        value={value}
        hiddenTextareaWidth={hiddenTextareaWidth}
        hiddenTextareaRef={hiddenTextareaRef}
      />

      <div
        ref={containerRef}
        className={`flex flex-1 ${isMultiline ? 'flex-col' : 'flex-row'}`}
      >
        <TextareaAutosize
          className="flex-auto focus:outline-none resize-none min-h-9 content-center 
            text-[#111111] bg-transparent placeholder-custom"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={handlePressEnterFetch}
          onFocus={() => setFocus(true)}
          minRows={1}
          maxRows={20}
        />
        <IconButtons
          focus={focus}
          onMicButtonClick={onMicButtonClick}
          onCameraButtonClick={onCameraButtonClick}
          onSubmitButtonClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default MemoCreateTextArea;
