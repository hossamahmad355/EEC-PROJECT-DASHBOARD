import React, { useState } from 'react';
import { X, Search, Filter, Layers, AlertTriangle, ExternalLink, Plus } from 'lucide-react';
import { Project } from '../../types';

interface AllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onNewProject
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  if (!isOpen) return null;

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'قيد التنفيذ':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">قيد التنفيذ</span>;
      case 'متأخر':
      case 'معرض للمخاطر':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3" /> متأخر</span>;
      case 'مكتمل':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">مكتمل</span>;
      case 'متوقف':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">متوقف</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col text-right overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#17457e] via-[#1e589f] to-[#12396d] text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">سجل جميع المشروعات الجارية والمكتملة ({projects.length})</h2>
            <Layers className="w-5 h-5 text-blue-300" />
          </div>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewProject();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>مشروع جديد</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['الكل', 'قيد التنفيذ', 'مكتمل', 'متوقف', 'متأخر'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الكود أو العميل..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-right text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-50 sticky top-0 text-slate-500 font-bold border-b border-slate-200 text-xs">
              <tr>
                <th className="py-2.5 px-3 text-center">كود</th>
                <th className="py-2.5 px-3">أسم المشروع</th>
                <th className="py-2.5 px-3">الجهة المالكة</th>
                <th className="py-2.5 px-3">الموقع</th>
                <th className="py-2.5 px-3 min-w-[130px]">نسبة الإنجاز</th>
                <th className="py-2.5 px-3 text-center">التسليم الإبتدائي</th>
                <th className="py-2.5 px-3 text-center">حالة المشروع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(proj => (
                <tr
                  key={proj.id}
                  onClick={() => {
                    onClose();
                    onSelectProject(proj);
                  }}
                  className="hover:bg-blue-50/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-600 text-xs">
                    {proj.code}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1.5">
                    <span>{proj.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-xs">{proj.client}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs">{proj.location}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs tabular-nums text-slate-800 w-8">
                        {proj.progress}%
                      </span>
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {proj.preliminaryHandover}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(proj.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
