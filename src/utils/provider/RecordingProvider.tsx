import { useState, useCallback, ReactNode } from 'react';
import { RecordingContext, RecordingModalState, RecordingModal } from 'utils';

const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  const handleSaveAudio = useCallback((blob: Blob) => {
    setAudioBlob(blob);
    closeRecordingModal();
  }, []);

  const openRecordingModal = useCallback(() => {
    setRecordingModal({
      open: true,
      onClose: () => closeRecordingModal(),
      onSend: handleSaveAudio,
    });
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        recordingModal,
        openRecordingModal,
        closeRecordingModal,
        audioBlob,
      }}
    >
      {children}
      {recordingModal && <RecordingModal {...recordingModal} />}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;
