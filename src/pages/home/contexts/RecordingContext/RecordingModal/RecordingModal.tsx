import { Modal } from '@mui/material';
import { useRecordingManager, useVisualizerManager } from './hooks';
import { ModalActionButtons } from './ModalActionButtons';
import { AudioFileInput, RecordingControls } from 'pages/home/subPages/components';
import { useContext } from 'react';
import { RecordingContext } from 'utils/contexts';

// FIXME: 이거 안 바꾸면 내가 미친거 ㅇㅇ _ minji

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (audioFile: File) => void;
}

const RecordingModal = ({ open, onClose, onSend }: RecordingModalProps) => {
  const { getRootProps, getInputProps, handleAddAudioButtonClick } =
    useContext(RecordingContext);

  const recordingManager = useRecordingManager();
  const visualizerManager = useVisualizerManager();

  const handleStartRecording = async () => {
    try {
      // 이전 녹음이 있으면 이전 url 삭제

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
    if (recordingManager.audioFile && onSend) {
      onSend(recordingManager.audioFile);
      onClose();
    }
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
          {...getRootProps({ style: { outline: 'none' } })}
        >
          <AudioFileInput
            handleAudioFileChange={recordingManager.handleAudioFileChange}
          >
            <div className="flex w-full h-36 items-center gap-4">
              <RecordingControls
                audioUrl={recordingManager?.audioUrl || null}
                recordingTime={recordingManager.recordingTime}
                isRecording={recordingManager.isRecording}
                visualizerData={visualizerManager.visualizerData}
                handleStopRecording={handleStopRecording}
                handleStartRecording={handleStartRecording}
              />
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
