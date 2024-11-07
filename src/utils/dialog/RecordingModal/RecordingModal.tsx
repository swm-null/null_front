import { Modal } from '@mui/material';
import { AudioVisualizer } from './AudioVisualizer';
import { RecordButton, PlaybackButton, ResetButton } from './buttons';
import { useRecordingManager, useVisualizerManager } from './hooks';
import { ModalActionButtons } from './ModalActionButtons';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (audioBlob: Blob) => void;
}

const RecordingModal = ({ open, onClose, onSend }: RecordingModalProps) => {
  const recordingManager = useRecordingManager();
  const visualizerManager = useVisualizerManager();

  const handleStartRecording = async () => {
    try {
      await recordingManager.startRecording(
        visualizerManager.setAudioWaveform,
        visualizerManager.startVisualizer
      );
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const handleStopRecording = () => {
    recordingManager.stopRecording(visualizerManager.animationFrameRef);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recordingManager.audioBlob && onSend) {
      onSend(recordingManager.audioBlob);
      onClose();
    }
  };

  const handleReset = () => {
    recordingManager.handleDelete(visualizerManager.resetVisualizer);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="bg-[#f5f0ea] p-6 rounded-3xl shadow-lg w-[480px] relative">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="w-full flex items-center gap-4">
            {!recordingManager.audioUrl ? (
              <RecordButton
                isRecording={recordingManager.isRecording}
                onToggleRecording={
                  recordingManager.isRecording
                    ? handleStopRecording
                    : handleStartRecording
                }
              />
            ) : (
              <PlaybackButton
                isPlaying={recordingManager.isPlaying}
                onTogglePlayback={recordingManager.togglePlayback}
              />
            )}
            <AudioVisualizer
              isRecording={recordingManager.isRecording}
              recordingTime={recordingManager.recordingTime}
              visualizerData={visualizerManager.visualizerData}
              audioWaveform={visualizerManager.audioWaveform}
            />
            {recordingManager.audioUrl && <ResetButton onReset={handleReset} />}
          </div>
          <audio
            ref={recordingManager.audioRef}
            src={recordingManager.audioUrl || undefined}
            onEnded={() => recordingManager.setIsPlaying(false)}
          />
        </div>
        <ModalActionButtons onSubmit={handleSend} onClose={onClose} />
      </div>
    </Modal>
  );
};

export default RecordingModal;
