import { TextareaAutosize } from '@mui/material';
import { IconButtons } from '../IconButtons';

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
    <IconButtons
      focus={true}
      onMicButtonClick={() => {}}
      onCameraButtonClick={() => {}}
      onSubmitButtonClick={() => {}}
    />
  </div>
);

export default HiddenTextarea;
