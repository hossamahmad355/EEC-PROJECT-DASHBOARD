import React, { useState } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Database,
  CheckCircle2,
  AlertTriangle,
  Building2,
  X
} from 'lucide-react';
import { AlertItem, MongoDbStatus } from '../types';

interface HeaderProps {
  alerts: AlertItem[];
  dbStatus: MongoDbStatus | null;
  onOpenMongoModal: () => void;
  onOpenCalendarModal: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  dbStatus,
  onOpenMongoModal,
  onOpenCalendarModal,
  onSearchChange,
  searchQuery
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="relative w-full rounded-2xl overflow-hidden shadow-[0_6px_24px_rgba(20,70,140,0.12)] border border-[#c4dcfa] bg-gradient-to-r from-[#17457e] via-[#1e589f] to-[#12396d] text-white">
      {/* Background Graphic Illustration - Skyline and Construction Cranes */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Construction Cranes */}
          <g stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
            {/* Crane Left */}
            <path d="M 180 120 L 180 15 L 260 25 M 180 15 L 120 40 M 180 35 L 230 35 M 240 25 L 240 60" />
            <line x1="170" y1="120" x2="190" y2="120" strokeWidth="3" />
            <line x1="180" y1="15" x2="200" y2="35" strokeDasharray="3 3" />
            <line x1="200" y1="35" x2="220" y2="15" strokeDasharray="3 3" />
            <line x1="220" y1="15" x2="240" y2="35" strokeDasharray="3 3" />

            {/* Crane Right */}
            <path d="M 980 120 L 980 10 L 1080 20 M 980 10 L 910 35 M 980 30 L 1050 30 M 1060 20 L 1060 70" />
            <line x1="970" y1="120" x2="990" y2="120" strokeWidth="3" />
            <line x1="980" y1="10" x2="1000" y2="30" strokeDasharray="3 3" />
            <line x1="1000" y1="30" x2="1020" y2="10" strokeDasharray="3 3" />
            <line x1="1020" y1="10" x2="1040" y2="30" strokeDasharray="3 3" />

            {/* Crane Center Left */}
            <path d="M 380 120 L 380 8 L 470 18 M 380 8 L 320 30 M 440 18 L 440 50" />

            {/* Crane Center Right */}
            <path d="M 800 120 L 800 12 L 880 22 M 800 12 L 750 32 M 860 22 L 860 65" />
          </g>

          {/* Architectural Skyline Silhouette */}
          <path
            d="M0,120 L0,95 L20,95 L20,70 L40,70 L40,95 L65,95 L65,60 L90,60 L90,100 L120,100 L120,50 L145,50 L145,100 L170,100 L170,40 L195,40 L195,100 L220,100 L220,65 L245,65 L245,105 L280,105 L280,45 L310,45 L310,100 L340,100 L340,75 L370,75 L370,105 L400,105 L400,55 L430,55 L430,100 L460,100 L460,35 L490,35 L490,105 L520,105 L520,70 L550,70 L550,100 L600,100 L600,40 L630,40 L630,105 L660,105 L660,60 L690,60 L690,100 L720,100 L720,50 L750,50 L750,105 L780,105 L780,75 L810,75 L810,100 L840,100 L840,45 L870,45 L870,105 L900,105 L900,60 L930,60 L930,100 L960,100 L960,35 L990,35 L990,105 L1020,105 L1020,65 L1050,65 L1050,100 L1080,100 L1080,50 L1110,50 L1110,105 L1140,105 L1140,70 L1170,70 L1170,100 L1200,100 L1200,120 Z"
            fill="#ffffff"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: User profile, Search, Notifications, Database Status */}
        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm text-sm"
              title="ملف المستخدم وإدارة النظام"
            >
              <div className="w-7 h-7 rounded-full bg-blue-400/30 flex items-center justify-center border border-white/30 text-white font-bold text-xs">
                م
              </div>
              <span className="font-semibold text-xs sm:text-sm">إدارة المشروعات</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-sm text-slate-900">م. حسام أحمد</div>
                  <div className="text-xs text-slate-500">مدير عام المشروعات الهندسية</div>
                  <div className="text-[11px] text-blue-600 font-medium mt-0.5">الشركة المصرية للمقاولات</div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenMongoModal();
                  }}
                  className="w-full text-right px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    حالة قاعدة البيانات (MongoDB)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    {dbStatus?.mode === 'real_mongodb' ? 'Mongo Live' : 'Active'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-white"
              title="التنبيهات والإشعارات"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#17457e] animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    التنبيهات الهامة ({unreadAlerts.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2 rounded-lg text-xs border ${
                        alert.severity === 'high'
                          ? 'bg-red-50/70 border-red-200 text-red-900'
                          : alert.severity === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-blue-50/70 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{alert.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                        <span>{alert.projectName}</span>
                        <span className="font-mono">{alert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/30 animate-in fade-in w-44 sm:w-60">
                <Search className="w-3.5 h-3.5 text-white/70 ml-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="بحث في المشروعات..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white text-xs placeholder-white/60 focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="text-white/60 hover:text-white mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-white"
                title="بحث سريع"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* MongoDB Connection Status Pill */}
          <button
            onClick={onOpenMongoModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs backdrop-blur-sm cursor-pointer"
            title="انقر لفحص والاتصال بقاعدة بيانات MongoDB"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[11px] font-medium text-emerald-100">
              {dbStatus?.mode === 'real_mongodb' ? 'MongoDB: متصل' : 'MongoDB Store: نشط'}
            </span>
          </button>
        </div>

        {/* Center: Main Dashboard Titles */}
        <div className="text-center flex-1 order-last sm:order-none py-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide drop-shadow-md text-white flex items-center justify-center gap-2">
            <span>إدارة المشروعات</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-blue-100/90 mt-0.5 tracking-tight flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>لوحة متابعة المشروعات - الشركة المصرية الهندسية للمقاولات</span>
          </p>
        </div>

        {/* Right Side: Current Date Badge & Project Calendar Trigger */}
        <div className="flex items-center">
          <button
            onClick={onOpenCalendarModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-all border border-white/25 backdrop-blur-md shadow-sm text-xs sm:text-sm font-bold text-white cursor-pointer active:scale-95 group"
            title="فتح التقويم الشهري ومتابعة المواعيد الهندسية النهائية"
          >
            <Calendar className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>الثلاثاء، 2 نوفمبر 2026</span>
            <span className="text-[10px] bg-blue-300/30 text-blue-100 px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 font-semibold border border-white/20">
              التقويم
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
