import { useState, useCallback, ReactNode } from 'react';
import { RecordingContext, RecordingModalState, RecordingModal } from 'utils';

const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );

  const openRecordingModal = useCallback(() => {
    setRecordingModal({
      open: true,
      onClose: () => closeRecordingModal(),
    });
  }, []);

  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        recordingModal,
        openRecordingModal,
        closeRecordingModal,
      }}
    >
      {children}
      {recordingModal && <RecordingModal {...recordingModal} />}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;
