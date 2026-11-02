import React from 'react';
import { Bell, AlertTriangle, Info, Check, Plus } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsCardProps {
  alerts: AlertItem[];
  onAcknowledge: (id: string) => void;
  onOpenProjectByName?: (name: string) => void;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts,
  onAcknowledge,
  onOpenProjectByName
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {alerts.length} تنبيهات نشطة
        </span>
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
            أهم التنبيهات
          </h3>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Alerts List matching screenshot */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-around">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span>لا توجد تنبيهات جديدة، جميع المؤشرات ضمن الحدود المستهدفة.</span>
          </div>
        ) : (
          alerts.map(alert => {
            const isHigh = alert.severity === 'high';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className="group p-2.5 rounded-xl bg-[#f8fbff] hover:bg-[#eef5fc] border border-[#d0e2f5] transition-all flex items-center justify-between gap-3"
              >
                {/* Dismiss button on hover */}
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  title="تأكيد وقراءة التنبيه"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                {/* Alert Text */}
                <div
                  onClick={() => alert.projectName && onOpenProjectByName?.(alert.projectName)}
                  className="flex-1 text-right font-bold text-slate-800 text-xs sm:text-sm cursor-pointer hover:text-blue-700 transition-colors"
                >
                  {alert.title}
                </div>

                {/* Icon on Right matching screenshot */}
                <div className="shrink-0">
                  {isHigh && (
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shadow-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {isWarning && (
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200 shadow-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {!isHigh && !isWarning && (
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
