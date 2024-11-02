import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
import { FileInput } from 'pages/home/subPages/components';
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
  const {
    ALLOWED_IMAGE_FILE_TYPES,
    handleAddImageButtonClick,
    handleImageFilesChange,
  } = useContext(ImageListContext);

  return (
    <div className="flex justify-end gap-1 items-center">
      <MicIcon
        tabIndex={0}
        className="w-7 h-7 cursor-pointer"
        onClick={onMicButtonClick}
      />
      <FileInput
        ALLOWED_FILE_TYPES={ALLOWED_IMAGE_FILE_TYPES}
        handleImageFileChange={handleImageFilesChange}
      >
        <CameraIcon
          tabIndex={0}
          className="w-7 h-7 cursor-pointer"
          onClick={handleAddImageButtonClick}
        />
      </FileInput>
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
