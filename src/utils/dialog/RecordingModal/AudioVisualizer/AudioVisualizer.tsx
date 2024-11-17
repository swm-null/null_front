import { useEffect, useRef, useState } from 'react';
import { AudioPlayer } from 'react-audio-player-component';

interface AudioVisualizerProps {
  audioUrl: string | null;
  isRecording: {
    isRecording: boolean;
    visualizerData: number[];
  } | null;
  recordingTime: number;
}

const AudioVisualizer = ({
  audioUrl,
  isRecording,
  recordingTime,
}: AudioVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setContainerWidth(containerRef.current?.offsetWidth || 0);
    setContainerHeight(containerRef.current?.offsetHeight || 0);
  }, [containerRef]);

  return (
    <div className="w-full flex flex-1 min-h-24 bg-[#e8e1d9] rounded-2xl p-3 flex-shrink-0">
      <div ref={containerRef} className="w-full h-full flex items-center">
        {isRecording?.isRecording ? (
          <>
            {isRecording.visualizerData.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-[#8b7e74] rounded-full mx-[1px]"
                style={{ height: `${value}%` }}
              />
            ))}
            <div className="flex items-center gap-2">
              {isRecording?.isRecording && (
                <span className="text-red-500 animate-pulse">●</span>
              )}
              <span className="text-[#8b7e74]">{formatTime(recordingTime)}</span>
            </div>
          </>
        ) : audioUrl ? (
          <AudioPlayer
            key={audioUrl}
            src={audioUrl}
            minimal={true}
            width={containerWidth}
            trackHeight={containerHeight}
            barWidth={2}
            gap={1}
            padding={0}
            margin={0}
            visualise={true}
            backgroundColor="#e8e1d9"
            barColor="#8b7e74"
            barPlayedColor="#F4CDB1"
            skipDuration={2}
            showLoopOption={true}
            showVolumeControl={true}
            hideSeekBar={true}
            hideSeekKnobWhenPlaying={true}
          />
        ) : (
          <div className="w-full"></div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;
