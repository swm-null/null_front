import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';

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

export default IconButtons;
