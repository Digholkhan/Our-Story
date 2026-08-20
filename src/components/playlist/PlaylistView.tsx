import React, { useState } from 'react';
import { Music, Plus, Trash2, ExternalLink } from 'lucide-react';
import { SongItem, SessionState } from '../../types';

interface PlaylistViewProps {
  songs: SongItem[];
  session: SessionState;
  onSaveSong: (song: SongItem) => void;
  onDeleteSong: (id: string) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  songs,
  session,
  onSaveSong,
  onDeleteSong,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState<SongItem['category']>('Songs We Love');
  const [linkUrl, setLinkUrl] = useState('');

  const categories: SongItem['category'][] = ['Our Song', 'Wedding Songs', 'Travel Songs', 'Songs We Love', 'Memories'];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredSongs = activeCategory === 'All' ? songs : songs.filter((s) => s.category === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSong: SongItem = {
      id: `sg-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      category,
      linkUrl: linkUrl.trim() || undefined,
      albumCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    };

    onSaveSong(newSong);
    setTitle('');
    setArtist('');
    setLinkUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">Couple Soundtrack 🎵</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">Our Songs</h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            The songs that define our relationship — from our first dance to road trip playlists.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Song</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
            activeCategory === 'All' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >All</button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === c ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >{c}</button>
        ))}
      </div>

      {/* Songs List */}
      <div className="space-y-4">
        {filteredSongs.map((song) => (
          <div key={song.id} className="bg-white p-5 rounded-3xl border border-stone-200/80 flex items-center gap-4 group hover:border-rose-300 shadow-xs transition-all">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
              <img src={song.albumCover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80'} alt={song.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-bold text-stone-900 truncate">{song.title}</h3>
              <p className="text-xs text-stone-500">{song.artist}</p>
            </div>

            <span className="hidden sm:block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-semibold shrink-0">
              {song.category}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {song.linkUrl && (
                <a
                  href={song.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-rose-700 transition-colors"
                  title="Listen"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {session.isLoggedIn && (
                <button
                  onClick={() => { if (confirm('Remove song?')) onDeleteSong(song.id); }}
                  className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add Song 🎵</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Song Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Perfect" className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Artist</label>
                <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Ed Sheeran" className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as SongItem['category'])} className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Spotify / YouTube Link</label>
                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs">Save Song</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
