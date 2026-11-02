import React, { useState } from 'react';
import { X, CalendarCheck, CheckSquare, BarChart2, FolderOpen, Search, Download, Clock } from 'lucide-react';
import { TaskItem, ApprovalItem, SiteReport, DocumentItem } from '../../types';
import { exportSiteReportsToPdf } from '../../utils/pdfExport';

interface SectionDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: 'tasks' | 'approvals' | 'reports' | 'documents' | null;
  tasks: TaskItem[];
  approvals: ApprovalItem[];
  reports: SiteReport[];
  documents: DocumentItem[];
}

export const SectionDataModal: React.FC<SectionDataModalProps> = ({
  isOpen,
  onClose,
  section,
  tasks,
  approvals,
  reports,
  documents
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen || !section) return null;

  const getSectionTitle = () => {
    switch (section) {
      case 'tasks':
        return { title: 'إدارة المهام الميدانية والمكتبية', count: '35 مهمة', icon: <CalendarCheck className="w-5 h-5 text-blue-200" /> };
      case 'approvals':
        return { title: 'سجل الموافقات والاعتمادات الاستشارية', count: '12 موافقة معلقة', icon: <CheckSquare className="w-5 h-5 text-blue-200" /> };
      case 'reports':
        return { title: 'تقارير الموقع والإنجاز الدوري', count: '56 تقرير', icon: <BarChart2 className="w-5 h-5 text-blue-200" /> };
      case 'documents':
        return { title: 'أرشيف المستندات والعقود والمخططات', count: '1,342 مستند', icon: <FolderOpen className="w-5 h-5 text-blue-200" /> };
    }
  };

  const header = getSectionTitle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 flex flex-col text-right overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#17457e] to-[#1e589f] text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs text-blue-200 font-bold">{header.count}</div>
              <h2 className="text-base sm:text-lg font-bold">{header.title}</h2>
            </div>
            {header.icon}
          </div>
        </div>

        {/* Search & Export */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في السجلات..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {section === 'reports' && (
              <button
                onClick={() => exportSiteReportsToPdf(reports, 'تقرير تقارير الموقع اليومية - الشركة المصرية للمقاولات')}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-red-200 cursor-pointer"
                title="تصدير تقارير الموقع إلى ملف PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير التقارير PDF</span>
              </button>
            )}
          </div>
          <span className="text-xs font-bold text-slate-500">
            مسترجع مباشرة من قاعدة بيانات المشروعات
          </span>
        </div>

        {/* Content Table / List */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* TASKS */}
          {section === 'tasks' && (
            <div className="space-y-2.5">
              {tasks.map(t => (
                <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      t.priority === 'عاجل' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      تاريخ الاستحقاق: {t.dueDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span>{t.projectName}</span> • <span>المسؤول: {t.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* APPROVALS */}
          {section === 'approvals' && (
            <div className="space-y-2.5">
              {approvals.map(a => (
                <div key={a.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {a.status}
                  </span>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900">{a.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span>{a.projectName}</span> • <span>مقدم الطلب: {a.requester}</span> • <span className="font-mono">{a.submissionDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SITE REPORTS */}
          {section === 'reports' && (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <span className="text-xs text-slate-500 font-mono font-bold">{r.date} | {r.weather}</span>
                    <div className="font-bold text-sm text-slate-900">{r.projectName}</div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{r.activities}</p>
                  <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                    <span>العمالة: {r.manpowerCount} فني وعامل</span>
                    <span>المهندس: {r.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOCUMENTS */}
          {section === 'documents' && (
            <div className="space-y-2.5">
              {documents.map(d => (
                <div key={d.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between">
                  <button
                    onClick={() => alert(`جاري تنزيل الملف المعتمد: ${d.title}`)}
                    className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="تنزيل الملف"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-slate-900">{d.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span className="font-bold text-blue-700">{d.category}</span> • <span>{d.projectName}</span> • <span className="font-mono">{d.fileSize}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
