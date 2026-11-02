import React from 'react';
import { Building2, Layers, PaintBucket, Cog, Hammer } from 'lucide-react';
import { ConstructionCategory } from '../types';

interface ConstructionStatusCardProps {
  categories: ConstructionCategory[];
}

export const ConstructionStatusCard: React.FC<ConstructionStatusCardProps> = ({ categories }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'concrete':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            {/* Triangular truss/beam concrete icon matching screenshot */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 22 22 22" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
          </div>
        );
      case 'masonry':
        return (
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            {/* Bricks / Masonry icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="4" rx="1" />
              <rect x="2" y="10" width="9" height="4" rx="1" />
              <rect x="13" y="10" width="9" height="4" rx="1" />
              <rect x="2" y="16" width="20" height="4" rx="1" />
            </svg>
          </div>
        );
      case 'finishing':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            {/* Paint roller / finishes icon */}
            <PaintBucket className="w-4 h-4" />
          </div>
        );
      case 'mep':
        return (
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            {/* Electromechanical cog icon */}
            <Cog className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
          </div>
        );
      default:
        return <Hammer className="w-4 h-4 text-slate-500" />;
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'concrete':
        return 'from-emerald-500 to-green-500';
      case 'masonry':
        return 'from-cyan-500 to-blue-500';
      case 'finishing':
        return 'from-amber-400 to-orange-500';
      case 'mep':
        return 'from-sky-400 to-blue-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span>موقف الإنشاءات</span>
        </h3>
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Building2 className="w-4 h-4" />
        </div>
      </div>

      {/* Categories Progress List */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-around">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between gap-2.5">
            {/* Percentage on Left in RTL */}
            <div className="w-12 text-left font-black text-slate-900 text-sm tabular-nums font-mono">
              {cat.rate}%
            </div>

            {/* Progress Bar in Center */}
            <div className="flex-1 max-w-[130px] sm:max-w-[160px] h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(cat.icon)} transition-all duration-700 shadow-sm`}
                style={{ width: `${cat.rate}%` }}
              />
            </div>

            {/* Label and Icon on Right in RTL */}
            <div className="flex items-center gap-2 text-right min-w-[110px] sm:min-w-[140px] justify-end">
              <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                {cat.name}
              </span>
              {getIcon(cat.icon)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
