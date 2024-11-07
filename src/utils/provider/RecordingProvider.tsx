import { useState, useCallback, ReactNode } from 'react';
import { RecordingContext, RecordingModalState, RecordingModal } from 'utils';

const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);

  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  const handleSaveAudio = useCallback((blob: Blob, waveform: number[]) => {
    setAudioBlob(blob);
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
    setAudioBlob(null);
    setAudioWaveform([]);
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        recordingModal,
        openRecordingModal,
        closeRecordingModal,
        audioBlob,
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
