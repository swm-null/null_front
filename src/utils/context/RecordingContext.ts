import { createContext } from 'react';

export type RecordingModalState = {
  open: boolean;
  onClose: () => void;
  onSend: (blob: Blob) => void;
};

type RecordingContextType = {
  recordingModal: RecordingModalState | null;
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  audioBlob: Blob | null;
};

export const RecordingContext = createContext<RecordingContextType>({
  recordingModal: null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
  audioBlob: null,
});
