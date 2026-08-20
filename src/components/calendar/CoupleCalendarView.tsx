import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, MapPin, Tag } from 'lucide-react';
import { CalendarEvent, SessionState } from '../../types';

interface CoupleCalendarViewProps {
  events: CalendarEvent[];
  session: SessionState;
  onSaveEvent: (evt: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CoupleCalendarView: React.FC<CoupleCalendarViewProps> = ({
  events,
  session,
  onSaveEvent,
  onDeleteEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<CalendarEvent['category']>('anniversary');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const categoryIcons: Record<CalendarEvent['category'], string> = {
    anniversary: '❤️ Anniversary',
    birthday: '🎂 Birthday',
    vacation: '✈️ Vacation',
    date_night: '🍽️ Date Night',
    family: '👨‍👩‍👧 Family Event',
    reminder: '📌 Reminder'
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvt: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: title.trim(),
      date,
      category,
      description: description.trim() || undefined,
      location: location.trim() || undefined
    };

    onSaveEvent(newEvt);
    setTitle('');
    setDescription('');
    setLocation('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Shared Schedule 📅
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Couple Calendar
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            Never miss an anniversary, birthday, vacation, or candlelit date night.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-3.5 relative hover:border-rose-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  {categoryIcons[evt.category]}
                </span>
                <span className="text-xs text-stone-500 font-mono font-medium">{evt.date}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-stone-900">{evt.title}</h3>

              {evt.description && (
                <p className="text-stone-600 text-xs leading-relaxed">{evt.description}</p>
              )}

              {evt.location && (
                <div className="text-xs text-rose-800 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>

            {session.isLoggedIn && (
              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('Delete this event?')) onDeleteEvent(evt.id);
                  }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">Add Calendar Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Anniversary Dinner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                  >
                    <option value="anniversary">❤️ Anniversary</option>
                    <option value="birthday">🎂 Birthday</option>
                    <option value="vacation">✈️ Vacation</option>
                    <option value="date_night">🍽️ Date Night</option>
                    <option value="family">👨‍👩‍👧 Family</option>
                    <option value="reminder">📌 Reminder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Italian restaurant reservation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
