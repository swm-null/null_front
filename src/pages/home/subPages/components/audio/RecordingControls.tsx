import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AudioVisualizer } from 'utils/dialog/RecordingModal/AudioVisualizer';
import { PlaybackButton, RecordButton } from 'utils/dialog/RecordingModal/buttons';

interface RecordingControlsProps {
  audioUrl?: string | null;
  isPlaying: boolean;
  recordingTime: number;
  audioWaveform: number[];
  editable?: {
    isRecording: boolean;
    visualizerData: number[];
    handleStopRecording: () => void;
    handleStartRecording: () => void;
  };
  togglePlayback: () => void;
}

const RecordingControls = ({
  audioUrl,
  isPlaying,
  recordingTime,
  audioWaveform,
  editable,
  togglePlayback,
}: RecordingControlsProps) => {
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
  }, [audioUrl, isPlaying, recordingTime, audioWaveform]);

  return (
    <div ref={containerRef} className="flex w-full h-full">
      <div
        ref={contentRef}
        className={`flex ${editable ? 'gap-4 w-full' : 'gap-2 min-w-fit'}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'left' }}
      >
        {!audioUrl ? (
          editable && (
            <RecordButton
              isRecording={editable.isRecording}
              onToggleRecording={
                editable.isRecording
                  ? editable.handleStopRecording
                  : editable.handleStartRecording
              }
            />
          )
        ) : (
          <PlaybackButton isPlaying={isPlaying} onTogglePlayback={togglePlayback} />
        )}
        <AudioVisualizer
          isRecording={
            editable?.visualizerData && editable.visualizerData.length > 0
              ? {
                  isRecording: editable.isRecording,
                  visualizerData: editable.visualizerData,
                }
              : null
          }
          recordingTime={recordingTime}
          audioWaveform={audioWaveform}
        />
      </div>
    </div>
  );
};

export default RecordingControls;
