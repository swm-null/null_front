import { ChangeEvent, ReactNode, useContext } from 'react';
import { AlertContext, RecordingContext } from 'utils';

interface AudioFileInputProps {
  handleClick?: () => void;
  handleAudioFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
}

const AudioFileInput = ({
  handleClick,
  handleAudioFileChange,
  children,
  className,
}: AudioFileInputProps) => {
  const { ALLOWED_AUDIO_FILE_TYPES } = useContext(RecordingContext);
  const { alert } = useContext(AlertContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE_MB = 10;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      alert(`${MAX_FILE_SIZE_MB}MB를 초과하는 파일은 메모에 추가할 수 없습니다.`);
      e.target.value = '';
      return;
    }

    handleAudioFileChange(e);
  };

  return (
    <>
      <form className={className} onClick={handleClick}>
        <input
          id="audio-file-input"
          type="file"
          accept={ALLOWED_AUDIO_FILE_TYPES.join(', ')}
          onChange={handleFileChange}
          className="hidden"
        />
      </form>
      {children}
    </>
  );
};

export default AudioFileInput;
