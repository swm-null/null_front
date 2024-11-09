import { CameraIcon, RightArrowIcon } from 'assets/icons';
import { ImageFileInput } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { ImageListContext } from 'utils';

const IconButtons = ({
  submitAvailable,
  onSubmitButtonClick,
}: {
  submitAvailable: boolean;
  onMicButtonClick?: () => void;
  onSubmitButtonClick?: () => void;
}) => {
  const { handleAddImageButtonClick, handleImageFilesChange } =
    useContext(ImageListContext);

  return (
    <div className="flex justify-end gap-1 items-center">
      <ImageFileInput handleImageFileChange={handleImageFilesChange}>
        <CameraIcon
          tabIndex={0}
          className="w-7 h-7 cursor-pointer"
          onClick={handleAddImageButtonClick}
        />
      </ImageFileInput>
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
