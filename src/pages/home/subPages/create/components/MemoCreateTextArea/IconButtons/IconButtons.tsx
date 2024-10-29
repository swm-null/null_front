import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
import { useContext } from 'react';
import { ImageListContext } from 'utils';

const IconButtons = ({
  submitAvailable,
  onMicButtonClick,
  onSubmitButtonClick,
}: {
  submitAvailable: boolean;
  onMicButtonClick?: () => void;
  onSubmitButtonClick?: () => void;
}) => {
  const { handleAddImageButtonClick, handleImageFileChange } =
    useContext(ImageListContext);

  return (
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
          onChange={handleImageFileChange}
          className="hidden"
        />
        <CameraIcon
          tabIndex={0}
          className="w-7 h-7 cursor-pointer"
          onClick={handleAddImageButtonClick}
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
};

export default IconButtons;
