import React, { useState } from 'react';
import { X, TrendingUp, Check } from 'lucide-react';
import { Project } from '../../types';

interface RecordProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onUpdateProgress: (projectId: string, newProgress: number, preliminaryHandover?: number) => Promise<void>;
}

export const RecordProgressModal: React.FC<RecordProgressModalProps> = ({
  isOpen,
  onClose,
  projects,
  onUpdateProgress
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '01');
  const selectedProj = projects.find(p => p.id === projectId) || projects[0];

  const [progress, setProgress] = useState(selectedProj ? selectedProj.progress : 75);
  const [preliminary, setPreliminary] = useState(selectedProj ? selectedProj.preliminaryHandover : 0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync when project changes
  const handleProjectChange = (id: string) => {
    setProjectId(id);
    const p = projects.find(item => item.id === id);
    if (p) {
      setProgress(p.progress);
      setPreliminary(p.preliminaryHandover);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateProgress(projectId, Number(progress), Number(preliminary));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-cyan-700 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">تسجيل وتحديث نسبة إنجاز</h2>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اختر المشروع المراد تحديثه
            </label>
            <select
              value={projectId}
              onChange={e => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} ({p.progress}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-black text-blue-600 font-mono tabular-nums">{progress}%</span>
              <label className="text-xs font-bold text-slate-700">نسبة التنفيذ الحالية</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-black text-cyan-600 font-mono tabular-nums">{preliminary}%</span>
              <label className="text-xs font-bold text-slate-700">نسبة التسليم الإبتدائي</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={preliminary}
              onChange={e => setPreliminary(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات المهندس المشرف / محضر الفحص
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="تم الانتهاء من صب خرسانة السقف بنجاح وإجراء اختبار المكعبات..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'جاري الحفظ...' : 'تحديث النسبة في MongoDB'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
