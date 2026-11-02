import React, { useState } from 'react';
import { X, FileSpreadsheet, Check } from 'lucide-react';
import { Project, SiteReport } from '../../types';

interface SiteReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSubmit: (report: Omit<SiteReport, 'id' | 'date'>) => Promise<void>;
}

export const SiteReportModal: React.FC<SiteReportModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSubmit
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '01');
  const [author, setAuthor] = useState('م. أحمد الشناوي');
  const [weather, setWeather] = useState('مشمس - 27°C');
  const [manpowerCount, setManpowerCount] = useState(65);
  const [activities, setActivities] = useState('');
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
        author,
        weather,
        manpowerCount: Number(manpowerCount),
        activities: activities || 'تم متابعة سير العمل وفق الجدول الزمني المعتمد.'
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
        <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-indigo-800 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">إضافة تقرير موقع يومي</h2>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              المشروع
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                المهندس المسئول
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                حالة الطقس
              </label>
              <input
                type="text"
                value={weather}
                onChange={e => setWeather(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عدد العمالة والفنيين المتواجدين اليوم
            </label>
            <input
              type="number"
              min="1"
              value={manpowerCount}
              onChange={e => setManpowerCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              أبرز الأنشطة المنجزة والملاحظات الفنية
            </label>
            <textarea
              rows={3}
              value={activities}
              onChange={e => setActivities(e.target.value)}
              placeholder="تم توريد حديد التسليح واستكمال أعمال العزل المائي..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'جاري الإرسال...' : 'حفظ التقرير'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
