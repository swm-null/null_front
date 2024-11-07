import { useState, useEffect } from 'react';

const useAudioWaveform = (audioUrl: string | null) => {
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    if (!audioUrl) return;

    const generateWaveform = async (url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);

        const samples = 64;
        const blockSize = Math.floor(channelData.length / samples);
        const waveform = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            const idx = i * blockSize + j;
            if (idx < channelData.length) {
              sum += Math.abs(channelData[idx]);
            }
          }
          const normalizedValue = (sum / blockSize) * 8000;
          waveform.push(Math.min(100, normalizedValue));
        }

        setWaveform(waveform);
      } catch (error) {
        setWaveform([]);
      }
    };

    generateWaveform(audioUrl);
  }, [audioUrl]);

  return [waveform];
};

export default useAudioWaveform;
