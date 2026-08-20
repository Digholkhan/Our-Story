import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, Sparkles, Heart, Filter, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import { DateNightIdea, SessionState } from '../../types';

interface DateNightGeneratorProps {
  ideas: DateNightIdea[];
  session: SessionState;
  onSaveIdea: (idea: DateNightIdea) => void;
  onLogAsMemory: (idea: DateNightIdea) => void;
}

export const DateNightGenerator: React.FC<DateNightGeneratorProps> = ({
  ideas,
  session,
  onSaveIdea,
  onLogAsMemory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIdea, setCurrentIdea] = useState<DateNightIdea | null>(ideas[0] || null);
  const [isRolling, setIsRolling] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Idea Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<DateNightIdea['category']>('Romantic');

  const categories: string[] = [
    'All',
    'At Home',
    'Outdoors',
    'Romantic',
    'Cheap',
    'Adventure',
    'Relaxing',
    'Weekend',
  ];

  const filteredIdeas =
    selectedCategory === 'All'
      ? ideas
      : ideas.filter((i) => i.category === selectedCategory);

  const handleRollDice = () => {
    if (filteredIdeas.length === 0) return;
    setIsRolling(true);

    let rolls = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * filteredIdeas.length);
      setCurrentIdea(filteredIdeas[randomIdx]);
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
        setIsRolling(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }, 100);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIdea: DateNightIdea = {
      id: `di-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCat,
    };

    onSaveIdea(newIdea);
    setCurrentIdea(newIdea);
    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Couple Decision Helper 🎲
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Date Night Generator
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            Can’t decide what to do together tonight? Pick a vibe, roll the dice, and let destiny choose your date!
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Idea</span>
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              const matching = cat === 'All' ? ideas : ideas.filter((i) => i.category === cat);
              if (matching.length > 0) setCurrentIdea(matching[0]);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Dice Roll Spotlight Card */}
      <div className="bg-white p-8 sm:p-14 rounded-3xl border border-stone-200/90 text-center space-y-6 shadow-sm relative overflow-hidden">
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold uppercase tracking-wider">
            {currentIdea ? currentIdea.category : 'Tonight’s Plan'}
          </span>
        </div>

        <div className="min-h-[120px] flex flex-col items-center justify-center space-y-3">
          <h2
            className={`font-serif text-3xl sm:text-5xl font-bold text-stone-900 transition-all ${
              isRolling ? 'scale-95 blur-xs opacity-50' : 'scale-100 opacity-100'
            }`}
          >
            {currentIdea ? currentIdea.title : 'Ready to Roll!'}
          </h2>

          {currentIdea && currentIdea.description && (
            <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              {currentIdea.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleRollDice}
            disabled={isRolling || filteredIdeas.length === 0}
            className="px-8 py-4 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm shadow-md flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Choosing...' : '🎲 Surprise Us (Roll Dice)'}</span>
          </button>

          {currentIdea && (
            <button
              onClick={() => onLogAsMemory(currentIdea)}
              className="px-6 py-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-all flex items-center gap-2 border border-stone-300"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>We Did This! (Log)</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Idea Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add Date Night Idea</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stargazing on the roof with hot cocoa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as DateNightIdea['category'])}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                >
                  <option value="At Home">At Home</option>
                  <option value="Outdoors">Outdoors</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Cheap">Cheap / Cozy</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxing">Relaxing</option>
                  <option value="Weekend">Weekend Getaway</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What makes this date special?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 resize-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs">Save Idea</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
