import { useState, useEffect } from 'react';

const useAudioPlayer = (audioUrl: string | null) => {
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (!audioUrl) return;

    const context = new AudioContext();
    fetch(audioUrl)
      .then((response) => response.arrayBuffer())
      .then(async (arrayBuffer) => {
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        setRecordingTime(Math.floor(audioBuffer.duration));
      });
  }, [audioUrl]);

  return { recordingTime };
};

export default useAudioPlayer;
