import { useState, useRef, useEffect } from 'react';
import { Modal } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (audioBlob: Blob) => void;
}

const RecordingModal = ({ open, onClose, onSend }: RecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startVisualizer = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 64;

    const updateVisualizer = () => {
      if (!analyserRef.current) return;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setVisualizerData(Array.from(dataArray));
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        analyzeAudio(blob);
      };

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      startVisualizer(stream);
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const samples = 64;
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j]);
      }
      waveform.push((sum / blockSize) * 255);
    }

    setAudioWaveform(waveform);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (audioBlob && onSend) {
      onSend(audioBlob);
      onClose();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="bg-[#f5f0ea] p-6 rounded-3xl shadow-lg w-[480px] relative">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex items-center gap-4">
            {!audioUrl ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className="bg-[#e8e1d9] hover:bg-[#d8d1c9] rounded-full p-3 transition-colors"
              >
                {isRecording ? (
                  <StopIcon className="text-[#8b7e74]" />
                ) : (
                  <MicIcon className="text-[#8b7e74]" />
                )}
              </button>
            ) : (
              <button
                onClick={togglePlayback}
                className="bg-[#e8e1d9] hover:bg-[#d8d1c9] rounded-full p-3 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="text-[#8b7e74]" />
                ) : (
                  <PlayArrowIcon className="text-[#8b7e74]" />
                )}
              </button>
            )}
            <div className="flex-1 bg-[#e8e1d9] rounded-2xl p-3">
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="text-red-500 animate-pulse">●</span>
                )}
                <span className="text-[#8b7e74]">{formatTime(recordingTime)}</span>
              </div>
              <div className="h-12 mt-2 flex items-center gap-0.5">
                {isRecording
                  ? visualizerData.map((value, index) => (
                      <div
                        key={index}
                        className="w-1 bg-[#8b7e74] rounded-full"
                        style={{ height: `${(value / 255) * 100}%` }}
                      />
                    ))
                  : audioWaveform.map((value, index) => (
                      <div
                        key={index}
                        className="w-1 bg-[#8b7e74] rounded-full"
                        style={{ height: `${(value / 255) * 100}%` }}
                      />
                    ))}
              </div>
            </div>

            <button
              onClick={handleDelete}
              className="bg-[#e8e1d9] hover:bg-[#d8d1c9] rounded-full p-3 transition-colors"
            >
              <RefreshIcon className="text-[#8b7e74]" />
            </button>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setIsPlaying(false)}
          />
        </div>

        <form className="flex justify-end mt-4 gap-2" onSubmit={handleSend}>
          <button
            type="submit"
            className="btn-primary px-3 py-1 text-sm bg-[#F4CDB1] rounded"
          >
            저장
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-3 py-1 text-sm bg-white border rounded"
          >
            취소
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default RecordingModal;
