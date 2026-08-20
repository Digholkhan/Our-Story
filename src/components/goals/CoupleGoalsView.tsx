import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, CheckCircle2, Target } from 'lucide-react';
import { CoupleGoal, SessionState } from '../../types';

interface CoupleGoalsViewProps {
  goals: CoupleGoal[];
  session: SessionState;
  onSaveGoal: (goal: CoupleGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const CoupleGoalsView: React.FC<CoupleGoalsViewProps> = ({
  goals,
  session,
  onSaveGoal,
  onDeleteGoal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CoupleGoal['category']>('Travel');
  const [targetYear, setTargetYear] = useState('2028');
  const [progress, setProgress] = useState<number>(40);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newGoal: CoupleGoal = {
      id: `cg-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      targetYear,
      progress,
      status: progress >= 100 ? 'achieved' : 'in_progress',
      imageUrl: imageUrl.trim() || undefined
    };

    onSaveGoal(newGoal);
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Shared Aspirations ✨
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Our Dreams & Goals
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl font-light">
            From travel destinations and financial milestones to home building and personal growth.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shared Goal</span>
          </button>
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs space-y-4 p-7 flex flex-col justify-between hover:border-rose-300 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  {goal.category}
                </span>
                <span className="text-xs font-mono text-stone-500 font-medium">Target: {goal.targetYear}</span>
              </div>

              {goal.imageUrl && (
                <div className="h-44 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={goal.imageUrl}
                    alt={goal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="font-serif text-xl font-bold text-stone-900">{goal.title}</h3>
              <p className="text-stone-600 text-xs leading-relaxed">{goal.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-600">Progress</span>
                <span className="text-rose-800 font-mono">{goal.progress}%</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                <div
                  className="h-full rounded-full bg-rose-600 transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              {session.isLoggedIn && (
                <div className="flex items-center justify-between pt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => {
                      const newProg = parseInt(e.target.value, 10);
                      onSaveGoal({
                        ...goal,
                        progress: newProg,
                        status: newProg >= 100 ? 'achieved' : 'in_progress'
                      });
                    }}
                    className="w-32 accent-rose-600 h-1.5"
                  />

                  <button
                    onClick={() => {
                      if (confirm('Delete this goal?')) onDeleteGoal(goal.id);
                    }}
                    className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add Shared Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visit Japan in Cherry Blossom Season 🌸"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CoupleGoal['category'])}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                  >
                    <option value="Home">Home 🏠</option>
                    <option value="Travel">Travel ✈️</option>
                    <option value="Finance">Finance 💰</option>
                    <option value="Relationship">Relationship ❤️</option>
                    <option value="Personal">Personal ✨</option>
                    <option value="Adventure">Adventure 🏔️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Target Year
                  </label>
                  <input
                    type="text"
                    placeholder="2028"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details of what achieving this goal looks like..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 resize-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Initial Progress ({progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Cover Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
