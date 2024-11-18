import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TextareaAutosize } from '@mui/material';
import { usePressEnterFetch } from 'pages/home/subPages/hooks';
import { IconButtons } from './IconButtons';
import { HiddenTextarea } from './HiddenTextarea';
import { MediaList } from './MediaList';
import { RecordingContext } from 'utils';
import { useHiddenTextareaManager } from './hook';

const MAX_TEXT_LENGTH = 1000;

interface MemoCreateTextAreaProps {
  imageUrls: string[];
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (voice: File | null) => void;
  onImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

const MemoCreateTextArea = ({
  imageUrls,
  value,
  placeholder,
  onChange,
  onSubmit,
  onImageFilesChange,
  removeImage,
  onPaste,
}: MemoCreateTextAreaProps) => {
  const { openRecordingModal } = useContext(RecordingContext);

  const [audio, setAudio] = useState<File | null>(null);
  const audioUrl = useMemo(
    () => (audio ? URL.createObjectURL(audio) : null),
    [audio]
  );
  const [focus, setFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenTextareaWidth, setHiddenTextareaWidth] = useState<number | null>(
    null
  );

  const { hiddenTextareaRef, isMultiline } = useHiddenTextareaManager(
    value,
    imageUrls,
    audioUrl
  );
  const { handlePressEnterFetch } = usePressEnterFetch({
    handleEnterWithCtrl: handleSubmit,
    handleEnter: handleSubmit,
  });

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setFocus(false);
    }
  };

  const handleMicButtonClick = () => {
    openRecordingModal(audio, setAudio);
  };

  function handleSubmit() {
    onSubmit(audio);
    setAudio(null);
  }

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_TEXT_LENGTH) {
      onChange({
        ...e,
        target: { ...e.target, value: e.target.value.slice(0, MAX_TEXT_LENGTH) },
      });
      return;
    }
    onChange(e);
  };

  useEffect(() => {
    if (containerRef.current) {
      setHiddenTextareaWidth(containerRef.current?.clientWidth);
    }
  }, [containerRef.current]);

  return (
    <div className="p-4">
      <div
        className="flex flex-shrink-0 px-4 py-3 rounded-2xl gap-4 bg-[#FFF6E3CC] border
        border-black border-opacity-10 bg-clip-padding font-regular shadow-custom backdrop-blur-lg"
        onBlur={handleBlur}
        onPaste={onPaste}
      >
        <HiddenTextarea
          value={value}
          MAX_TEXT_LENGTH={MAX_TEXT_LENGTH}
          hiddenTextareaWidth={hiddenTextareaWidth}
          hiddenTextareaRef={hiddenTextareaRef}
        />
        <div
          ref={containerRef}
          className={`w-full flex flex-1 ${isMultiline ? 'flex-col' : 'flex-row items-center'}`}
        >
          <TextareaAutosize
            className="flex-auto focus:outline-none resize-none min-h-9 content-center
              text-[#111111] bg-transparent placeholder-custom scrollbar-none"
            value={value}
            onFocus={() => {
              setFocus(true);
            }}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            onKeyDown={handlePressEnterFetch}
            minRows={1}
            maxRows={7}
          />
          <MediaList
            images={imageUrls}
            removeImage={removeImage}
            audioUrl={audioUrl}
            removeAudio={() => setAudio(null)}
          />
          <IconButtons
            message={value}
            submitAvailable={focus || isMultiline}
            MAX_TEXT_LENGTH={MAX_TEXT_LENGTH}
            onMicButtonClick={handleMicButtonClick}
            onImageFilesChange={onImageFilesChange}
            onSubmitButtonClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default MemoCreateTextArea;
