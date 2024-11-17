import { createContext } from 'react';

export type RecordingModalState = {
  open: boolean;
  onClose: () => void;
  onSend: (audio: Blob | File) => void;
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
