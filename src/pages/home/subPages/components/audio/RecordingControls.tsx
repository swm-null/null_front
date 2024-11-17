import { useRef, useState, useEffect } from 'react';
import { AudioVisualizer } from 'utils/dialog/RecordingModal/AudioVisualizer';
import { RecordButton } from 'utils/dialog/RecordingModal/buttons';
import { useAudioPlayer } from './hooks';

interface RecordingControlsProps {
  audioUrl: string | null;
  recordingTime?: number;
  isRecording: boolean;
  visualizerData: number[];
  handleStopRecording: () => void;
  handleStartRecording: () => void;
}

const RecordingControls = ({
  audioUrl,
  recordingTime: originalRecordingTime,
  isRecording,
  visualizerData,
  handleStopRecording,
  handleStartRecording,
}: RecordingControlsProps) => {
  const { recordingTime } = useAudioPlayer(audioUrl);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const contentWidth = contentRef.current?.offsetWidth || 0;

    if (contentWidth > containerWidth) {
      setScale(containerWidth / contentWidth);
    } else {
      setScale(1);
    }
  }, [audioUrl, recordingTime]);

  return (
    <div ref={containerRef} className="flex w-full h-full">
      <div
        ref={contentRef}
        className="flex h-full gap-4 w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'left' }}
      >
        <RecordButton
          isRecording={isRecording}
          onToggleRecording={
            isRecording ? handleStopRecording : handleStartRecording
          }
        />
        <AudioVisualizer
          audioUrl={audioUrl}
          isRecording={
            visualizerData && visualizerData.length > 0
              ? {
                  isRecording: isRecording,
                  visualizerData: visualizerData,
                }
              : null
          }
          recordingTime={
            audioUrl || !originalRecordingTime
              ? recordingTime
              : originalRecordingTime
          }
        />
      </div>
    </div>
  );
};

export default RecordingControls;
