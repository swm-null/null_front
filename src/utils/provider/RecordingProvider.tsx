import { useState, useCallback, ReactNode, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import {
  RecordingContext,
  RecordingModalState,
  RecordingModal,
  AlertContext,
} from 'utils';

const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const ALLOWED_AUDIO_FILE_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'video/mp4',
    'audio/x-m4a',
    'audio/webm',
  ];

  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);

  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  const handleSaveAudio = useCallback((blob: Blob) => {
    setAudioBlobs([blob]);
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
  }, []);

  const isValidFileType = (file: File) => {
    return ALLOWED_AUDIO_FILE_TYPES.includes(file.type);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        if (isValidFileType(file)) {
          const blob = new Blob([file], { type: file.type });
          setAudioBlobs([blob]);
          closeRecordingModal();
        }
      });
    },
    [closeRecordingModal, alert, t]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const handleAddAudioButtonClick = useCallback(() => {
    const inputFile = document.querySelector(
      '#audio-file-input'
    ) as HTMLInputElement;

    if (inputFile) inputFile.click();
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        recordingModal,
        openRecordingModal,
        closeRecordingModal,
        audioBlobs,
        removeAudio,
        setAudioBlobs,
        ALLOWED_AUDIO_FILE_TYPES,
        isValidFileType,
        getRootProps,
        getInputProps,
        handleAddAudioButtonClick,
      }}
    >
      {children}
      {recordingModal && <RecordingModal {...recordingModal} />}
    </RecordingContext.Provider>
  );
};

export default RecordingProvider;
