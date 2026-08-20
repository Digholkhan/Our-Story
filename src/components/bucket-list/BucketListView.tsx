import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Plus, Trash2, Camera, Calendar } from 'lucide-react';
import { BucketListItem, SessionState } from '../../types';

interface BucketListViewProps {
  bucketList: BucketListItem[];
  session: SessionState;
  onSaveItem: (item: BucketListItem) => void;
  onDeleteItem: (id: string) => void;
  onConvertToMemory: (item: BucketListItem) => void;
}

export const BucketListView: React.FC<BucketListViewProps> = ({
  bucketList,
  session,
  onSaveItem,
  onDeleteItem,
  onConvertToMemory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');

  const completedCount = bucketList.filter((i) => i.isCompleted).length;

  const toggleComplete = (item: BucketListItem) => {
    const updated: BucketListItem = {
      ...item,
      isCompleted: !item.isCompleted,
      completedDate: !item.isCompleted ? new Date().toISOString().split('T')[0] : undefined
    };

    if (!item.isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onSaveItem(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: BucketListItem = {
      id: `bl-${Date.now()}`,
      title: title.trim(),
      isCompleted: false
    };

    onSaveItem(newItem);
    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Lifetime Adventures 🌎
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Our Bucket List
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            Experiences, adventures, and milestones to check off hand-in-hand.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {/* Progress Counter Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Completed Experiences</span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            {completedCount} / {bucketList.length} Checked Off
          </h2>
        </div>
        <div className="text-3xl">✨</div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        {bucketList.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-5 sm:p-6 rounded-3xl border transition-all flex items-center justify-between gap-4 shadow-xs ${
              item.isCompleted ? 'border-emerald-300 bg-emerald-50/30' : 'border-stone-200/80 hover:border-rose-300'
            }`}
          >
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => session.isLoggedIn && toggleComplete(item)}
            >
              {item.isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-stone-300 hover:text-rose-500 shrink-0 transition-colors" />
              )}
              <div>
                <span
                  className={`font-serif text-lg font-bold block ${
                    item.isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                  }`}
                >
                  {item.title}
                </span>

                {item.isCompleted && item.completedDate && (
                  <span className="text-xs text-emerald-700 font-mono font-medium block mt-0.5">
                    ✓ Completed on {item.completedDate}
                  </span>
                )}
              </div>
            </div>

            {session.isLoggedIn && (
              <button
                onClick={() => {
                  if (confirm('Remove this bucket item?')) onDeleteItem(item.id);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add Bucket List Item</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Experience Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ride a hot air balloon at sunrise"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
