import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Music, Play, Pause, SkipForward, SkipBack, Check } from 'lucide-react';

// ─── Track Definitions ────────────────────────────────────────────────────────
// Each track has a sequence of { note frequencies } played in order, with
// distinct timbre settings so each track sounds clearly different.
interface TrackDef {
  id: string;
  name: string;
  label: string; // Short display name
  // Sequence of chords: each chord is an array of Hz values played simultaneously
  sequence: number[][];
  // ms per chord step
  stepMs: number;
  // Oscillator type for harmonics
  oscType: OscillatorType;
  // Extra octave-down bass note on root?
  hasBass: boolean;
}

const TRACKS: TrackDef[] = [
  {
    id: 't1',
    name: 'Canon in D — Gentle Piano',
    label: '🎹 Canon in D',
    sequence: [
      [293.66, 369.99, 440.00],  // D
      [220.00, 277.18, 329.63],  // A
      [246.94, 293.66, 369.99],  // Bm
      [185.00, 220.00, 277.18],  // F#m
      [196.00, 246.94, 293.66],  // G
      [146.83, 196.00, 246.94],  // D/F#
      [196.00, 246.94, 293.66],  // G
      [220.00, 277.18, 329.63],  // A
    ],
    stepMs: 2800,
    oscType: 'triangle',
    hasBass: true,
  },
  {
    id: 't2',
    name: 'A Thousand Years — Strings',
    label: '🎻 A Thousand Years',
    sequence: [
      [261.63, 329.63, 392.00],  // C
      [220.00, 261.63, 329.63],  // Am
      [174.61, 220.00, 261.63],  // F
      [196.00, 246.94, 293.66],  // G
      [261.63, 329.63, 392.00],  // C
      [220.00, 261.63, 329.63],  // Am
      [174.61, 220.00, 261.63],  // F
      [246.94, 293.66, 369.99],  // Bm
    ],
    stepMs: 3200,
    oscType: 'sine',
    hasBass: true,
  },
  {
    id: 't3',
    name: 'Golden Sunset Waltz — Ethereal',
    label: '🌙 Golden Sunset Waltz',
    sequence: [
      [329.63, 415.30, 493.88],  // Em
      [293.66, 369.99, 440.00],  // D
      [246.94, 311.13, 369.99],  // B7
      [220.00, 277.18, 329.63],  // Am
      [196.00, 246.94, 293.66],  // G
      [174.61, 220.00, 261.63],  // F
      [196.00, 246.94, 293.66],  // G
      [220.00, 293.66, 329.63],  // Am/C
    ],
    stepMs: 3000,
    oscType: 'sine',
    hasBass: false,
  },
  {
    id: 't4',
    name: 'Forever & Always — Lofi',
    label: '✨ Forever & Always',
    sequence: [
      [174.61, 220.00, 261.63],  // Fm
      [196.00, 246.94, 293.66],  // Gm
      [220.00, 261.63, 329.63],  // Am
      [261.63, 329.63, 392.00],  // C
      [174.61, 220.00, 261.63],  // Fm
      [155.56, 196.00, 246.94],  // Eb
      [174.61, 220.00, 261.63],  // Fm
      [130.81, 164.81, 196.00],  // C/E (low)
    ],
    stepMs: 3600,
    oscType: 'triangle',
    hasBass: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const AmbientAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.45);
  const [showPanel, setShowPanel] = useState(false);

  // Refs that survive re-renders without causing them
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const schedulerTimerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const isPlayingRef = useRef(false);
  const trackIdxRef = useRef(trackIdx);
  const volumeRef = useRef(volume);

  // Keep refs in sync
  useEffect(() => { trackIdxRef.current = trackIdx; }, [trackIdx]);
  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume * 0.12, ctxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  // ── Get or create AudioContext + master gain ──────────────────────────────
  const ensureCtx = useCallback((): AudioContext | null => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new AC();
        // Master gain node
        const mg = ctxRef.current.createGain();
        mg.gain.value = volumeRef.current * 0.12;
        mg.connect(ctxRef.current.destination);
        masterGainRef.current = mg;
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  // ── Play a single chord at a specific AudioContext time ───────────────────
  const scheduleChord = useCallback((ctx: AudioContext, master: GainNode, track: TrackDef, step: number) => {
    const chord = track.sequence[step % track.sequence.length];
    const now = ctx.currentTime;
    const dur = (track.stepMs / 1000) * 0.85; // slightly shorter than step for breathing room

    // Optional bass note (root an octave down)
    const notes = track.hasBass ? [chord[0] / 2, ...chord] : chord;

    notes.forEach((freq, i) => {
      const isBass = track.hasBass && i === 0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isBass ? 'sine' : track.oscType;
      osc.frequency.value = freq;

      // Soft attack, long sustain, soft release
      const peakVol = isBass ? 0.35 : (i === 0 ? 0.7 : 0.4);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + 0.4);
      gain.gain.setValueAtTime(peakVol, now + dur - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + dur + 0.05);
    });
  }, []);

  // ── Stop the scheduling loop ──────────────────────────────────────────────
  const stopScheduler = useCallback(() => {
    if (schedulerTimerRef.current !== null) {
      clearTimeout(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
  }, []);

  // ── Recursive scheduling loop (more accurate than setInterval) ────────────
  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;

    const ctx = ensureCtx();
    if (!ctx || !masterGainRef.current) return;

    const track = TRACKS[trackIdxRef.current];
    scheduleChord(ctx, masterGainRef.current, track, stepRef.current);
    stepRef.current++;

    // Schedule next step
    schedulerTimerRef.current = window.setTimeout(runScheduler, track.stepMs);
  }, [ensureCtx, scheduleChord]);

  // ── Start playing a specific track ───────────────────────────────────────
  const startTrack = useCallback((idx: number) => {
    stopScheduler();
    stepRef.current = 0;
    trackIdxRef.current = idx;
    isPlayingRef.current = true;

    const ctx = ensureCtx();
    if (!ctx) return;

    // Small delay to let AudioContext warm up
    schedulerTimerRef.current = window.setTimeout(runScheduler, 50);
  }, [stopScheduler, ensureCtx, runScheduler]);

  // ── Toggle play/pause ─────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopScheduler();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      startTrack(trackIdxRef.current);
      setIsPlaying(true);
    }
  }, [stopScheduler, startTrack]);

  // ── Select a track from the list ─────────────────────────────────────────
  const selectTrack = useCallback((idx: number) => {
    setTrackIdx(idx);
    startTrack(idx);
    setIsPlaying(true);
  }, [startTrack]);

  const nextTrack = useCallback(() => {
    const next = (trackIdxRef.current + 1) % TRACKS.length;
    selectTrack(next);
  }, [selectTrack]);

  const prevTrack = useCallback(() => {
    const prev = (trackIdxRef.current - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prev);
  }, [selectTrack]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopScheduler();
      isPlayingRef.current = false;
      ctxRef.current?.close().catch(() => {});
    };
  }, [stopScheduler]);

  const currentTrack = TRACKS[trackIdx];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-2">

      {/* ── Expanded Control Panel ───────────────────────────────────────── */}
      {showPanel && (
        <div
          className="w-72 bg-white rounded-3xl border border-stone-200 shadow-2xl p-5 space-y-4 text-stone-800 animate-scaleIn mb-1"
          style={{ transformOrigin: 'bottom right' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="font-serif font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <Music className="w-4 h-4 text-rose-600" />
              Romantic Soundtrack
            </span>
            <span className={`text-[10px] font-mono font-semibold ${isPlaying ? 'text-rose-600' : 'text-stone-400'}`}>
              {isPlaying ? '● Playing' : '○ Paused'}
            </span>
          </div>

          {/* Now Playing */}
          <div className="bg-rose-50 border border-rose-200/70 rounded-2xl p-3 space-y-0.5">
            <p className="text-[11px] text-rose-800 font-semibold uppercase tracking-wider">Now Playing</p>
            <p className="text-xs font-bold text-stone-900 truncate">{currentTrack.name}</p>
          </div>

          {/* Play Controls */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              {isPlaying
                ? <><Pause className="w-3.5 h-3.5" /> Pause</>
                : <><Play className="w-3.5 h-3.5 fill-current" /> Play</>
              }
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-1 border-t border-stone-100 pt-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1.5">Choose Track</p>
            {TRACKS.map((t, idx) => {
              const active = trackIdx === idx;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTrack(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                    active
                      ? 'bg-rose-50 border border-rose-300 text-rose-900 font-bold shadow-sm'
                      : 'hover:bg-stone-50 text-stone-600 border border-transparent'
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  {active && isPlaying && (
                    <span className="flex items-center gap-0.5 shrink-0">
                      <span className="w-0.5 h-2.5 bg-rose-600 rounded-full animate-bounce" />
                      <span className="w-0.5 h-3.5 bg-rose-500 rounded-full animate-pulse" />
                      <span className="w-0.5 h-2 bg-rose-600 rounded-full animate-bounce" />
                    </span>
                  )}
                  {active && !isPlaying && <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2.5 border-t border-stone-100 pt-3">
            <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer h-1.5"
            />
          </div>
        </div>
      )}

      {/* ── Floating Pill Button ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => {
          if (!isPlaying && !showPanel) {
            // First tap: start music + show panel
            startTrack(trackIdxRef.current);
            setIsPlaying(true);
            setShowPanel(true);
          } else {
            setShowPanel((prev) => !prev);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border transition-all duration-300 ${
          isPlaying
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
        }`}
        title="Romantic Ambient Music"
      >
        {isPlaying ? (
          <>
            <span className="flex items-center gap-0.5 h-4">
              <span className="w-1 h-2.5 bg-rose-600 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-rose-700 rounded-full animate-bounce" />
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" />
            </span>
            <span className="text-xs font-semibold">Music On ♫</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-semibold">Play Music ♫</span>
          </>
        )}
      </button>

      {/* Quick stop button when playing */}
      {isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="p-2.5 rounded-full bg-white border border-stone-200 shadow text-stone-600 hover:text-rose-700 transition-colors"
          title="Pause Music"
        >
          <Pause className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
