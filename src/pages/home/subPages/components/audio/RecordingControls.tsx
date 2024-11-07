import { AudioVisualizer } from 'utils/dialog/RecordingModal/AudioVisualizer';
import { PlaybackButton, RecordButton } from 'utils/dialog/RecordingModal/buttons';

interface RecordingControlsProps {
  audioUrl?: string | null;
  isPlaying: boolean;
  recordingTime: number;
  audioWaveform: number[];
  editable?: {
    isRecording: boolean;
    visualizerData: number[];
    handleStopRecording: () => void;
    handleStartRecording: () => void;
  };
  togglePlayback: () => void;
}

const RecordingControls = ({
  audioUrl,
  isPlaying,
  recordingTime,
  audioWaveform,
  editable,
  togglePlayback,
}: RecordingControlsProps) => {
  return (
    <div className="flex gap-2 w-full h-full">
      {!audioUrl ? (
        editable && (
          <RecordButton
            isRecording={editable.isRecording}
            onToggleRecording={
              editable.isRecording
                ? editable.handleStopRecording
                : editable.handleStartRecording
            }
          />
        )
      ) : (
        <PlaybackButton isPlaying={isPlaying} onTogglePlayback={togglePlayback} />
      )}
      <AudioVisualizer
        isRecording={
          editable?.visualizerData && editable.visualizerData.length > 0
            ? {
                isRecording: editable.isRecording,
                visualizerData: editable.visualizerData,
              }
            : null
        }
        recordingTime={recordingTime}
        audioWaveform={audioWaveform}
      />
    </div>
  );
};

export default RecordingControls;
