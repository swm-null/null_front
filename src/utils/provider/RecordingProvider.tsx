import { useState, useCallback, ReactNode } from 'react';
import { RecordingContext, RecordingModalState, RecordingModal } from 'utils';

const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);

  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  const handleSaveAudio = useCallback((blob: Blob, waveform: number[]) => {
    setAudioBlobs([blob]);
    setAudioWaveform(waveform);
    closeRecordingModal();
  }, []);

  const openRecordingModal = useCallback(() => {
    setRecordingModal({
      open: true,
      onClose: () => closeRecordingModal(),
      onSend: handleSaveAudio,
    });
  }, []);

  const removeAudio = useCallback(() => {
    setAudioBlobs([]);
    setAudioWaveform([]);
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        recordingModal,
        openRecordingModal,
        closeRecordingModal,
        audioBlobs,
        audioWaveform,
        setAudioWaveform,
        removeAudio,
      }}
    >
      {children}
      {recordingModal && <RecordingModal {...recordingModal} />}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;
