import { createContext } from 'react';

export type RecordingModalState = {
  open: boolean;
  onClose: () => void;
  onSend: (blob: Blob, waveform: number[]) => void;
};

type RecordingContextType = {
  recordingModal: RecordingModalState | null;
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  audioBlobs: Blob[];
  removeAudio: () => void;
  setAudioBlobs: (blobs: Blob[]) => void;
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
  audioBlobs: [],
  removeAudio: () => {},
  setAudioBlobs: () => {},
  ALLOWED_AUDIO_FILE_TYPES: [],
  isValidFileType: () => false,
  getRootProps: () => {},
  getInputProps: () => {},
  handleAddAudioButtonClick: () => {},
});
