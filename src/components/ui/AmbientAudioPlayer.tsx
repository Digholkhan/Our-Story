import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles, SkipForward, SkipBack, Check } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  chords: number[][];
  tempo: number;
  type: OscillatorType;
}

const TRACKS: Track[] = [
  {
    id: 't1',
    name: 'Canon in D (Gentle Piano Romance)',
    artist: 'Johann Pachelbel (Acoustic Piano)',
    chords: [
      [293.66, 369.99, 440.00, 587.33], // D maj
      [220.00, 277.18, 329.63, 440.00], // A maj
      [246.94, 293.66, 369.99, 493.88], // Bm
      [185.00, 220.00, 277.18, 369.99], // F#m
      [196.00, 246.94, 293.66, 392.00], // G maj
      [146.83, 220.00, 293.66, 440.00], // D/F#
      [196.00, 246.94, 293.66, 392.00], // G maj
      [220.00, 277.18, 329.63, 440.00], // A maj
    ],
    tempo: 3000,
    type: 'triangle',
  },
  {
    id: 't2',
    name: 'A Thousand Years (Acoustic Strings)',
    artist: 'Romantic Strings Ensemble',
    chords: [
      [261.63, 329.63, 392.00, 523.25], // C
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [196.00, 246.94, 293.66, 392.00], // G
    ],
    tempo: 3400,
    type: 'sine',
  },
  {
    id: 't3',
    name: 'Golden Sunset Waltz (Ethereal Chords)',
    artist: 'Sunset Serenade Harmony',
    chords: [
      [329.63, 392.00, 493.88, 587.33], // Em7
      [220.00, 261.63, 329.63, 440.00], // Am7
      [293.66, 369.99, 440.00, 587.33], // D7
      [196.00, 246.94, 293.66, 392.00], // Gmaj7
    ],
    tempo: 3200,
    type: 'sine',
  },
  {
    id: 't4',
    name: 'Forever & Always (Warm Lofi Ambience)',
    artist: 'Cozy Wedding Lofi Strings',
    chords: [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
    ],
    tempo: 3600,
    type: 'triangle',
  },
];

export const AmbientAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const chordIdxRef = useRef(0);
  const currentVolumeRef = useRef(volume);

  useEffect(() => {
    currentVolumeRef.current = volume;
  }, [volume]);

  const currentTrack = TRACKS[trackIndex];

  const stopMusic = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getAudioContext = () => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChordNote = (track: Track) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chord = track.chords[chordIdxRef.current % track.chords.length];
      chordIdxRef.current++;

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : track.type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const noteStart = ctx.currentTime + i * 0.18;
        const noteDuration = 3.6;

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(
          Math.max(0.001, 0.05 * currentVolumeRef.current),
          noteStart + 0.5
        );
        gain.gain.exponentialRampToValueAtTime(0.00001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.2);
      });
    } catch (e) {
      console.error('Audio play note error:', e);
    }
  };

  const startTrack = (track: Track) => {
    stopMusic();
    chordIdxRef.current = 0;
    getAudioContext();

    // Play initial chord immediately
    playChordNote(track);

    // Schedule next chords
    intervalRef.current = window.setInterval(() => {
      playChordNote(track);
    }, track.tempo);
  };

  const selectTrack = (idx: number) => {
    setTrackIndex(idx);
    const newTrack = TRACKS[idx];
    startTrack(newTrack);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      startTrack(currentTrack);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    const nextIdx = (trackIndex + 1) % TRACKS.length;
    selectTrack(nextIdx);
  };

  const prevTrack = () => {
    const prevIdx = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prevIdx);
  };

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative flex items-center gap-2">
        {/* Expanded Controls Card */}
        {showControls && (
          <div className="glass-panel p-5 rounded-3xl border border-stone-200/90 shadow-2xl text-xs space-y-3.5 mr-2 animate-scaleIn w-72 text-stone-800 bg-white">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <span className="font-serif font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <Music className="w-4 h-4 text-rose-600" />
                <span>Romantic Soundtrack</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {isPlaying ? '● Playing' : '○ Paused'}
              </span>
            </div>

            {/* Current Track Info */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 space-y-1">
              <p className="text-xs font-bold text-stone-900 truncate">
                ♪ {currentTrack.name}
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Track Switcher Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={prevTrack}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Music'}</span>
              </button>

              <button
                type="button"
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Track List Selector */}
            <div className="space-y-1 pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                Choose Song:
              </span>
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[11px] truncate flex items-center justify-between transition-colors ${
                    trackIndex === idx && isPlaying
                      ? 'bg-rose-50 text-rose-900 font-bold border border-rose-300 shadow-xs'
                      : trackIndex === idx
                      ? 'bg-stone-100 text-stone-800 font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{t.name.split('(')[0]}</span>
                  {trackIndex === idx && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
              <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-rose-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Main Floating Audio Pill Button */}
        <button
          type="button"
          onClick={() => {
            if (!isPlaying) {
              togglePlay();
              setShowControls(true);
            } else {
              setShowControls(!showControls);
            }
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-md backdrop-blur-md border transition-all duration-300 ${
            isPlaying
              ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-glow-rose'
              : 'bg-white/95 border-stone-300 text-stone-700 hover:bg-white hover:border-stone-400'
          }`}
          title="Toggle Romantic Ambience Music"
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 h-3 bg-rose-600 rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-rose-700 rounded-full animate-bounce" />
                <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xs font-semibold">Music On ♫</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-semibold">Play Music ♫</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-rose-700 shadow-sm"
            title="Pause Music"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
