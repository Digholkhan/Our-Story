import React, { useState } from 'react';
import { Heart, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';
import { LoveReason, SessionState, CoupleProfile } from '../../types';

interface LoveReasonsViewProps {
  reasons: LoveReason[];
  session: SessionState;
  profile: CoupleProfile;
  onSaveReason: (reason: LoveReason) => void;
  onDeleteReason: (id: string) => void;
}

export const LoveReasonsView: React.FC<LoveReasonsViewProps> = ({
  reasons,
  session,
  profile,
  onSaveReason,
  onDeleteReason,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonText, setReasonText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    const newReason: LoveReason = {
      id: `lr-${Date.now()}`,
      author: session.activePartner,
      reason: reasonText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    onSaveReason(newReason);
    setReasonText('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">Private & Personal</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Reasons I Love You 💖
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            A growing collection of the little and big reasons why we are so grateful for each other.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reason</span>
          </button>
        )}
      </div>

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reasons.map((r) => (
          <div
            key={r.id}
            className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 hover:border-rose-300 transition-all relative group"
          >
            <div className="flex items-center gap-2 text-rose-600">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                {r.author === 'partner1' ? profile.partner1Name : profile.partner2Name}
              </span>
            </div>

            <p className="font-serif text-lg text-stone-900 italic leading-relaxed pt-1">
              "{r.reason}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>{r.date}</span>
              </div>

              {session.isLoggedIn && (
                <button
                  onClick={() => {
                    if (confirm('Delete this reason?')) onDeleteReason(r.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
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
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add a Reason 💖</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Why do you love them?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="I love the way you..."
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none resize-none font-serif focus:border-rose-400 text-stone-800"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
