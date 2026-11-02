import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  PauseCircle,
  HardHat,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { DashboardStats } from '../types';

interface TopKpiCardsProps {
  stats: DashboardStats;
  onFilterStatus?: (status: string) => void;
}

export const TopKpiCards: React.FC<TopKpiCardsProps> = ({ stats, onFilterStatus }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
      {/* 1. إجمالي المشروعات (Rightmost in RTL) */}
      <div
        onClick={() => onFilterStatus?.('الكل')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
            إجمالي المشروعات
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums font-mono">
            {stats.totalProjects}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-105 transition-transform">
          {/* Custom Construction Crane SVG */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16" />
            <path d="M8 22V4l12 4" />
            <path d="M8 8h12" />
            <path d="M17 8v5" />
            <circle cx="17" cy="15" r="2" />
          </svg>
        </div>
      </div>

      {/* 2. مشروعات تحت التنفيذ */}
      <div
        onClick={() => onFilterStatus?.('قيد التنفيذ')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700 transition-colors">
            مشروعات تحت التنفيذ
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums font-mono">
            {stats.underExecution}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 transition-transform">
          <HardHat className="w-6 h-6" />
        </div>
      </div>

      {/* 3. مشروعات متوقفة */}
      <div
        onClick={() => onFilterStatus?.('متوقف')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-red-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 group-hover:text-red-700 transition-colors">
            مشروعات متوقفة
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums font-mono">
            {stats.paused}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-105 transition-transform">
          <PauseCircle className="w-6 h-6" />
        </div>
      </div>

      {/* 4. مشروعات مكتملة */}
      <div
        onClick={() => onFilterStatus?.('مكتمل')}
        className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
            مشروعات مكتملة
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums font-mono">
            {stats.completed}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-105 transition-transform">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* 5. نسبة الإنجاز الكلية (Leftmost in RTL) */}
      <div className="group bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex items-center justify-between col-span-2 sm:col-span-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">
            نسبة الإنجاز الكلية
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums font-mono">
              {stats.overallRate}%
            </span>
            <span className="inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              +{stats.rateGrowth}%
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
