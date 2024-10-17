import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
import { ChangeEvent, MouseEvent } from 'react';

const IconButtons = ({
  submitAvailable,
  onMicButtonClick,
  onCameraButtonClick,
  onFileChange,
  onSubmitButtonClick,
}: {
  submitAvailable: boolean;
  onMicButtonClick?: () => void;
  onCameraButtonClick?: (e: MouseEvent<SVGSVGElement>) => void; // 타입 변경
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitButtonClick?: () => void;
}) => (
  <div className="flex justify-end gap-1 items-center">
    <MicIcon
      tabIndex={0}
      className="w-7 h-7 cursor-pointer"
      onClick={onMicButtonClick}
    />
    <form>
      <input
        title="input-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
      <CameraIcon
        tabIndex={0}
        className="w-7 h-7 cursor-pointer"
        onClick={onCameraButtonClick}
      />
    </form>
    {submitAvailable && (
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

export default IconButtons;
