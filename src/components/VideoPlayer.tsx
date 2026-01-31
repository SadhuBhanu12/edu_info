import React, { useState, useRef, useEffect } from 'react';
import type { VideoResource } from '../types';
import './VideoPlayer.css';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings, List } from 'lucide-react';

interface VideoPlayerProps {
  video: VideoResource;
  autoplay?: boolean;
  onComplete?: () => void;
  onProgress?: (percentage: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoplay = false,
  onComplete,
  onProgress
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        const progress = (video.currentTime / video.duration) * 100;
        onProgress(progress);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete, onProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const jumpToTimestamp = (time: string) => {
    const video = videoRef.current;
    if (!video) return;

    const [minutes, seconds] = time.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    video.currentTime = totalSeconds;
    setShowTimestamps(false);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = (): string => {
    if (video.embedUrl) return video.embedUrl;
    if (video.platform === 'YouTube') {
      const videoId = video.url.split('v=')[1] || video.url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return video.url;
  };

  // For embedded videos (YouTube, Vimeo)
  if (video.platform === 'YouTube' || video.platform === 'Vimeo') {
    return (
      <div className="video-player-container">
        <div className="video-header">
          <h3 className="video-title">{video.title}</h3>
          <span className="video-duration">{video.duration}</span>
        </div>
        <div className="video-embed">
          <iframe
            src={getVideoUrl()}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          />
        </div>
        {video.timestamps && video.timestamps.length > 0 && (
          <div className="video-timestamps">
            <h4>📌 Key Moments</h4>
            <div className="timestamp-list">
              {video.timestamps.map((ts, idx) => (
                <a
                  key={idx}
                  href={`${getVideoUrl()}?t=${ts.time.replace(':', 'm')}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timestamp-item"
                >
                  <span className="timestamp-time">{ts.time}</span>
                  <span className="timestamp-label">{ts.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Custom video player for self-hosted videos
  return (
    <div 
      className="video-player-container custom-player"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
    >
      <div className="video-header">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-metadata">
          <span className="video-duration">{video.duration}</span>
          {video.quality && <span className="video-quality">{video.quality}</span>}
        </div>
      </div>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          autoPlay={autoplay}
          className="video-element"
          onClick={togglePlay}
        />

        {showControls && (
          <div className="video-controls">
            {/* Progress bar */}
            <div className="progress-container">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="progress-bar"
              />
              <div 
                className="progress-filled"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control buttons */}
            <div className="controls-row">
              <div className="controls-left">
                <button onClick={togglePlay} className="control-btn">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => skip(-10)} className="control-btn">
                  <SkipBack size={20} />
                </button>
                <button onClick={() => skip(10)} className="control-btn">
                  <SkipForward size={20} />
                </button>
                <div className="volume-control">
                  <button onClick={toggleMute} className="control-btn">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
                <span className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="controls-right">
                {video.timestamps && video.timestamps.length > 0 && (
                  <button 
                    onClick={() => setShowTimestamps(!showTimestamps)} 
                    className="control-btn"
                  >
                    <List size={20} />
                  </button>
                )}
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className="control-btn"
                >
                  <Settings size={20} />
                </button>
                <button onClick={toggleFullscreen} className="control-btn">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings menu */}
        {showSettings && (
          <div className="settings-menu">
            <h4>Playback Speed</h4>
            <div className="speed-options">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => changePlaybackSpeed(speed)}
                  className={`speed-option ${playbackSpeed === speed ? 'active' : ''}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps panel */}
        {showTimestamps && video.timestamps && (
          <div className="timestamps-panel">
            <h4>📌 Chapters</h4>
            <div className="timestamp-list">
              {video.timestamps.map((ts, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToTimestamp(ts.time)}
                  className="timestamp-item"
                >
                  <span className="timestamp-time">{ts.time}</span>
                  <span className="timestamp-label">{ts.label}</span>
                  {ts.description && (
                    <span className="timestamp-desc">{ts.description}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {video.transcript && (
        <details className="video-transcript">
          <summary>📄 Transcript</summary>
          <p>{video.transcript}</p>
        </details>
      )}
    </div>
  );
};
