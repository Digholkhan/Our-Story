import {
  Globe,
  Image as ImageIcon,
  Lock,
  Plus,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Album, Memory, VisibilityLevel } from "../../types";

interface AddMemoryModalProps {
  albums: Album[];
  onClose: () => void;
  onSaveMemory: (memory: Memory, imageFile?: File) => void;
  onCreateAlbum: (name: string) => Album;
  activePartner: string;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  albums,
  onClose,
  onSaveMemory,
  onCreateAlbum,
  activePartner,
}) => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id || "");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityLevel>("PUBLIC");
  const [tagsInput, setTagsInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImagePreview(result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!imageUrl && !imagePreview)) {
      alert("Please provide a title and photo!");
      return;
    }

    let finalAlbumId = selectedAlbumId;
    if (isCreatingAlbum && newAlbumName.trim()) {
      const newAlb = onCreateAlbum(newAlbumName.trim());
      finalAlbumId = newAlb.id;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      title,
      caption,
      imageUrl: imagePreview || imageUrl,
      date,
      location,
      albumId: finalAlbumId,
      tags,
      isFavorite,
      visibility,
      author: activePartner,
      createdAt: new Date().toISOString(),
    };

    onSaveMemory(newMem, imageFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-gold rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 relative animate-scaleIn border border-amber-500/30">
        <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-rose-600/20 text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold gold-gradient-text">
                Add New Memory 📸
              </h2>
              <p className="text-stone-300/70 text-xs">
                Preserve another special moment in your love story
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-stone-200">
          {/* Photo Upload Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300">
              Upload Photo / Image URL *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* File Drag/Drop Box */}
              <label className="border-2 border-dashed border-rose-500/30 hover:border-amber-400/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 transition-all text-center h-36">
                <Upload className="w-8 h-8 text-rose-400 mb-2" />
                <span className="text-xs font-semibold text-stone-200">
                  Click to upload from Device
                </span>
                <span className="text-[10px] text-stone-400 mt-1">
                  PNG, JPG, WEBP accepted
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Preview or URL Input */}
              {imagePreview ? (
                <div className="relative h-36 rounded-2xl overflow-hidden border border-amber-500/30 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl("");
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs text-stone-400">
                    Or paste an Image URL:
                  </span>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-xs text-stone-100 placeholder-stone-500 outline-none"
                    />
                    <ImageIcon className="absolute right-3 top-3 w-4 h-4 text-stone-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Our First Sunset as Husband & Wife"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 placeholder-stone-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 outline-none"
              />
            </div>
          </div>

          {/* Location & Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Cox's Bazar, Paris, Home"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 placeholder-stone-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Select Album
              </label>
              {!isCreatingAlbum ? (
                <div className="flex gap-2">
                  <select
                    value={selectedAlbumId}
                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 outline-none"
                  >
                    {albums.map((alb) => (
                      <option
                        key={alb.id}
                        value={alb.id}
                        className="bg-burgundy-950 text-white"
                      >
                        {alb.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingAlbum(true)}
                    className="p-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-500/30 flex items-center shrink-0"
                    title="New Album"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New album name..."
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500 text-sm text-stone-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingAlbum(false)}
                    className="px-3 py-2.5 rounded-xl bg-white/10 text-stone-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
              Story / Caption
            </label>
            <textarea
              rows={3}
              placeholder="Describe what made this moment special..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 placeholder-stone-500 outline-none resize-none"
            />
          </div>

          {/* Privacy & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Privacy Visibility
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("PUBLIC")}
                  className={`py-2 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === "PUBLIC"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                      : "bg-black/40 border-white/10 text-stone-400"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("COUPLE_ONLY")}
                  className={`py-2 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === "COUPLE_ONLY"
                      ? "bg-amber-950/80 border-amber-500 text-amber-300"
                      : "bg-black/40 border-white/10 text-stone-400"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Couple</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("PRIVATE")}
                  className={`py-2 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                    visibility === "PRIVATE"
                      ? "bg-rose-950/80 border-rose-500 text-rose-300"
                      : "bg-black/40 border-white/10 text-stone-400"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding, Sunset, Sunset walk"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-rose-500 text-sm text-stone-100 placeholder-stone-500 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-rose-300">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 bg-black/40 border-white/20"
              />
              <span>Mark as Favorite Memory ❤️</span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold shadow-glow-rose active:scale-95 transition-all"
              >
                Save Memory
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
