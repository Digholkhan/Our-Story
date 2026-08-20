import React, { useState } from 'react';
import { Heart, Lock, Unlock, Plus, Calendar, Trash2, Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { LoveLetter, SessionState } from '../../types';

interface LoveLettersViewProps {
  letters: LoveLetter[];
  session: SessionState;
  onOpenWriteModal: () => void;
  onDeleteLetter: (id: string) => void;
}

export const LoveLettersView: React.FC<LoveLettersViewProps> = ({
  letters,
  session,
  onOpenWriteModal,
  onDeleteLetter,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);

  const isLocked = (letter: LoveLetter) => {
    if (!letter.unlockDate) return false;
    const now = new Date().getTime();
    const unlock = new Date(letter.unlockDate).getTime();
    return now < unlock;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Private Correspondence 💌
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Letters To Each Other
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
            Heartfelt private letters written between partners. Some are unlocked today, while others remain locked until future anniversaries.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={onOpenWriteModal}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Letter</span>
          </button>
        )}
      </div>

      {/* Letters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((letItem) => {
          const locked = isLocked(letItem);
          return (
            <div
              key={letItem.id}
              onClick={() => !locked && setSelectedLetter(letItem)}
              className={`p-7 sm:p-8 rounded-3xl border space-y-4 transition-all relative flex flex-col justify-between ${
                locked
                  ? 'border-stone-200 bg-stone-50/80 cursor-not-allowed'
                  : 'border-stone-200/80 bg-white hover:border-rose-300 cursor-pointer shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-mono font-medium">{letItem.date}</span>
                {locked ? (
                  <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
                    <Lock className="w-3.5 h-3.5 text-rose-600" /> Locked until {letItem.unlockDate}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-stone-900">{letItem.title}</h3>
                <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  From: {letItem.sender === 'partner1' ? 'Farjana' : 'Nasif'}
                </p>
              </div>

              {locked ? (
                <div className="py-6 text-center space-y-2 border-t border-b border-stone-200 my-2 bg-stone-100/50 rounded-2xl">
                  <Lock className="w-8 h-8 text-stone-400 mx-auto animate-pulse" />
                  <p className="text-stone-600 text-xs italic font-serif">
                    “Open on our 1st Anniversary” — This letter will unlock automatically on {letItem.unlockDate}.
                  </p>
                </div>
              ) : (
                <p className="text-stone-700 text-sm font-serif italic line-clamp-3 leading-relaxed">
                  "{letItem.content}"
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                {!locked ? (
                  <span className="text-xs text-rose-800 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Read Full Letter →
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400">Patience is romantic ❤️</span>
                )}

                {session.isLoggedIn && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this letter?')) onDeleteLetter(letItem.id);
                    }}
                    className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-2xl w-full border border-stone-200/90 space-y-6 max-h-[85vh] overflow-y-auto bg-white text-stone-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs text-stone-500 font-mono">{selectedLetter.date}</span>
                <h2 className="font-serif text-3xl font-bold text-stone-900">
                  {selectedLetter.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            {selectedLetter.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-60 border border-stone-200">
                <img
                  src={selectedLetter.imageUrl}
                  alt={selectedLetter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="whitespace-pre-wrap font-serif text-stone-800 text-base sm:text-lg leading-relaxed p-6 bg-stone-50 rounded-2xl border border-stone-200/80">
              {selectedLetter.content}
            </div>

            <div className="text-right pt-2 border-t border-stone-100 font-serif italic text-xl text-rose-800">
              With endless love, <br />
              {selectedLetter.sender === 'partner1' ? 'Farjana' : 'Nasif'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
