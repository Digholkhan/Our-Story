import React, { useState } from 'react';
import { Play, Heart, Camera, Film, Users, Sparkles, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Memory, CoupleProfile, SessionState, Album } from '../../types';
import { EditMemoryModal } from '../memory/EditMemoryModal';

interface WeddingDayShowcaseProps {
  profile: CoupleProfile;
  memories: Memory[];
  albums?: Album[];
  session?: SessionState;
  onOpenReplay: () => void;
  onSelectPhoto: (memory: Memory) => void;
  onSaveMemory?: (memory: Memory) => void;
  onDeleteMemory?: (id: string) => void;
}

export const WeddingDayShowcase: React.FC<WeddingDayShowcaseProps> = ({
  profile,
  memories,
  albums = [],
  session,
  onOpenReplay,
  onSelectPhoto,
  onSaveMemory,
  onDeleteMemory,
}) => {
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const weddingMemories = memories.filter(
    (m) =>
      m.tags.some((t) => t.toLowerCase().includes('wedding')) ||
      m.albumId === 'alb-1' ||
      m.title.toLowerCase().includes('wedding')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
      {/* Cinematic Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-14 border border-stone-200/80 text-center space-y-6 shadow-sm bg-white">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>The Most Sacred Chapter</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-7xl font-normal text-stone-900">
          “Our Wedding Day” 💍
        </h1>

        <p className="font-serif text-lg sm:text-2xl text-stone-600 max-w-2xl mx-auto italic font-light">
          “Two lives, two hearts, joined together in friendship and united forever in love.”
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-700 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>{profile.weddingDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>{profile.location}</span>
          </span>
        </div>

        <div className="pt-4">
          <button
            onClick={onOpenReplay}
            className="px-8 py-4 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm shadow-md inline-flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:scale-95 tracking-wide"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Replay Our Wedding Day (Slideshow)</span>
          </button>
        </div>
      </div>

      {/* Wedding Photo Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-normal text-stone-900">
            Wedding Day Portrait Gallery
          </h2>
          <span className="text-xs text-stone-400 font-mono">
            {weddingMemories.length} Photos Archived
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => onSelectPhoto(mem)}
              className="glass-card rounded-3xl overflow-hidden border border-stone-200/80 group cursor-pointer hover:shadow-romantic transition-all bg-white flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden relative bg-stone-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-[11px] text-stone-700">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 font-medium">
                      {mem.date}
                    </span>
                    {mem.isFavorite && (
                      <Heart className="w-4 h-4 text-rose-600 fill-current" />
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                    {mem.title}
                  </h3>
                  <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                    {mem.caption}
                  </p>
                </div>
              </div>

              {/* Edit & Remove controls for couple */}
              {session?.isLoggedIn && (
                <div className="px-6 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingMemory(mem);
                    }}
                    className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-stone-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteMemory && confirm(`Remove "${mem.title}"?`)) {
                        onDeleteMemory(mem.id);
                      }
                    }}
                    className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Memory Modal */}
      {editingMemory && onSaveMemory && (
        <EditMemoryModal
          memory={editingMemory}
          albums={albums}
          onClose={() => setEditingMemory(null)}
          onSaveMemory={(updated) => {
            onSaveMemory(updated);
            setEditingMemory(null);
          }}
        />
      )}
    </div>
  );
};
