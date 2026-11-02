import React from 'react';
import { Layers, AlertTriangle, ChevronLeft, Eye, ExternalLink, Download } from 'lucide-react';
import { Project } from '../types';

interface CurrentProjectsTableProps {
  projects: Project[];
  onViewAll: () => void;
  onSelectProject: (project: Project) => void;
  onExportPdf: () => void;
  activeFilter?: string;
}

export const CurrentProjectsTable: React.FC<CurrentProjectsTableProps> = ({
  projects,
  onViewAll,
  onSelectProject,
  onExportPdf,
  activeFilter
}) => {
  // Display the top 5 projects matching current filter
  const displayedProjects = projects.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'قيد التنفيذ':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#e8f8ee] text-[#16a34a] border border-[#bbf0ca]">
            قيد التنفيذ
          </span>
        );
      case 'متأخر':
      case 'معرض للمخاطر':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            <AlertTriangle className="w-3.5 h-3.5" />
            متأخر
          </span>
        );
      case 'مكتمل':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            مكتمل
          </span>
        );
      case 'متوقف':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#fefce8] text-[#ca8a04] border border-[#fef08a]">
            متوقف
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Header: Title and 'عرض الكل' and 'تصدير PDF' */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onExportPdf}
            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1 transition-all border border-red-200 cursor-pointer"
            title="تصدير جدول المشروعات إلى ملف PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
            المشروعات الجارية
          </h3>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-slate-500 font-bold border-b border-slate-100 text-[11px] sm:text-xs">
              <th className="py-2.5 px-2 text-center w-8">#</th>
              <th className="py-2.5 px-3">أسم المشروع</th>
              <th className="py-2.5 px-3 min-w-[140px]">نسبة التنفيذ</th>
              <th className="py-2.5 px-3 text-center">التسليم الإبتدائي</th>
              <th className="py-2.5 px-3 text-center">التسليم النهائي</th>
              <th className="py-2.5 px-3 text-center">حالة المشروع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {displayedProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  لا توجد مشروعات مطابقة للتصفية المحددة.
                </td>
              </tr>
            ) : (
              displayedProjects.map((project, idx) => (
                <tr
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                >
                  {/* # Index Column */}
                  <td className="py-3 px-2 text-center font-bold text-slate-900 font-mono tabular-nums">
                    {project.id || (idx + 1).toString().padStart(2, '0')}
                  </td>

                  {/* Project Name */}
                  <td className="py-3 px-3 font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>{project.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>

                  {/* Execution Progress Rate */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs font-mono tabular-nums w-8">
                        {project.progress}%
                      </span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 shadow-xs"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Preliminary Handover */}
                  <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono tabular-nums">
                    {project.preliminaryHandover}%
                  </td>

                  {/* Final Handover */}
                  <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono tabular-nums">
                    {project.finalHandover}%
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(project.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
