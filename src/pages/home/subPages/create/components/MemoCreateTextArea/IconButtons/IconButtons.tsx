import { RightArrowIcon } from 'assets/icons';
import { ImageFileInput } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { ImageListContext } from 'utils';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

const IconButtons = ({
  message,
  submitAvailable,
  MAX_TEXT_LENGTH,
  onSubmitButtonClick,
}: {
  message?: string;
  submitAvailable: boolean;
  MAX_TEXT_LENGTH: number;
  onMicButtonClick?: () => void;
  onSubmitButtonClick?: () => void;
}) => {
  const { handleAddImageButtonClick, handleImageFilesChange } =
    useContext(ImageListContext);

  return (
    <div className="flex justify-end gap-1 items-center">
      {submitAvailable && `${message ? message.length : 0} / ${MAX_TEXT_LENGTH}`}
      <ImageFileInput handleImageFileChange={handleImageFilesChange}>
        <AddAPhotoOutlinedIcon
          tabIndex={0}
          sx={{ width: 20, height: 20 }}
          className="cursor-pointer mx-1"
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
