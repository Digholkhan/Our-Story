import React, { useState } from 'react';
import { Calendar, MapPin, Plus, Edit2, Trash2, Video, Globe, Users, Lock, Sparkles } from 'lucide-react';
import { TimelineEvent, SessionState, VisibilityLevel } from '../../types';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  session: SessionState;
  onSaveEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  session,
  onSaveEvent,
  onDeleteEvent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [year, setYear] = useState('2026');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [visibility, setVisibility] = useState<VisibilityLevel>('PUBLIC');

  const visibleEvents = timeline.filter((e) => {
    if (!session.isLoggedIn && e.visibility !== 'PUBLIC') return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setYear(new Date().getFullYear().toString());
    setDate(new Date().toISOString().split('T')[0]);
    setTitle('');
    setDescription('');
    setLocation('');
    setImageUrl('');
    setVideoUrl('');
    setVisibility('PUBLIC');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: TimelineEvent) => {
    setEditingId(evt.id);
    setYear(evt.year);
    setDate(evt.date);
    setTitle(evt.title);
    setDescription(evt.description);
    setLocation(evt.location || '');
    setImageUrl(evt.imageUrl || '');
    setVideoUrl(evt.videoUrl || '');
    setVisibility(evt.visibility);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvt: TimelineEvent = {
      id: editingId || `tl-${Date.now()}`,
      year: year || new Date(date).getFullYear().toString(),
      date,
      title,
      description,
      location,
      imageUrl,
      videoUrl,
      visibility
    };

    onSaveEvent(newEvt);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Our Journey ⏳
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Our Story Timeline
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            Chronological milestones of our relationship, vows, adventures, and lifelong commitments.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timeline Event</span>
          </button>
        )}
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative border-l-2 border-rose-200 ml-4 sm:ml-32 space-y-12 py-4">
        {visibleEvents.map((evt) => (
          <div key={evt.id} className="relative pl-6 sm:pl-10 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-rose-500 flex items-center justify-center text-rose-600 shadow-sm group-hover:scale-125 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Year Tag on Left (Desktop) */}
            <div className="hidden sm:block absolute -left-32 top-1.5 w-24 text-right">
              <span className="font-serif text-2xl font-bold text-stone-800 block">
                {evt.year}
              </span>
              <span className="text-[11px] text-stone-400 block font-mono">{evt.date}</span>
            </div>

            {/* Card Content */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 space-y-4 hover:border-rose-300 transition-all bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="sm:hidden flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <span>{evt.year}</span>
                    <span>•</span>
                    <span>{evt.date}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                    {evt.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-[10px] font-medium text-stone-600 flex items-center gap-1 border border-stone-200">
                    {evt.visibility === 'PUBLIC' && <Globe className="w-3 h-3 text-emerald-600" />}
                    {evt.visibility === 'COUPLE_ONLY' && <Users className="w-3 h-3 text-amber-600" />}
                    {evt.visibility === 'PRIVATE' && <Lock className="w-3 h-3 text-rose-600" />}
                    <span>{evt.visibility}</span>
                  </span>

                  {session.isLoggedIn && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this timeline event?')) onDeleteEvent(evt.id);
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {evt.location && (
                <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>{evt.location}</span>
                </div>
              )}

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
                {evt.description}
              </p>

              {evt.imageUrl && (
                <div className="rounded-2xl overflow-hidden max-h-72 border border-stone-200">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {evt.videoUrl && (
                <div className="pt-2">
                  <a
                    href={evt.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs border border-stone-200"
                  >
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>Watch Highlight Video</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-stone-200/80 space-y-4 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              {editingId ? 'Edit Timeline Event' : 'Add Timeline Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-stone-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Full Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Our Proposal in Paris 💍"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell the story of this event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, venue..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as VisibilityLevel)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="COUPLE_ONLY">Couple Only</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                  Video Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm"
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
