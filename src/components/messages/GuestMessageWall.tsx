import React from 'react';
import { Heart, MessageSquare, Plus, Pin, Trash2, CheckCircle, EyeOff } from 'lucide-react';
import { GuestMessage, SessionState } from '../../types';

interface GuestMessageWallProps {
  messages: GuestMessage[];
  session: SessionState;
  onOpenAddModal: () => void;
  onTogglePinMessage: (id: string) => void;
  onToggleHideMessage: (id: string) => void;
  onDeleteMessage: (id: string) => void;
}

export const GuestMessageWall: React.FC<GuestMessageWallProps> = ({
  messages,
  session,
  onOpenAddModal,
  onTogglePinMessage,
  onToggleHideMessage,
  onDeleteMessage,
}) => {
  const visibleMessages = messages.filter((m) => {
    if (!session.isLoggedIn && m.status === 'hidden') return false;
    return true;
  });

  const pinnedMessages = visibleMessages.filter((m) => m.isPinned);
  const unpinnedMessages = visibleMessages.filter((m) => !m.isPinned);
  const sortedMessages = [...pinnedMessages, ...unpinnedMessages];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Community Blessings & Wishes ❤️
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Messages From The People We Love
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
            A wall of love, prayers, and heartfelt blessings left by our families and dearest friends.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold tracking-wide shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto uppercase"
        >
          <Plus className="w-4 h-4" />
          <span>Leave a Message</span>
        </button>
      </div>

      {/* Message Grid Wall */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white p-7 sm:p-8 rounded-3xl border shadow-sm space-y-5 relative transition-all duration-300 flex flex-col justify-between ${
              msg.isPinned
                ? 'border-amber-400/80 bg-amber-50/20 shadow-md ring-1 ring-amber-400/30'
                : 'border-stone-200/80 hover:border-rose-300 hover:shadow-md'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl font-bold text-stone-900 tracking-wide">
                    {msg.authorName}
                  </h3>
                  {msg.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-700 text-amber-700" /> Pinned
                    </span>
                  )}
                  {msg.status === 'hidden' && (
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium flex items-center gap-1 border border-stone-300">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">
                  {msg.relationship}
                </span>
              </div>

              <span className="text-[11px] text-stone-500 font-mono shrink-0 font-medium">
                {msg.date}
              </span>
            </div>

            {/* Message Body with Deep Crisp Text */}
            <p className="font-serif italic text-stone-800 text-base sm:text-lg leading-relaxed pt-1">
              "{msg.message}"
            </p>

            {/* Couple Controls */}
            {session.isLoggedIn && (
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTogglePinMessage(msg.id)}
                    className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Pin className="w-3 h-3 text-amber-700" />
                    <span>{msg.isPinned ? 'Unpin' : 'Pin'}</span>
                  </button>

                  <button
                    onClick={() => onToggleHideMessage(msg.id)}
                    className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <EyeOff className="w-3 h-3 text-stone-600" />
                    <span>{msg.status === 'hidden' ? 'Approve' : 'Hide'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Delete this message?')) onDeleteMessage(msg.id);
                  }}
                  className="p-2 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
