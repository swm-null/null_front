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
  audioWaveform: number[];
  setAudioWaveform: (waveform: number[]) => void;
  removeAudio: () => void;
};

export const RecordingContext = createContext<RecordingContextType>({
  recordingModal: null,
  openRecordingModal: () => {},
  closeRecordingModal: () => {},
  audioBlobs: [],
  audioWaveform: [],
  setAudioWaveform: () => {},
  removeAudio: () => {},
});
