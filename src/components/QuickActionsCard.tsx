import React from 'react';
import {
  Zap,
  Plus,
  FileCheck2,
  TrendingUp,
  FileSpreadsheet,
  UploadCloud
} from 'lucide-react';

interface QuickActionsCardProps {
  onNewProject: () => void;
  onNewExtraction: () => void;
  onRecordProgress: () => void;
  onSiteReport: () => void;
  onUploadDoc: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onNewProject,
  onNewExtraction,
  onRecordProgress,
  onSiteReport,
  onUploadDoc
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
        </div>
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
          إجراءات سريعة
        </h3>
      </div>

      {/* Action Buttons List */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        {/* Button 1: إنشاء مشروع جديد (Blue Gradient) */}
        <button
          onClick={onNewProject}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-between active:scale-[0.98]"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
          <span>إنشاء مشروع جديد</span>
        </button>

        {/* Button 2: إنشاء مستخلص (Purple Gradient) */}
        <button
          onClick={onNewExtraction}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-between active:scale-[0.98]"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <FileCheck2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span>إنشاء مستخلص</span>
        </button>

        {/* Button 3: تسجيل نسبة إنجاز */}
        <button
          onClick={onRecordProgress}
          className="w-full py-1.5 px-3 rounded-xl bg-[#f8fbff] hover:bg-[#eef5fc] border border-[#cce0f5] text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-between active:scale-[0.98]"
        >
          <div className="w-5 h-5 rounded-full bg-blue-100/60 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span>تسجيل نسبة إنجاز</span>
        </button>

        {/* Button 4: إضافة تقرير موقع */}
        <button
          onClick={onSiteReport}
          className="w-full py-1.5 px-3 rounded-xl bg-[#f8fbff] hover:bg-[#eef5fc] border border-[#cce0f5] text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-between active:scale-[0.98]"
        >
          <div className="w-5 h-5 rounded-full bg-blue-100/60 text-blue-700 flex items-center justify-center">
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </div>
          <span>إضافة تقرير موقع</span>
        </button>

        {/* Button 5: رفع مستندات المشروع */}
        <button
          onClick={onUploadDoc}
          className="w-full py-1.5 px-3 rounded-xl bg-[#f8fbff] hover:bg-[#eef5fc] border border-[#cce0f5] text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-between active:scale-[0.98]"
        >
          <div className="w-5 h-5 rounded-full bg-blue-100/60 text-blue-700 flex items-center justify-center">
            <UploadCloud className="w-3.5 h-3.5" />
          </div>
          <span>رفع مستندات المشروع</span>
        </button>
      </div>
    </div>
  );
};
