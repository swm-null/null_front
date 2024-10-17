import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
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

const HiddenTextarea = ({
  value,
  hiddenTextareaWidth,
  hiddenTextareaRef,
}: {
  value: string;
  hiddenTextareaWidth: number | null;
  hiddenTextareaRef: React.RefObject<HTMLTextAreaElement>;
}) => (
  <div
    className="flex flex-1"
    style={{
      position: 'absolute',
      top: '9999px',
      width: hiddenTextareaWidth ? `${hiddenTextareaWidth}px` : 'auto',
    }}
  >
    <TextareaAutosize
      className="flex-1 focus:outline-none resize-none min-h-9 content-center 
        text-[#111111] bg-transparent placeholder-custom"
      value={value}
      ref={hiddenTextareaRef}
    />
  </div>
);

const IconButtons = ({
  focus,
  onMicButtonClick,
  onCameraButtonClick,
  onSubmitButtonClick,
}: {
  focus: boolean;
  onMicButtonClick?: () => void;
  onCameraButtonClick?: () => void;
  onSubmitButtonClick?: () => void;
}) => (
  <div className="flex justify-end gap-1 items-center">
    <MicIcon
      tabIndex={0}
      className="w-7 h-7 cursor-pointer"
      onClick={onMicButtonClick}
    />
    <CameraIcon
      tabIndex={0}
      className="w-7 h-7 cursor-pointer"
      onClick={onCameraButtonClick}
    />
    {focus && (
      <RightArrowIcon
        tabIndex={0}
        className="w-7 h-7 mx-1 p-1 cursor-pointer rounded-full bg-[#F4CDB1]"
        onClick={() => {
          onSubmitButtonClick && onSubmitButtonClick();
        }}
      />
    )}
  </div>
);

export default MemoCreateTextArea;
