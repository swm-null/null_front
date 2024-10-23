import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
import { ChangeEvent, useContext } from 'react';
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
  const { addImage, isValidFileType } = useContext(ImageListContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (isValidFileType(file)) {
          addImage(file);
        }
      });
    }
  };

  const handleCameraButtonClick = () => {
    const inputFile = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (inputFile) inputFile.click();
  };

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
          onChange={handleFileChange}
          className="hidden"
        />
        <CameraIcon
          tabIndex={0}
          className="w-7 h-7 cursor-pointer"
          onClick={handleCameraButtonClick}
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
