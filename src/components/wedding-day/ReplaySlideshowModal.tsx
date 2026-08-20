import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Heart, ArrowLeft } from 'lucide-react';
import { Memory } from '../../types';

interface ReplaySlideshowModalProps {
  weddingMemories: Memory[];
  onClose: () => void;
}

export const ReplaySlideshowModal: React.FC<ReplaySlideshowModalProps> = ({
  weddingMemories,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const currentMem = weddingMemories[currentIndex] || weddingMemories[0];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % weddingMemories.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, weddingMemories.length]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between z-20 text-white max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Website</span>
          </button>

          <div className="hidden sm:block pl-2">
            <h3 className="font-serif text-lg font-bold text-white">
              Replay Our Wedding Day 💍
            </h3>
            <p className="text-[11px] text-stone-300">
              Slide {currentIndex + 1} of {weddingMemories.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-all ml-2"
            title="Close Slideshow (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Slideshow Display */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((currentIndex - 1 + weddingMemories.length) % weddingMemories.length);
          }}
          className="absolute left-2 sm:left-6 z-30 p-3.5 rounded-full bg-black/60 hover:bg-rose-700 text-white transition-all backdrop-blur-md shadow-lg"
          title="Previous Photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {currentMem && (
          <div className="relative max-h-[72vh] max-w-5xl w-full h-full flex items-center justify-center">
            <img
              key={currentMem.id}
              src={currentMem.imageUrl}
              alt={currentMem.title}
              className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-700 animate-fadeIn border border-white/10"
            />
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((currentIndex + 1) % weddingMemories.length);
          }}
          className="absolute right-2 sm:right-6 z-30 p-3.5 rounded-full bg-black/60 hover:bg-rose-700 text-white transition-all backdrop-blur-md shadow-lg"
          title="Next Photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Info Banner */}
      {currentMem && (
        <div className="glass-panel p-4 sm:p-6 rounded-3xl max-w-3xl mx-auto w-full text-center space-y-2 border border-stone-200/80 shadow-2xl z-20 text-stone-800">
          <h4 className="font-serif text-2xl font-bold text-stone-900">
            {currentMem.title}
          </h4>
          <p className="text-stone-600 text-xs sm:text-sm italic font-serif leading-relaxed">
            "{currentMem.caption}"
          </p>
          <div className="text-[11px] text-stone-500 pt-1">
            <span>{currentMem.date}</span>
            <span className="mx-2 opacity-40">•</span>
            <span>{currentMem.location}</span>
          </div>
        </div>
      )}
    </div>
  );
};
