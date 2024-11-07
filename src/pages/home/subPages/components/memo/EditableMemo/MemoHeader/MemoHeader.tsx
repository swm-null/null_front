import { CameraIcon, DeleteIcon, MicIcon } from 'assets/icons';
import { format } from 'date-fns';
import { useContext } from 'react';
import { AlertContext, ImageListContext, RecordingContext } from 'utils';
import { ImageFileInput } from 'pages/home/subPages/components';

const MemoHeader = ({
  haveAudio,
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
  const { openRecordingModal } = useContext(RecordingContext);
  const { confirmAlert } = useContext(AlertContext);

  const formatDate = (date: string): string => {
    if (date.endsWith('Z')) {
      return format(new Date(date), dateFormat);
    }
    return format(`${date}Z`, dateFormat);
  };

  const handleAddVoiceButtonClick = async () => {
    if (haveAudio) {
      const confirm = await confirmAlert(
        '새로운 녹음을 시작하면, 이전의 녹음 기록이 삭제됩니다. 계속하시겠습니까?'
      );
      if (confirm) {
        openRecordingModal();
      }
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <ImageFileInput
        className="flex gap-4 flex-shrink-0"
        handleImageFileChange={handleImageFilesChange}
      >
        <CameraIcon
          className="text-brown2 w-6 h-6"
          onClick={handleAddImageButtonClick}
        />
        <MicIcon
          className="text-brown2 w-6 h-6"
          onClick={handleAddVoiceButtonClick}
        />
      </ImageFileInput>
      <p className="ml-auto text-center font-medium text-sm text-brown2">
        {formatDate(updatedAt)}
      </p>
      <DeleteIcon
        className="text-brown2 w-5 h-5 flex-shrink-0"
        onClick={handleDeleteMemo}
      />
    </div>
  );
};

export default MemoHeader;
