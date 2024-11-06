import { createContext } from 'react';

export type RecordingModalState = {
  open: boolean;
  onClose: () => void;
};

type RecordingContextType = {
  recordingModal: RecordingModalState | null;
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
};

export const RecordingContext = createContext<RecordingContextType>({
  recordingModal: null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
});
