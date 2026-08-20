import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Globe, Users, Lock, Sparkles, Save } from 'lucide-react';
import { Album, Memory, VisibilityLevel } from '../../types';

interface EditMemoryModalProps {
  memory: Memory;
  albums: Album[];
  onClose: () => void;
  onSaveMemory: (memory: Memory) => void;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  memory,
  albums,
  onClose,
  onSaveMemory,
}) => {
  const [title, setTitle] = useState(memory.title);
  const [caption, setCaption] = useState(memory.caption);
  const [imageUrl, setImageUrl] = useState(memory.imageUrl);
  const [date, setDate] = useState(memory.date);
  const [location, setLocation] = useState(memory.location);
  const [selectedAlbumId, setSelectedAlbumId] = useState(memory.albumId);
  const [visibility, setVisibility] = useState<VisibilityLevel>(memory.visibility);
  const [tagsInput, setTagsInput] = useState(memory.tags.join(', '));
  const [isFavorite, setIsFavorite] = useState(memory.isFavorite);
  const [imagePreview, setImagePreview] = useState<string | null>(memory.imageUrl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!imageUrl && !imagePreview)) {
      alert('Please provide a title and photo!');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedMem: Memory = {
      ...memory,
      title,
      caption,
      imageUrl: imagePreview || imageUrl,
      date,
      location,
      albumId: selectedAlbumId,
      tags,
      isFavorite,
      visibility,
    };

    onSaveMemory(updatedMem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 relative animate-scaleIn border border-stone-200/90 shadow-2xl bg-white text-stone-800">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-rose-50 text-rose-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">Edit Memory 📸</h2>
              <p className="text-stone-500 text-xs">Update your memory details, photo, and caption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-stone-800">
          {/* Photo Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Photo / Image URL *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* File Upload Button */}
              <label className="border-2 border-dashed border-stone-300 hover:border-rose-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition-all text-center h-36">
                <Upload className="w-8 h-8 text-rose-600 mb-2" />
                <span className="text-xs font-semibold text-stone-700">Change Photo from Device</span>
                <span className="text-[10px] text-stone-400 mt-1">PNG, JPG, WEBP</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Preview */}
              {imagePreview && (
                <div className="relative h-36 rounded-2xl overflow-hidden border border-stone-200 group bg-stone-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="relative mt-2">
              <input
                type="url"
                placeholder="Or paste image URL: https://..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-xs text-stone-800 placeholder-stone-400 outline-none"
              />
              <ImageIcon className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none"
              />
            </div>
          </div>

          {/* Location & Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Album
              </label>
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none"
              >
                {albums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Story / Caption
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none resize-none font-sans"
            />
          </div>

          {/* Privacy & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Privacy Visibility
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`py-2 px-2 rounded-2xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === 'PUBLIC'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('COUPLE_ONLY')}
                  className={`py-2 px-2 rounded-2xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === 'COUPLE_ONLY'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Couple</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('PRIVATE')}
                  className={`py-2 px-2 rounded-2xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === 'PRIVATE'
                      ? 'bg-rose-50 border-rose-500 text-rose-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding, Sunset, Walk"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-400 text-sm text-stone-800 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-800 font-medium">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 bg-white border-stone-300"
              />
              <span>Mark as Favorite Memory ❤️</span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
