import { ChangeEvent, ReactNode, useContext } from 'react';
import { RecordingContext } from 'utils';

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

  return (
    <>
      <form className={className} onClick={handleClick}>
        <input
          id="audio-file-input"
          type="file"
          accept={ALLOWED_AUDIO_FILE_TYPES.join(', ')}
          onChange={handleAudioFileChange}
          className="hidden"
        />
      </form>
      {children}
    </>
  );
};

export default AudioFileInput;
