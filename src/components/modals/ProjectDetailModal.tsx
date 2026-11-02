import React, { useState } from 'react';
import { X, Building2, MapPin, User, ShieldCheck, DollarSign, Calendar, TrendingUp, Check, Trash2, MessageSquare } from 'lucide-react';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onOpenChat: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onOpenChat
}) => {
  if (!isOpen || !project) return null;

  const [progress, setProgress] = useState(project.progress);
  const [status, setStatus] = useState(project.status);
  const [preliminary, setPreliminary] = useState(project.preliminaryHandover);
  const [finalH, setFinalH] = useState(project.finalHandover);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(project.id, {
        progress,
        status,
        preliminaryHandover: preliminary,
        finalHandover: finalH
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#17457e] to-[#1e589f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenChat(project);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/30 shadow-xs"
              title="فتح غرفة دردشة المشروع"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>دردشة الفريق</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs text-blue-200 font-mono font-bold">{project.code}</div>
              <h2 className="text-base sm:text-lg font-bold">{project.name}</h2>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 justify-end">
                <span>الجهة المالكة</span>
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{project.client}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 justify-end">
                <span>الموقع</span>
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{project.location}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 justify-end">
                <span>المكتب الاستشاري</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{project.consultant}</div>
            </div>
          </div>

          {/* Budget Metrics */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold">الميزانية الإجمالية</div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-mono tabular-nums">
                {project.budget.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">المنصرف الفعلي</div>
              <div className="text-base sm:text-lg font-black text-blue-700 font-mono tabular-nums">
                {project.spent.toLocaleString('en-US')} ج.م
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">مدير المشروع</div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                {project.projectManager}
              </div>
            </div>
          </div>

          {/* Editable Parameters */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 justify-end">
              <span>تحديث الحالة ونسب الإنجاز</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-blue-600">{progress}%</span>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نسبة التسليم الإبتدائي (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={preliminary}
                  onChange={e => setPreliminary(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نسبة التسليم النهائي (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={finalH}
                  onChange={e => setFinalH(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                حالة المشروع
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              >
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="متوقف">متوقف</option>
                <option value="متأخر">متأخر (معرض للمخاطر)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف المشروع (${project.name})؟`)) {
                  onDelete(project.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          )}

          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'جاري التحديث...' : 'حفظ التعديلات في MongoDB'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
