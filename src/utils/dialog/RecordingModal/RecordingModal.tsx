import { Modal } from '@mui/material';
import { ResetButton } from './buttons';
import { useRecordingManager, useVisualizerManager } from './hooks';
import { ModalActionButtons } from './ModalActionButtons';
import { AudioFileInput, RecordingControls } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { RecordingContext } from 'utils/context';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (audioBlob: Blob, waveform: number[]) => void;
}

const RecordingModal = ({ open, onClose, onSend }: RecordingModalProps) => {
  const { getRootProps, getInputProps, handleAddAudioButtonClick } =
    useContext(RecordingContext);
  const recordingManager = useRecordingManager();
  const visualizerManager = useVisualizerManager();

  const handleStartRecording = async () => {
    try {
      await recordingManager.startRecording(visualizerManager.startVisualizer);
    } catch (err) {
      // TODO: 시스템 설정에서 브라우저의 마이크 접근이 차단되어 있을 때 혹은, 다른 탭에서 마이크를 사용중일 때 나는 오류
    }
  };

  const handleStopRecording = () => {
    recordingManager.stopRecording(visualizerManager.animationFrameRef);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recordingManager.audioBlob && onSend) {
      onSend(recordingManager.audioBlob, visualizerManager.audioWaveform);
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
      <>
        <input {...getInputProps()} />
        <div
          className="bg-[#f5f0ea] p-6 rounded-3xl shadow-lg w-[480px] relative"
          {...getRootProps()}
        >
          <AudioFileInput
            handleAudioFileChange={recordingManager.handleAudioFileChange}
          >
            <div className="flex w-full h-36 items-center gap-4">
              <RecordingControls
                audioUrl={recordingManager.audioUrl}
                recordingTime={recordingManager.recordingTime}
                editable={{
                  isRecording: recordingManager.isRecording,
                  visualizerData: visualizerManager.visualizerData,
                  handleStopRecording: handleStopRecording,
                  handleStartRecording: handleStartRecording,
                }}
              />
              {recordingManager.audioUrl && <ResetButton onReset={handleReset} />}
            </div>
          </AudioFileInput>
          <ModalActionButtons
            disabled={!recordingManager.audioUrl}
            onSubmit={handleSend}
            onClose={onClose}
            onUpload={handleAddAudioButtonClick}
          />
        </div>
      </>
    </Modal>
  );
};

export default RecordingModal;
