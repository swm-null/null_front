import { createContext } from 'react';
import { useState, useCallback, ReactNode, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { RecordingModal, AlertContext } from 'utils';

type RecordingModalState = {
  open: boolean;
  onClose: () => void;
  onSend: (audio: File) => void;
  audio: File | null;
  setAudio: (audio: File | null) => void;
};

type RecordingContextType = {
  recordingModal: RecordingModalState | null;
  openRecordingModal: (
    audio: File | null,
    setAudio: (audio: File | null) => void
  ) => void;
  closeRecordingModal: () => void;
  ALLOWED_AUDIO_FILE_TYPES: string[];
  isValidFileType: (file: File) => boolean;
  getRootProps: any;
  getInputProps: any;
  handleAddAudioButtonClick: () => void;
};

export const RecordingContext = createContext<RecordingContextType>({
  recordingModal: null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
  ALLOWED_AUDIO_FILE_TYPES: [],
  isValidFileType: () => false,
  getRootProps: () => {},
  getInputProps: () => {},
  handleAddAudioButtonClick: () => {},
});

export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const ALLOWED_AUDIO_FILE_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/x-m4a',
    'audio/webm',
  ];

  const { t } = useTranslation();
  const { alert } = useContext(AlertContext);

  const [recordingModal, setRecordingModal] = useState<RecordingModalState | null>(
    null
  );
  const closeRecordingModal = useCallback(() => {
    setRecordingModal(null);
  }, []);

  const openRecordingModal = useCallback(
    (audio: File | null, setAudioFn: (audio: File | null) => void) => {
      setRecordingModal({
        open: true,
        onClose: () => closeRecordingModal(),
        onSend: (audio: File) => {
          setAudioFn(audio);
          closeRecordingModal();
        },
        audio,
        setAudio: setAudioFn,
      });
    },
    [closeRecordingModal]
  );

  const isValidFileType = (file: File) => {
    return ALLOWED_AUDIO_FILE_TYPES.includes(file.type);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        if (isValidFileType(file)) {
          recordingModal?.setAudio(file);
          closeRecordingModal();
        } else {
          alert(t('Invalid file type'));
        }
      });
    },
    [closeRecordingModal, recordingModal?.setAudio, alert, isValidFileType, t]
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
