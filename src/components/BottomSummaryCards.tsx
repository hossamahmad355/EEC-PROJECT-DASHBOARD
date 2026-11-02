import React from 'react';
import {
  CalendarCheck,
  CheckSquare,
  BarChart2,
  FolderOpen,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { DashboardStats } from '../types';

interface BottomSummaryCardsProps {
  stats: DashboardStats;
  onOpenSection: (section: 'tasks' | 'approvals' | 'reports' | 'documents') => void;
}

export const BottomSummaryCards: React.FC<BottomSummaryCardsProps> = ({
  stats,
  onOpenSection
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {/* 1. المستندات والعقود (Leftmost in RTL) */}
      <div
        onClick={() => onOpenSection('documents')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm sm:text-base">
            <span>المستندات والعقود</span>
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="flex items-baseline justify-end gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-500">مستند</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {stats.documentsCount ? stats.documentsCount.toLocaleString('en-US') : '1,342'}
          </span>
        </div>
      </div>

      {/* 2. التقارير */}
      <div
        onClick={() => onOpenSection('reports')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm sm:text-base">
            <span>التقارير</span>
            <BarChart2 className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="flex items-baseline justify-end gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-500">تقرير</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {stats.reportsCount || 56}
          </span>
        </div>
      </div>

      {/* 3. الموافقات */}
      <div
        onClick={() => onOpenSection('approvals')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm sm:text-base">
            <span>الموافقات</span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="flex items-baseline justify-end gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-500">موافقة معلقة</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {stats.approvalsCount || 12}
          </span>
        </div>
      </div>

      {/* 4. المهام (Rightmost in RTL) */}
      <div
        onClick={() => onOpenSection('tasks')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm sm:text-base">
            <span>المهام</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="flex items-baseline justify-end gap-1.5 mt-2">
          <span className="text-xs font-bold text-slate-500">مهمة</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {stats.tasksCount || 35}
          </span>
        </div>
      </div>
    </div>
  );
};
