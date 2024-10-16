import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';

const IconButtons = ({
  submitAvailable,
  onMicButtonClick,
  onCameraButtonClick,
  onSubmitButtonClick,
}: {
  submitAvailable: boolean;
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
