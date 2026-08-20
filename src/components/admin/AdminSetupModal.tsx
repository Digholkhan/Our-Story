import React, { useState } from 'react';
import { X, Shield, RotateCcw, Save, Upload, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { CoupleProfile } from '../../types';
import { processImageFile } from '../../lib/imageUtils';

interface AdminSetupModalProps {
  profile: CoupleProfile;
  onClose: () => void;
  onSaveProfile: (profile: CoupleProfile) => void;
  onResetData: () => void;
}

export const AdminSetupModal: React.FC<AdminSetupModalProps> = ({
  profile,
  onClose,
  onSaveProfile,
  onResetData,
}) => {
  const [p1Name, setP1Name] = useState(profile.partner1Name);
  const [p2Name, setP2Name] = useState(profile.partner2Name);
  const [weddingDate, setWeddingDate] = useState(profile.weddingDate);
  const [relationshipDate, setRelationshipDate] = useState(profile.relationshipStartDate);
  const [heroTagline, setHeroTagline] = useState(profile.heroTagline);
  const [heroQuote, setHeroQuote] = useState(profile.heroQuote);
  const [heroImage, setHeroImage] = useState(profile.heroImage);
  const [coverImage, setCoverImage] = useState(profile.coverImage);
  const [location, setLocation] = useState(profile.location);
  const [p1Avatar, setP1Avatar] = useState(profile.partner1Avatar);
  const [p2Avatar, setP2Avatar] = useState(profile.partner2Avatar);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    maxWidth = 1200
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const base64 = await processImageFile(file, maxWidth);
      setter(base64);
    } catch (err) {
      console.error('File upload error:', err);
      alert('Could not process this image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      partner1Name: p1Name.trim() || 'Farjana Akter',
      partner2Name: p2Name.trim() || 'Md Nasif Kamran',
      partner1Avatar: p1Avatar.trim(),
      partner2Avatar: p2Avatar.trim(),
      weddingDate,
      relationshipStartDate: relationshipDate,
      heroTagline: heroTagline.trim(),
      heroQuote: heroQuote.trim(),
      heroImage: heroImage.trim(),
      coverImage: coverImage.trim(),
      location: location.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-stone-200/90 space-y-6 my-8 animate-scaleIn shadow-2xl bg-white text-stone-800">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Wedding Gift Setup ⚙️
              </h3>
              <p className="text-xs text-stone-500">
                Configure couple names, photos, and dates before giving the website as a gift.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 text-stone-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-stone-800">
          {/* Partner Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Partner 1 Name *
              </label>
              <input
                type="text"
                required
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Partner 2 Name *
              </label>
              <input
                type="text"
                required
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Wedding Date *
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
                Relationship Start Date
              </label>
              <input
                type="date"
                value={relationshipDate}
                onChange={(e) => setRelationshipDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
              Wedding Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
            />
          </div>

          {/* Tagline & Quote */}
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
              Hero Tagline
            </label>
            <input
              type="text"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">
              Romantic Quote
            </label>
            <textarea
              rows={2}
              value={heroQuote}
              onChange={(e) => setHeroQuote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none focus:border-rose-400 resize-none text-stone-800"
            />
          </div>

          {/* 1. HERO BACKGROUND IMAGE (FILE UPLOAD + URL) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-stone-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-600" />
                <span>Hero Background Image</span>
              </label>
              <span className="text-[10px] text-stone-400">Mobile / PC Upload</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-1/2 border-2 border-dashed border-stone-300 hover:border-rose-400 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-stone-50 transition-all text-center h-28 shrink-0">
                <Upload className="w-6 h-6 text-rose-600 mb-1" />
                <span className="text-xs font-semibold text-stone-700">Choose Hero Photo</span>
                <span className="text-[10px] text-stone-400">From Phone / Laptop</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setHeroImage, 1600)}
                  className="hidden"
                />
              </label>

              {heroImage && (
                <div className="w-full sm:w-1/2 h-28 rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-100">
                  <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">
                    Hero Preview
                  </span>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Or paste Hero Image URL..."
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs outline-none text-stone-800"
            />
          </div>

          {/* 2. PARTNER AVATARS (FILE UPLOADS + URLS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Partner 1 Avatar */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <label className="text-xs font-bold uppercase text-stone-700 block">
                {p1Name || 'Partner 1'} Avatar
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-300 bg-white shrink-0">
                  <img src={p1Avatar} alt="P1" className="w-full h-full object-cover" />
                </div>
                <label className="flex-1 border border-stone-300 hover:border-rose-400 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer bg-white text-xs font-semibold text-stone-700 transition-colors">
                  <Upload className="w-4 h-4 text-rose-600" />
                  <span>Upload Avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setP1Avatar, 400)}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Or paste Avatar URL..."
                value={p1Avatar}
                onChange={(e) => setP1Avatar(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs outline-none text-stone-800"
              />
            </div>

            {/* Partner 2 Avatar */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <label className="text-xs font-bold uppercase text-stone-700 block">
                {p2Name || 'Partner 2'} Avatar
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-300 bg-white shrink-0">
                  <img src={p2Avatar} alt="P2" className="w-full h-full object-cover" />
                </div>
                <label className="flex-1 border border-stone-300 hover:border-rose-400 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer bg-white text-xs font-semibold text-stone-700 transition-colors">
                  <Upload className="w-4 h-4 text-rose-600" />
                  <span>Upload Avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setP2Avatar, 400)}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Or paste Avatar URL..."
                value={p2Avatar}
                onChange={(e) => setP2Avatar(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs outline-none text-stone-800"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                if (confirm('This will reset all couple memories and setup back to default. Are you sure?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-2 transition-all border border-stone-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sample Data</span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isProcessing ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
