import React, { useState } from 'react';
import { X, Lock, Heart, Send, Calendar, Image as ImageIcon } from 'lucide-react';
import { LoveLetter, SessionState, VisibilityLevel } from '../../types';

interface WriteLetterModalProps {
  session: SessionState;
  onClose: () => void;
  onSaveLetter: (letter: LoveLetter) => void;
}

export const WriteLetterModal: React.FC<WriteLetterModalProps> = ({
  session,
  onClose,
  onSaveLetter,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState<'partner1' | 'partner2' | 'both'>('both');
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [unlockDate, setUnlockDate] = useState('2027-08-19');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newLetter: LoveLetter = {
      id: `let-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      sender: session.activePartner,
      recipient,
      date: new Date().toISOString().split('T')[0],
      unlockDate: isTimeLocked ? unlockDate : undefined,
      imageUrl: imageUrl.trim() || undefined,
      isDraft: false,
      visibility: 'COUPLE_ONLY'
    };

    onSaveLetter(newLetter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-amber-500/30 space-y-6 my-8 animate-scaleIn">
        <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <div>
              <h3 className="font-serif text-2xl font-bold gold-gradient-text">
                Write a Love Letter 💌
              </h3>
              <p className="text-xs text-stone-300">
                A private, romantic letter for your spouse's eyes only.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-stone-200">
          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Letter Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. To My Soulmate on Our Wedding Morning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Your Words *
            </label>
            <textarea
              rows={6}
              required
              placeholder="My dearest..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm font-serif outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
          </div>

          {/* Time Lock Feature */}
          <div className="glass-card p-4 rounded-2xl border border-rose-500/30 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-300">
              <input
                type="checkbox"
                checked={isTimeLocked}
                onChange={(e) => setIsTimeLocked(e.target.checked)}
                className="rounded text-rose-600 bg-black border-white/20"
              />
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Enable Time-Lock Feature ("Open on a Future Date")</span>
            </label>

            {isTimeLocked && (
              <div className="pl-6 space-y-2 pt-2 border-t border-white/10">
                <label className="block text-[11px] text-stone-300">
                  Select Unlock Date (e.g. 1st Anniversary, Birthday):
                </label>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-black/50 border border-rose-500 text-xs text-white outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Attach Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 text-stone-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold shadow-glow-rose flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Letter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
