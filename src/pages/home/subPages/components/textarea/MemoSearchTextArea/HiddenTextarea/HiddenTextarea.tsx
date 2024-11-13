import { TextareaAutosize } from '@mui/material';
import { LightSearchIcon, RightArrowIcon } from 'assets/icons';

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
    className="flex flex-1 w-full"
    style={{
      position: 'absolute',
      top: '9999px',
      width: hiddenTextareaWidth ? `${hiddenTextareaWidth}px` : 'auto',
    }}
  >
    <div className="flex flex-1 gap-2">
      <LightSearchIcon className="items-center my-[7px] text-brown1 w-[1.375rem] h-[1.375rem]" />
      <TextareaAutosize
        ref={hiddenTextareaRef}
        className="flex-auto focus:outline-none resize-none min-h-9 content-center
              text-[#111111] bg-transparent placeholder-custom"
        value={value}
      />
      <div className="flex justify-end w-fit">
        <RightArrowIcon
          tabIndex={0}
          className="h-7 w-7 mx-1 p-1 cursor-pointer rounded-full bg-[#F4CDB1] self-end justify-center flex-shrink-0"
        />
      </div>
    </div>
  </div>
);

export default HiddenTextarea;
