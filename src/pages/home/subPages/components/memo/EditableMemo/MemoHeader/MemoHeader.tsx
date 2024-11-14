import { CameraIcon, DeleteIcon, MicIcon } from 'assets/icons';
import { format } from 'date-fns';
import { useContext } from 'react';
import { ImageListContext } from 'utils';
import { ImageFileInput } from 'pages/home/subPages/components';

const MemoHeader = ({
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  haveAudio: boolean;
  updatedAt: string;
  dateFormat: string;
  handleDeleteMemo: () => void;
}) => {
  const { handleImageFilesChange, handleAddImageButtonClick } =
    useContext(ImageListContext);

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  return (
    <div className="flex gap-4 items-center">
      <ImageFileInput
        className="flex gap-4 flex-shrink-0"
        handleImageFileChange={handleImageFilesChange}
      >
        <CameraIcon
          className="w-6 h-6 p-[2px] text-brown2 cursor-pointer"
          onClick={handleAddImageButtonClick}
        />
      </ImageFileInput>
      <MicIcon className="w-6 h-6 text-brown2" />
      <p className="ml-auto text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
      <DeleteIcon
        className="text-brown2 w-6 h-6 flex-shrink-0 cursor-pointer"
        onClick={handleDeleteMemo}
      />
    </div>
  );
};

export default MemoHeader;
