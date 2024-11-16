import { CameraIcon, MicIcon, RightArrowIcon } from 'assets/icons';
import { ImageFileInput } from 'pages/home/subPages/components';
import { ChangeEvent } from 'react';

const IconButtons = ({
  message,
  submitAvailable,
  MAX_TEXT_LENGTH,
  onImageFilesChange,
  onSubmitButtonClick,
}: {
  message?: string;
  submitAvailable: boolean;
  MAX_TEXT_LENGTH: number;
  onMicButtonClick?: () => void;
  onImageFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitButtonClick?: () => void;
}) => {
  return (
    <div className="flex justify-end gap-1 items-center">
      {submitAvailable && `${message ? message.length : 0} / ${MAX_TEXT_LENGTH}`}
      <ImageFileInput onFileChange={onImageFilesChange}>
        <CameraIcon className="w-6 h-6 p-[2px] text-brown2 cursor-pointer" />
      </ImageFileInput>
      <MicIcon className="w-7 h-7 text-brown2 " />
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
