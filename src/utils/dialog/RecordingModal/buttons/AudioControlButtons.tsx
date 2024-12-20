import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';

const baseButtonStyles =
  'bg-[#e8e1d9] hover:bg-[#d8d1c9] rounded-full p-3 transition-colors w-12 h-12 self-center cursor-pointer';
const baseIconStyles = 'text-[#8b7e74]';

interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const RecordButton = ({
  isRecording,
  onToggleRecording,
}: RecordButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleRecording();
  };

  return (
    <button type="button" onClick={handleClick} className={baseButtonStyles}>
      {isRecording ? (
        <StopIcon className={baseIconStyles} />
      ) : (
        <MicIcon className={baseIconStyles} />
      )}
    </button>
  );
};

interface PlaybackButtonProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
}

export const PlaybackButton = ({
  isPlaying,
  onTogglePlayback,
}: PlaybackButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTogglePlayback();
  };

  return (
    <button type="button" onClick={handleClick} className={baseButtonStyles}>
      {isPlaying ? (
        <PauseIcon className={baseIconStyles} />
      ) : (
        <PlayArrowIcon className={baseIconStyles} />
      )}
    </button>
  );
};

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton = ({ onReset }: ResetButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReset();
  };

  return (
    <button type="button" onClick={handleClick} className={baseButtonStyles}>
      <RefreshIcon className={baseIconStyles} />
    </button>
  );
};
