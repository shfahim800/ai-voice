import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Check } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'SH Assistant Release Specs',
      body: 'Verified Android APK build with Dalvik byte structures and Windows 11 remote companion script.',
      date: 'Today, 10:30 AM'
    },
    {
      id: '2',
      title: 'বাজারের তালিকা (Market list)',
      body: 'আম, দুধ, ডিম, মসলা, কফি বিন্স।',
      date: 'Yesterday'
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      title: newTitle,
      body: newBody,
      date: 'Just now'
    };
    setNotes([note, ...notes]);
    setNewTitle('');
    setNewBody('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-[#071322] border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Quick Notes</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAdding ? (
          <div className="p-3 bg-[#091728] border border-cyan-500/40 rounded-2xl space-y-2">
            <input
              type="text"
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#050e1a] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <textarea
              placeholder="Write note details..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={3}
              className="w-full bg-[#050e1a] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40 flex items-center justify-center gap-2 text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
        )}

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-[#081525] border border-slate-800 rounded-xl group relative">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-white">{note.title}</h4>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-slate-500 hover:text-rose-400 p-0.5 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 whitespace-pre-wrap">{note.body}</p>
              <span className="text-[9px] text-slate-500 mt-2 block">{note.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
