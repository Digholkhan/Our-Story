import React, { useState } from 'react';
import { Gift, Lock, Unlock, Plus, Sparkles, Calendar, Heart, X, Send } from 'lucide-react';
import { Surprise, SessionState, CoupleProfile } from '../../types';

interface SurprisesViewProps {
  surprises: Surprise[];
  session: SessionState;
  profile: CoupleProfile;
  onSaveSurprise: (surprise: Surprise) => void;
}

export const SurprisesView: React.FC<SurprisesViewProps> = ({
  surprises,
  session,
  profile,
  onSaveSurprise,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedId, setRevealedId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [surpriseType, setSurpriseType] = useState<Surprise['surpriseType']>('love_message');
  const [unlockDate, setUnlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');

  const myReceivedSurprises = surprises.filter((s) => s.recipient === session.activePartner);
  const mySentSurprises = surprises.filter((s) => s.sender === session.activePartner);

  const isUnlocked = (s: Surprise) => {
    const now = new Date().getTime();
    const unlock = new Date(s.unlockDate).getTime();
    return now >= unlock;
  };

  const handleOpen = (s: Surprise) => {
    if (!isUnlocked(s)) return;
    if (!s.isOpened) {
      onSaveSurprise({ ...s, isOpened: true });
    }
    setRevealedId(s.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const recipient = session.activePartner === 'partner1' ? 'partner2' : 'partner1';

    const newSurprise: Surprise = {
      id: `sur-${Date.now()}`,
      sender: session.activePartner,
      recipient,
      title: title.trim(),
      surpriseType,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      unlockDate,
      isOpened: false,
    };

    onSaveSurprise(newSurprise);
    setTitle('');
    setContent('');
    setImageUrl('');
    setIsModalOpen(false);
  };

  const revealedSurprise = surprises.find((s) => s.id === revealedId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">Secret Gifts</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">Surprise Box 🎁</h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            Secret love messages, surprises, and little gifts between partners. Some are locked until a special date.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Surprise</span>
          </button>
        )}
      </div>

      {/* Received Surprises */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Your Surprises ({myReceivedSurprises.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myReceivedSurprises.map((s) => {
            const unlocked = isUnlocked(s);
            return (
              <div
                key={s.id}
                onClick={() => handleOpen(s)}
                className={`bg-white p-7 rounded-3xl border space-y-3.5 transition-all shadow-xs ${
                  unlocked
                    ? 'border-amber-300 cursor-pointer hover:shadow-md hover:border-amber-400'
                    : 'border-stone-200 cursor-not-allowed bg-stone-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-amber-50 border border-amber-200">
                    <Gift className={`w-6 h-6 ${unlocked ? 'text-amber-700' : 'text-stone-400'}`} />
                  </div>
                  {unlocked ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> Ready to Open!
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Opens {s.unlockDate}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {unlocked ? s.title : 'You Have A Surprise 🎁'}
                </h3>

                {!unlocked && (
                  <p className="text-stone-500 text-xs italic">
                    "Open this on {s.unlockDate} ❤️" — from {s.sender === 'partner1' ? profile.partner1Name : profile.partner2Name}
                  </p>
                )}

                {unlocked && !s.isOpened && (
                  <p className="text-rose-700 text-xs font-semibold animate-pulse">
                    ✨ Tap to Unwrap Your Surprise!
                  </p>
                )}

                {unlocked && s.isOpened && (
                  <p className="text-stone-500 text-xs">
                    ✓ Opened — Tap to view again
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sent Surprises */}
      {mySentSurprises.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200/80">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Surprises You Sent ({mySentSurprises.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySentSurprises.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-3">
                <Gift className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-stone-900 truncate block">{s.title}</span>
                  <span className="text-xs text-stone-500">Opens {s.unlockDate} • {s.isOpened ? '✓ Opened' : '🔒 Sealed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {revealedSurprise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-lg w-full border border-stone-200/90 space-y-6 text-center animate-scaleIn bg-white text-stone-800 shadow-2xl relative">
            <button onClick={() => setRevealedId(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400">
              <X className="w-6 h-6" />
            </button>

            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-spin" />
            <h2 className="font-serif text-3xl font-bold text-stone-900">{revealedSurprise.title}</h2>
            <span className="text-xs text-rose-800 font-semibold block">
              From {revealedSurprise.sender === 'partner1' ? profile.partner1Name : profile.partner2Name}
            </span>

            {revealedSurprise.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-60 border border-stone-200">
                <img src={revealedSurprise.imageUrl} alt="Surprise" className="w-full h-full object-cover" />
              </div>
            )}

            <p className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed italic whitespace-pre-wrap p-4 bg-stone-50 rounded-2xl border border-stone-200">
              "{revealedSurprise.content}"
            </p>

            <Heart className="w-8 h-8 text-rose-600 fill-current mx-auto animate-bounce" />

            <button
              onClick={() => setRevealedId(null)}
              className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold shadow-xs"
            >
              Close ❤️
            </button>
          </div>
        </div>
      )}

      {/* Create Surprise Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Create Surprise 🎁</h3>
            <p className="text-xs text-stone-500">
              Send to: <span className="text-rose-800 font-semibold">
                {session.activePartner === 'partner1' ? profile.partner2Name : profile.partner1Name}
              </span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. A Little Secret Date 🌹" className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Message / Content *</label>
                <textarea rows={4} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your secret surprise message..." className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none resize-none text-stone-800 focus:border-rose-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Type</label>
                  <select value={surpriseType} onChange={(e) => setSurpriseType(e.target.value as Surprise['surpriseType'])} className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400">
                    <option value="love_message">💌 Love Message</option>
                    <option value="photo">📸 Photo</option>
                    <option value="letter">✉️ Letter</option>
                    <option value="date_invitation">🌹 Date Invitation</option>
                    <option value="memory">📷 Memory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Unlock Date</label>
                  <input type="date" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Photo URL (Optional)</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Surprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
