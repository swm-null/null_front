import { CameraIcon, DeleteIcon } from 'assets/icons';
import { format } from 'date-fns';
import { ChangeEvent, useContext } from 'react';
import { ImageListContext } from 'utils';

const MemoHeader = ({
  updatedAt,
  dateFormat,
  handleDeleteMemo,
}: {
  updatedAt: string;
  dateFormat: string;
  handleDeleteMemo: () => void;
}) => {
  const { addImage, isValidFileType } = useContext(ImageListContext);

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

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
    <div className="flex gap-[1.44rem] items-center">
      <form className="mr-auto">
        <input
          title="input-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <CameraIcon
          className="text-brown2 w-6 h-6"
          onClick={handleCameraButtonClick}
        />
      </form>
      <p className="text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
      <DeleteIcon className="text-brown2 w-5 h-5" onClick={handleDeleteMemo} />
    </div>
  );
};

export default MemoHeader;
