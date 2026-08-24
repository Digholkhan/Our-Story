import React, { useState } from 'react';
import { X, Heart, MessageSquare, Send } from 'lucide-react';
import { GuestMessage } from '../../types';

interface AddGuestMessageModalProps {
  onClose: () => void;
  onSubmitMessage: (msg: GuestMessage) => Promise<void>;
}

export const AddGuestMessageModal: React.FC<AddGuestMessageModalProps> = ({
  onClose,
  onSubmitMessage,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    const newMsg: GuestMessage = {
      id: `gm-${Date.now()}`,
      authorName: authorName.trim(),
      relationship: relationship.trim() || 'Friend',
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved', // Auto-approved for friendly demo
      isPinned: false
    };

    void onSubmitMessage(newMsg).then(onClose);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-amber-500/30 space-y-6 relative animate-scaleIn">
        <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h3 className="font-serif text-2xl font-bold gold-gradient-text">
              Leave a Wedding Wish ❤️
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-stone-200">
          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aunt Rabeya, Tanvir"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Relationship to Couple
            </label>
            <input
              type="text"
              placeholder="e.g. Best Friend, Family, University Colleague"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-rose-300 mb-1">
              Your Blessing / Message *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write your heartfelt message for Sarah & Naim..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-rose-500 resize-none"
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
              <span>Post Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
