import { TextareaAutosize } from '@mui/material';
import { IconButtons } from '../IconButtons';

const HiddenTextarea = ({
  value,
  MAX_TEXT_LENGTH,
  hiddenTextareaWidth,
  hiddenTextareaRef,
}: {
  value: string;
  MAX_TEXT_LENGTH: number;
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
    <IconButtons
      message={value}
      MAX_TEXT_LENGTH={MAX_TEXT_LENGTH}
      submitAvailable={true}
      onImageFilesChange={() => {}}
      onSubmitButtonClick={() => {}}
    />
  </div>
);

export default HiddenTextarea;
