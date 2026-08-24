import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Heart, Calendar, MapPin, Trash2, Lock, Globe, Users, ArrowLeft } from 'lucide-react';
import { Memory } from '../../types';

interface LightboxProps {
  memory: Memory;
  allMemories: Memory[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  memory,
  allMemories,
  onClose,
  onNavigate,
  onToggleFavorite,
  onDelete,
  canEdit,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === 'ArrowLeft') onNavigate('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  const currentIndex = allMemories.findIndex((m) => m.id === memory.id);
  const total = allMemories.length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 pt-24 sm:p-6 sm:pt-24 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Header Bar with explicit BACK button */}
      <div className="flex items-center justify-between z-20 text-white max-w-6xl mx-auto w-full">
        {/* Left: Back to Gallery button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-md active:scale-95"
          title="Back to Memories Gallery"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Gallery</span>
        </button>

        {/* Center count & badge */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium opacity-80">
            {currentIndex + 1} of {total}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] flex items-center gap-1">
            {memory.visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-emerald-400" />}
            {memory.visibility === 'COUPLE_ONLY' && <Users className="w-3 h-3 text-amber-300" />}
            {memory.visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-rose-300" />}
            <span>{memory.visibility.replace('_', ' ')}</span>
          </span>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(memory.id)}
            className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all ${
              memory.isFavorite ? 'text-rose-400' : 'text-stone-300'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 ${memory.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {canEdit && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this memory photo?')) {
                  onDelete(memory.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-all"
              title="Delete Photo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/15 hover:bg-rose-600 text-white transition-all ml-1"
            title="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Slider Display */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('prev');
          }}
          className="absolute left-2 sm:left-6 z-30 p-3.5 rounded-full bg-black/60 hover:bg-rose-700 text-white transition-all backdrop-blur-md active:scale-95 shadow-lg"
          title="Previous Photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={memory.imageUrl}
          alt={memory.title}
          className="max-h-[72vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-300 select-none border border-white/10"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
          }}
          className="absolute right-2 sm:right-6 z-30 p-3.5 rounded-full bg-black/60 hover:bg-rose-700 text-white transition-all backdrop-blur-md active:scale-95 shadow-lg"
          title="Next Photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Information Card */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl max-w-3xl mx-auto w-full text-stone-800 space-y-2 border border-stone-200/80 shadow-2xl z-20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
            {memory.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>{memory.date}</span>
            </span>
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>{memory.location}</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed">
          {memory.caption}
        </p>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[11px] text-stone-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
