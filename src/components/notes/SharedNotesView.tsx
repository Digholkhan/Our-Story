import React, { useState } from 'react';
import { StickyNote, Plus, Pin, Trash2, CheckSquare, Square, Edit2, X } from 'lucide-react';
import { SharedNote, SessionState } from '../../types';

interface SharedNotesViewProps {
  notes: SharedNote[];
  session: SessionState;
  onSaveNote: (note: SharedNote) => void;
  onDeleteNote: (id: string) => void;
}

export const SharedNotesView: React.FC<SharedNotesViewProps> = ({
  notes,
  session,
  onSaveNote,
  onDeleteNote,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SharedNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isPinned, setIsPinned] = useState(false);
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleOpenAdd = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setIsPinned(false);
    setChecklistItems([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: SharedNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setIsPinned(note.isPinned);
    setChecklistItems(note.checklistItems || []);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const note: SharedNote = {
      id: editingNote?.id || `sn-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
      checklistItems: checklistItems.length > 0 ? checklistItems : undefined,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveNote(note);
    setIsModalOpen(false);
  };

  const addChecklistItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklistItems([...checklistItems, { id: `c-${Date.now()}`, text: newCheckItem.trim(), done: false }]);
    setNewCheckItem('');
  };

  const toggleCheckItem = (noteId: string, itemId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !note.checklistItems) return;
    const updatedItems = note.checklistItems.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i
    );
    onSaveNote({ ...note, checklistItems: updatedItems, updatedAt: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Private Notebook 📝
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 mt-1">
            Shared Notes
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-lg font-light">
            A shared private notebook & checklist for the couple. Shopping lists, home plans, travel itineraries, and more.
          </p>
        </div>

        {session.isLoggedIn && (
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Note</span>
          </button>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className={`bg-white p-7 rounded-3xl border space-y-4 relative group transition-all flex flex-col justify-between shadow-xs ${
              note.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200/80 hover:border-rose-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  {note.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {note.isPinned && <Pin className="w-3.5 h-3.5 text-amber-700 fill-current" />}
                  <span className="text-[11px] text-stone-500 font-mono">{note.updatedAt}</span>
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-stone-900">{note.title}</h3>
              {note.content && <p className="text-stone-700 text-xs leading-relaxed">{note.content}</p>}

              {/* Checklist Items */}
              {note.checklistItems && note.checklistItems.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {note.checklistItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => session.isLoggedIn && toggleCheckItem(note.id, item.id)}
                      className="flex items-center gap-2 text-xs w-full text-left group/item"
                    >
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className={item.done ? 'line-through text-stone-400' : 'text-stone-800'}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {session.isLoggedIn && (
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(note)}
                  className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => { if (confirm('Delete note?')) onDeleteNote(note.id); }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-stone-200/80 space-y-4 max-h-[85vh] overflow-y-auto bg-white text-stone-800 shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              {editingNote ? 'Edit Note' : 'Create Note'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Content</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none resize-none text-stone-800 focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm outline-none text-stone-800 focus:border-rose-400" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-stone-800 font-medium pb-2">
                    <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded" />
                    <Pin className="w-3.5 h-3.5 text-amber-700" /> Pin to Top
                  </label>
                </div>
              </div>

              {/* Checklist Builder */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600 uppercase">Checklist Items</label>
                {checklistItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <Square className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="flex-1 text-stone-800">{item.text}</span>
                    <button type="button" onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))} className="text-stone-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(); } }}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs outline-none text-stone-800"
                  />
                  <button type="button" onClick={addChecklistItem} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-semibold">+ Add</button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
