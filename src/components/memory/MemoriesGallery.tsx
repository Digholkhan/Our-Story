import React, { useState } from 'react';
import { Search, Heart, Plus, Folder, MapPin, Calendar, Lock, Globe, Users, Filter, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { Album, Memory, SessionState } from '../../types';
import { Lightbox } from './Lightbox';
import { EditMemoryModal } from './EditMemoryModal';

interface MemoriesGalleryProps {
  albums: Album[];
  memories: Memory[];
  session: SessionState;
  onOpenAddMemory: () => void;
  onToggleFavorite: (id: string) => void;
  onDeleteMemory: (id: string) => void;
  onSaveMemory: (memory: Memory) => void;
  onCreateAlbum: (name: string, description?: string) => void;
  onDeleteAlbum: (id: string) => void;
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({
  albums,
  memories,
  session,
  onOpenAddMemory,
  onToggleFavorite,
  onDeleteMemory,
  onSaveMemory,
  onCreateAlbum,
  onDeleteAlbum,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'favorites'>('all');
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isCreatingAlbumModal, setIsCreatingAlbumModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  // Filter memories based on user session role & search & album
  const visibleMemories = memories.filter((m) => {
    // Role check: Guests only see PUBLIC
    if (!session.isLoggedIn && m.visibility !== 'PUBLIC') return false;

    if (activeTabFilter === 'favorites' && !m.isFavorite) return false;
    if (selectedAlbumId !== 'all' && m.albumId !== selectedAlbumId) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchCap = m.caption.toLowerCase().includes(q);
      const matchLoc = m.location.toLowerCase().includes(q);
      const matchTag = m.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCap || matchLoc || matchTag;
    }

    return true;
  });

  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    onCreateAlbum(newAlbumName.trim(), newAlbumDesc.trim());
    setNewAlbumName('');
    setNewAlbumDesc('');
    setIsCreatingAlbumModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Photo Archive 📷
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Our Memories
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
            A beautiful, expanding digital album of every laughter, trip, celebration, and quiet moment together.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session.isLoggedIn && (
            <>
              <button
                onClick={() => setIsCreatingAlbumModal(true)}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-300 flex items-center gap-2 transition-all shadow-xs"
              >
                <Folder className="w-4 h-4 text-amber-600" />
                <span>+ New Album</span>
              </button>

              <button
                onClick={onOpenAddMemory}
                className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Memory</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Album Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Albums</span>
          <span className="text-xs text-stone-400">{albums.length} Albums</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSelectedAlbumId('all')}
            className={`px-5 py-3 rounded-2xl border shrink-0 text-xs font-semibold transition-all flex items-center gap-2.5 ${
              selectedAlbumId === 'all'
                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <Folder className="w-4 h-4 text-rose-600" />
            <span>All Photos ({memories.length})</span>
          </button>

          {albums.map((alb) => {
            const count = memories.filter((m) => m.albumId === alb.id).length;
            return (
              <button
                key={alb.id}
                onClick={() => setSelectedAlbumId(alb.id)}
                className={`px-5 py-3 rounded-2xl border shrink-0 text-xs font-semibold transition-all flex items-center gap-2.5 ${
                  selectedAlbumId === alb.id
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <Folder className="w-4 h-4 text-stone-500" />
                <span>
                  {alb.name} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-stone-200/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by title, location, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTabFilter === 'all'
                ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTabFilter('favorites')}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              activeTabFilter === 'favorites'
                ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Masonry Photo Grid */}
      {visibleMemories.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto my-12 border border-stone-200/80">
          <Folder className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-stone-800">No Memories Found</h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            {searchQuery
              ? `No memories match "${searchQuery}".`
              : 'There are no memories in this category yet.'}
          </p>
          {session.isLoggedIn && (
            <button
              onClick={onOpenAddMemory}
              className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {visibleMemories.map((mem, idx) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemoryIndex(idx)}
              className="break-inside-avoid glass-card rounded-3xl overflow-hidden border border-stone-200/80 group cursor-pointer hover:shadow-romantic transition-all duration-300 bg-white"
            >
              {/* Photo Box */}
              <div className="relative overflow-hidden bg-stone-100">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-medium text-stone-700 border border-stone-200 flex items-center gap-1 shadow-xs">
                    {mem.visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-emerald-600" />}
                    {mem.visibility === 'COUPLE_ONLY' && <Users className="w-3 h-3 text-amber-600" />}
                    {mem.visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-rose-600" />}
                    <span>{mem.visibility.replace('_', ' ')}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(mem.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
                      mem.isFavorite
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/80 text-stone-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${mem.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="p-6 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-600" />
                    <span>{mem.date}</span>
                  </span>
                  {mem.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      <span>{mem.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                  {mem.title}
                </h3>

                <p className="text-stone-600 text-xs line-clamp-3 leading-relaxed">
                  {mem.caption}
                </p>

                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mem.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] text-stone-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit & Remove buttons for Couple */}
                {session.isLoggedIn && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMemory(mem);
                      }}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Edit this memory"
                    >
                      <Edit2 className="w-3 h-3 text-stone-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to remove "${mem.title}"?`)) {
                          onDeleteMemory(mem.id);
                        }
                      }}
                      className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove this memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal with explicit Back Button */}
      {selectedMemoryIndex !== null && visibleMemories[selectedMemoryIndex] && (
        <Lightbox
          memory={visibleMemories[selectedMemoryIndex]}
          allMemories={visibleMemories}
          onClose={() => setSelectedMemoryIndex(null)}
          onNavigate={(dir) => {
            if (dir === 'next') {
              setSelectedMemoryIndex((selectedMemoryIndex + 1) % visibleMemories.length);
            } else {
              setSelectedMemoryIndex(
                (selectedMemoryIndex - 1 + visibleMemories.length) % visibleMemories.length
              );
            }
          }}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDeleteMemory}
          canEdit={session.isLoggedIn}
        />
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
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

      {/* Create New Album Modal */}
      {isCreatingAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 shadow-xl bg-white">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Create New Album</h3>
            <form onSubmit={handleCreateAlbumSubmit} className="space-y-4 text-stone-800">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Album Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honeymoon, Road Trip"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm outline-none text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Memories from our first island getaway"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm outline-none text-stone-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingAlbumModal(false)}
                  className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
