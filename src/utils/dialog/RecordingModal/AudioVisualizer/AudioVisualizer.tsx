interface AudioVisualizerProps {
  isRecording: boolean;
  recordingTime: number;
  visualizerData: number[];
  audioWaveform: number[];
}

const AudioVisualizer = ({
  isRecording,
  recordingTime,
  visualizerData,
  audioWaveform,
}: AudioVisualizerProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 bg-[#e8e1d9] rounded-2xl p-3">
      <div className="flex items-center gap-2">
        {isRecording && <span className="text-red-500 animate-pulse">●</span>}
        <span className="text-[#8b7e74]">{formatTime(recordingTime)}</span>
      </div>
      <div className="h-12 mt-2 flex items-center">
        {isRecording
          ? visualizerData.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-[#8b7e74] rounded-full mx-[1px]"
                style={{ height: `${value}%` }}
              />
            ))
          : audioWaveform.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-[#8b7e74] rounded-full mx-[1px]"
                style={{ height: `${value}%` }}
              />
            ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
