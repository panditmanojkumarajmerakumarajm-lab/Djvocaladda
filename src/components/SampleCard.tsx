import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { AudioSample } from "../types";
import { Play, Pause, Volume2, VolumeX, Sparkles, Music } from "lucide-react";

interface SampleCardProps {
  sample: AudioSample;
  currentlyPlayingId: string | null;
  onPlayToggle: (sampleId: string | null) => void;
  onOrderClick: (sample: AudioSample) => void;
}

export default function SampleCard({
  sample,
  currentlyPlayingId,
  onPlayToggle,
  onOrderClick,
}: SampleCardProps) {
  const isPlaying = currentlyPlayingId === sample.id;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(sample.duration || "0:00");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // Sync html audio element with play/pause state
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sample.audioUrl);
      
      // Event listeners
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);
    } else {
      // If URL changed
      if (audioRef.current.src !== sample.audioUrl) {
        audioRef.current.pause();
        audioRef.current.src = sample.audioUrl;
        audioRef.current.load();
      }
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio playback failed, user interaction may be required:", err);
        onPlayToggle(null);
      });
    } else {
      audio.pause();
    }

    return () => {
      // Clean up when sample is changed or component unmounts
      audio.pause();
    };
  }, [isPlaying, sample.audioUrl]);

  // Handle volume & mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Clean up completely on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current = null;
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setProgress((cur / dur) * 100);
      setCurrentTime(formatTime(cur));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    setProgress(0);
    setCurrentTime("0:00");
    onPlayToggle(null);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayButtonClick = () => {
    if (isPlaying) {
      onPlayToggle(null);
    } else {
      onPlayToggle(sample.id);
    }
  };

  const handleScrubChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newPct = parseFloat(e.target.value);
      const newTime = (newPct / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setProgress(newPct);
      setCurrentTime(formatTime(newTime));
    }
  };

  return (
    <div
      id={`sample-card-${sample.id}`}
      className={`bg-[#120c24] border rounded-2xl p-5 hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between ${
        isPlaying
          ? "border-purple-500 shadow-xl shadow-purple-500/10"
          : "border-purple-900/40 hover:border-purple-800"
      }`}
    >
      {/* Decorative corner light */}
      {isPlaying && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
      )}

      <div>
        {/* Category badge & animated waves */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-purple-950/80 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
            {sample.category || "DJ Vocal"}
          </span>
          
          {isPlaying ? (
            <div className="flex items-end space-x-0.5 h-4 px-1">
              <span className="w-1 bg-pink-500 rounded-full animate-[bounce_1s_infinite_100ms] h-3"></span>
              <span className="w-1 bg-purple-500 rounded-full animate-[bounce_1s_infinite_300ms] h-4"></span>
              <span className="w-1 bg-pink-500 rounded-full animate-[bounce_1s_infinite_200ms] h-2"></span>
              <span className="w-1 bg-purple-500 rounded-full animate-[bounce_1s_infinite_400ms] h-3"></span>
            </div>
          ) : (
            <span className="text-[10px] text-purple-400/60 font-mono">
              Ready to Preview
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-white text-base md:text-lg mb-4 line-clamp-2 leading-tight">
          {sample.title}
        </h3>

        {/* Custom Audio Seeker and Player Interface */}
        <div className="bg-[#0a0515] rounded-xl p-3 mb-5 border border-purple-950">
          <div className="flex items-center justify-between mb-2">
            {/* Play Button */}
            <button
              id={`btn-play-${sample.id}`}
              onClick={handlePlayButtonClick}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                isPlaying
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/25"
                  : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/40"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Time Indicators */}
            <div className="text-[11px] font-mono text-purple-300 flex items-center space-x-1.5">
              <span className={isPlaying ? "text-pink-400 font-bold" : ""}>
                {currentTime}
              </span>
              <span className="text-purple-600">/</span>
              <span>{duration}</span>
            </div>

            {/* Volume Toggle */}
            <button
              id={`btn-volume-${sample.id}`}
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-purple-400 hover:text-purple-200 transition-all"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Seek Bar */}
          <input
            id={`seek-bar-${sample.id}`}
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleScrubChange}
            className="w-full h-1.5 rounded-lg bg-purple-950 appearance-none cursor-pointer accent-pink-500"
            style={{
              background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${progress}%, #0f0926 ${progress}%, #0f0926 100%)`
            }}
          />
        </div>
      </div>

      {/* Make For Yourself button with pricing */}
      <button
        id={`btn-order-${sample.id}`}
        onClick={() => onOrderClick(sample)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all flex items-center justify-center space-x-2 text-xs md:text-sm uppercase tracking-wider font-display active:scale-[0.98]"
      >
        <Sparkles className="w-4 h-4" />
        <span>Make for yourself (₹49)</span>
      </button>
    </div>
  );
}
