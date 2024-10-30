import { CameraIcon, DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { useContext } from 'react';
import { ImageListContext } from 'utils';
import { FileInput } from 'pages/home/subPages/components';

const MemoHeader = ({
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  updatedAt: string;
  dateFormat: string;
  handleDeleteMemo: () => void;
}) => {
  const { handleImageFileChange, handleAddImageButtonClick } =
    useContext(ImageListContext);

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  return (
    <div className="flex gap-[1.44rem] items-center">
      <FileInput handleImageFileChange={handleImageFileChange}>
        <CameraIcon
          className="text-brown2 w-6 h-6"
          onClick={handleAddImageButtonClick}
        />
      </FileInput>
      <p className="ml-auto text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
      <DeleteIcon className="text-brown2 w-5 h-5" onClick={handleDeleteMemo} />
    </div>
  );
};

export default MemoHeader;
