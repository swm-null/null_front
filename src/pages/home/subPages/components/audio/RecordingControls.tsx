import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { AudioVisualizer } from 'utils/dialog/RecordingModal/AudioVisualizer';
import { PlaybackButton, RecordButton } from 'utils/dialog/RecordingModal/buttons';
import { useAudioPlayer, useAudioWaveform } from './hooks';

interface RecordingControlsProps {
  audioUrl: string | null;
  recordingTime?: number;
  editable?: {
    isRecording: boolean;
    visualizerData: number[];
    handleStopRecording: () => void;
    handleStartRecording: () => void;
  };
}

const RecordingControls = ({
  audioUrl,
  recordingTime: originalRecordingTime,
  editable,
}: RecordingControlsProps) => {
  const { isPlaying, recordingTime, togglePlayback } = useAudioPlayer(audioUrl);
  const [audioWaveform] = useAudioWaveform(audioUrl);

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

  if (audioWaveform.length <= 0) return;

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
          recordingTime={
            audioUrl || !originalRecordingTime
              ? recordingTime
              : originalRecordingTime
          }
          audioWaveform={audioWaveform}
        />
      </div>
    </div>
  );
};

export default RecordingControls;
