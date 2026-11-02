import React, { useState } from 'react';
import { X, Building2, PlusCircle, Check } from 'lucide-react';
import { Project } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'مباني وإنشاءات' as Project['category'],
    client: '',
    budget: '',
    location: '',
    projectManager: 'م. حسام أحمد',
    consultant: '',
    progress: 0,
    preliminaryHandover: 0,
    finalHandover: 0,
    status: 'قيد التنفيذ' as Project['status']
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        budget: Number(formData.budget) || 50000000,
        progress: Number(formData.progress) || 0,
        preliminaryHandover: Number(formData.preliminaryHandover) || 0,
        finalHandover: Number(formData.finalHandover) || 0,
        startDate: new Date().toISOString().split('T')[0],
        expectedEndDate: '2027-12-31'
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">إنشاء مشروع هندسي جديد</h2>
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المشروع *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: مجمع مباني العاصمة الإدارية"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تصنيف الأعمال
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="مباني وإنشاءات">مباني وإنشاءات</option>
                <option value="أعمال خرسانية">أعمال خرسانية</option>
                <option value="تشطيبات">تشطيبات</option>
                <option value="كهروميكانيك">كهروميكانيك</option>
                <option value="بنية تحتية">بنية تحتية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الجهة المالكة / العميل
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
                placeholder="مثال: وزارة الإسكان والمرافق"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الميزانية التقديرية (ج.م)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                placeholder="150000000"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                موقع المشروع
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="مثال: التجمع الخامس، القاهرة"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المكتب الاستشاري
              </label>
              <input
                type="text"
                value={formData.consultant}
                onChange={e => setFormData({ ...formData, consultant: e.target.value })}
                placeholder="مثال: دار الهندسة"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نسبة التنفيذ المبدئية (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={e => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
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
              {loading ? (
                <span>جاري الحفظ في MongoDB...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>حفظ المشروع في قاعدة البيانات</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
