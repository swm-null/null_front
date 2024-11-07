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
  audioBlob: Blob | null;
  audioWaveform: number[];
  setAudioWaveform: (waveform: number[]) => void;
};

export const RecordingContext = createContext<RecordingContextType>({
  recordingModal: null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
  audioBlob: null,
  audioWaveform: [],
  setAudioWaveform: () => {},
});
