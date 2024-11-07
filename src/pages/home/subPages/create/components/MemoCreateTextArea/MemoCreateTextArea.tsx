import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { IconButtons } from './IconButtons';
import { HiddenTextarea } from './HiddenTextarea';
import { MediaList } from './MediaList';
import { ImageListContext, RecordingContext } from 'utils';
import { useHiddenTextareaManager } from './hook';

interface MemoCreateTextAreaProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}

const MemoCreateTextArea = ({
  value,
  placeholder,
  onChange,
  onSubmit,
}: MemoCreateTextAreaProps) => {
  const { images, removeImage, handlePaste } = useContext(ImageListContext);
  const { audioBlobs, audioWaveform, removeAudio } = useContext(RecordingContext);

  const { openRecordingModal } = useContext(RecordingContext);

  const [focus, setFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const { hiddenTextareaRef, isMultiline } = useHiddenTextareaManager(value, images);
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleEnterWithCtrl: onSubmit,
  });

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setFocus(false);
    }
  };

  const handleMicButtonClick = () => {
    openRecordingModal();
  };

  const handleTextareaMultiline = useCallback(
    () => isMultiline || images.length !== 0 || audioBlobs.length !== 0,
    [isMultiline, images, audioBlobs]
  );

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
        onPaste={handlePaste}
      >
        <HiddenTextarea
          value={value}
          hiddenTextareaWidth={hiddenTextareaWidth}
          hiddenTextareaRef={hiddenTextareaRef}
        />
        <div
          ref={containerRef}
          className={`w-full flex flex-1 ${handleTextareaMultiline() ? 'flex-col' : 'flex-row items-center'}`}
        >
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
          <MediaList
            images={images}
            removeImage={removeImage}
            audioBlobs={audioBlobs}
            audioWaveform={audioWaveform}
            removeAudio={removeAudio}
          />
          <IconButtons
            submitAvailable={focus || isMultiline}
            onMicButtonClick={handleMicButtonClick}
            onSubmitButtonClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default MemoCreateTextArea;
