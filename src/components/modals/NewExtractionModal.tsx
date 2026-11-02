import React, { useState } from 'react';
import { X, FileCheck2, Check } from 'lucide-react';
import { Project, QuickExtraction } from '../../types';

interface NewExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSubmit: (extraction: Omit<QuickExtraction, 'id' | 'date'>) => Promise<void>;
}

export const NewExtractionModal: React.FC<NewExtractionModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSubmit
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '01');
  const [extractionNumber, setExtractionNumber] = useState(1);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('نوفمبر 2026');
  const [status, setStatus] = useState<QuickExtraction['status']>('تحت المراجعة');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    setLoading(true);
    try {
      await onSubmit({
        projectId,
        projectName: proj?.name || 'مشروع غير محدد',
        extractionNumber: Number(extractionNumber),
        amount: Number(amount) || 5000000,
        period,
        status
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">إنشاء مستخلص مالي جاري</h2>
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              المشروع المرتبط
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم المستخلص
              </label>
              <input
                type="number"
                min="1"
                required
                value={extractionNumber}
                onChange={e => setExtractionNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الفترة المحاسبية
              </label>
              <input
                type="text"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                placeholder="مثال: نوفمبر 2026"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              قيمة المستخلص الصافية (ج.م) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="مثال: 8500000"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              حالة المستخلص
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="تحت المراجعة">تحت المراجعة (لدى الاستشاري)</option>
              <option value="معتمد">معتمد للصرف</option>
              <option value="مسودة">مسودة إعداد</option>
            </select>
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
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'جاري الاعتماد...' : 'تسجيل المستخلص'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
