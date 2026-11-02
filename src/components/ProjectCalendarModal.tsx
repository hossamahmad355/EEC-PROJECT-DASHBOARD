import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ShieldCheck,
  Building2,
  Trash2,
  Filter,
  Check
} from 'lucide-react';
import { Project, CalendarEvent } from '../types';

interface ProjectCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  onToggleEvent: (id: string) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export const ProjectCalendarModal: React.FC<ProjectCalendarModalProps> = ({
  isOpen,
  onClose,
  projects,
  events,
  onAddEvent,
  onToggleEvent,
  onDeleteEvent
}) => {
  // Calendar month state: November 2026 (matching dashboard timestamp 2026-11-02)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDay, setSelectedDay] = useState<string>('2026-11-02');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // New event form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '01');
  const [newDate, setNewDate] = useState('2026-11-05');
  const [newType, setNewType] = useState<CalendarEvent['type']>('deadline');
  const [newPriority, setNewPriority] = useState<CalendarEvent['priority']>('عاجل');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthNamesArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysOfWeekArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10); // November
    setSelectedDay('2026-11-02');
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Pad days from previous month
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${m.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      days.push({ dayNumber: dayNum, dateStr, isCurrentMonth: false });
    }

    // Days in current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const m = (currentMonth + 1).toString().padStart(2, '0');
      const d = i.toString().padStart(2, '0');
      const dateStr = `${currentYear}-${m}-${d}`;
      days.push({ dayNumber: i, dateStr, isCurrentMonth: true });
    }

    // Pad remaining days of week
    const totalGridCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalGridCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${m.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      days.push({ dayNumber: i, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchProj = filterProject === 'all' || e.projectId === filterProject;
      const matchType = filterType === 'all' || e.type === filterType;
      return matchProj && matchType;
    });
  }, [events, filterProject, filterType]);

  // Map events to date strings
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  // Events for selected day
  const selectedDayEvents = eventsByDate[selectedDay] || [];

  // Summary counts for this month
  const currentMonthStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
  const monthEvents = filteredEvents.filter(e => e.date.startsWith(currentMonthStr));
  const deadlineCount = monthEvents.filter(e => e.type === 'deadline').length;
  const handoverCount = monthEvents.filter(e => e.type === 'handover').length;
  const inspectionCount = monthEvents.filter(e => e.type === 'inspection').length;

  // Handle create event
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const proj = projects.find(p => p.id === newProjectId);
    setIsSubmitting(true);
    try {
      await onAddEvent({
        title: newTitle,
        projectId: newProjectId,
        projectName: proj?.name || 'مشروع هندسي',
        date: newDate,
        type: newType,
        priority: newPriority,
        description: newDesc
      });
      setShowAddForm(false);
      setNewTitle('');
      setNewDesc('');
      setSelectedDay(newDate);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for styling event pills
  const getEventBadgeClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'handover':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inspection':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'milestone':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'handover':
        return <Flag className="w-3 h-3 text-purple-600 shrink-0" />;
      case 'deadline':
        return <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />;
      case 'inspection':
        return <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'milestone':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />;
    }
  };

  const getTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'handover': return 'استلام وتسليم';
      case 'deadline': return 'موعد نهائي تعاقدي';
      case 'inspection': return 'فحص ومطابقة موقعية';
      case 'milestone': return 'محطة إنجاز مرحلي';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#17457e] via-[#1e589f] to-[#12396d] text-white flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs text-blue-200 font-bold">إدارة الجداول الزمنية والمواعيد التعاقدية</div>
              <h2 className="text-base sm:text-lg font-bold">تقويم المشروعات الهندسي الشهري (Project Calendar)</h2>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Toolbar: Month Navigation & Filters */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="الشهر القادم"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 font-extrabold text-sm sm:text-base text-slate-900 font-mono flex items-center gap-1.5 min-w-[140px] justify-center bg-white rounded-lg border border-slate-200">
              <span>{monthNamesArabic[currentMonth]}</span>
              <span>{currentYear}</span>
            </div>

            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="الشهر السابق"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold bg-blue-100/70 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition-colors"
            >
              اليوم
            </button>
          </div>

          {/* Quick Metrics of Month */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              <AlertTriangle className="w-3 h-3" />
              <span>{deadlineCount} مواعيد نهائية</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              <Flag className="w-3 h-3" />
              <span>{handoverCount} تسليمات ومطابقات</span>
            </span>
            <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <ShieldCheck className="w-3 h-3" />
              <span>{inspectionCount} فحوصات موقعية</span>
            </span>
          </div>

          {/* Filter Dropdowns & Add Event Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterProject}
              onChange={e => setFilterProject(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">كافة المشروعات ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">كافة أنواع المواعيد</option>
              <option value="deadline">مواعيد نهائية (Deadlines)</option>
              <option value="handover">استلام وتسليم</option>
              <option value="inspection">فحوصات وصب خرسانة</option>
              <option value="milestone">محطات إنجاز</option>
            </select>

            <button
              onClick={() => {
                setNewDate(selectedDay || '2026-11-05');
                setShowAddForm(true);
              }}
              className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة موعد</span>
            </button>
          </div>
        </div>

        {/* Calendar Body: Grid View + Day Inspector Panel */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200">
          {/* Main Month Grid (8 columns on lg) */}
          <div className="lg:col-span-8 p-3 sm:p-4 overflow-x-auto">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 mb-2">
              {daysOfWeekArabic.map(day => (
                <div key={day} className="py-1 bg-slate-100 rounded-md">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((cell, idx) => {
                const isSelected = selectedDay === cell.dateStr;
                const isToday = cell.dateStr === '2026-11-02';
                const dayEventsList = eventsByDate[cell.dateStr] || [];

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDay(cell.dateStr)}
                    className={`min-h-[75px] sm:min-h-[90px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-300 shadow-sm'
                        : cell.isCurrentMonth
                        ? 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        : 'bg-slate-50/50 border-slate-100 text-slate-400'
                    }`}
                  >
                    {/* Top Row: Day Number and Today Indicator */}
                    <div className="flex items-center justify-between">
                      {isToday ? (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                          اليوم
                        </span>
                      ) : (
                        <span />
                      )}
                      <span
                        className={`text-xs font-mono font-bold tabular-nums ${
                          isToday
                            ? 'text-blue-700 font-black'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>

                    {/* Events Tags on this Day */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEventsList.slice(0, 2).map(ev => (
                        <div
                          key={ev.id}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate border flex items-center gap-1 ${getEventBadgeClass(
                            ev.type
                          )} ${ev.completed ? 'line-through opacity-60' : ''}`}
                          title={`${ev.title} (${ev.projectName})`}
                        >
                          {getEventIcon(ev.type)}
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}
                      {dayEventsList.length > 2 && (
                        <div className="text-[9px] font-bold text-slate-500 text-center">
                          +{dayEventsList.length - 2} مواعيد أخرى
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right/Side Panel: Selected Day Inspector & Upcoming Schedule (4 columns on lg) */}
          <div className="lg:col-span-4 p-4 bg-slate-50/80 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Selected Date Header */}
              <div className="pb-3 border-b border-slate-200 mb-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    setNewDate(selectedDay);
                    setShowAddForm(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>موعد بهذا اليوم</span>
                </button>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500">أجندة اليوم المحدد</div>
                  <div className="text-sm font-black text-slate-900 font-mono">{selectedDay}</div>
                </div>
              </div>

              {/* Events Scheduled on Selected Day */}
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>لا توجد مهام أو مواعيد نهائية مجدولة في هذا التاريخ.</p>
                  <button
                    onClick={() => {
                      setNewDate(selectedDay);
                      setShowAddForm(true);
                    }}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                  >
                    جدولة مهمة جديدة الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedDayEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all text-right space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleEvent(event.id)}
                            className={`p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 ${
                              event.completed ? 'text-emerald-600' : ''
                            }`}
                            title={event.completed ? 'إلغاء الإكمال' : 'تحديد كمكتمل'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(event.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="حذف الموعد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEventBadgeClass(
                            event.type
                          )}`}
                        >
                          {getTypeLabel(event.type)}
                        </span>
                      </div>

                      <div
                        className={`text-xs sm:text-sm font-extrabold text-slate-900 ${
                          event.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {event.title}
                      </div>

                      <div className="text-[11px] text-blue-700 font-bold flex items-center gap-1 justify-end">
                        <span>{event.projectName}</span>
                        <Building2 className="w-3 h-3 text-blue-500" />
                      </div>

                      {event.description && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-100">
                        <span className="font-bold text-amber-700">الأولوية: {event.priority}</span>
                        <span className="font-mono">{event.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tip for PM */}
            <div className="mt-4 p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
              💡 <strong>توجيه لمدير المشروع:</strong> مواعيد التسليمات الابتدائية تتطلب تجهيز محاضر الاستلام والمخططات المطابقة للواقع (As-Built) قبل الموعد بـ 7 أيام على الأقل.
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD EVENT MODAL DIALOG --- */}
      {showAddForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
            <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-sm">جدولة موعد هندسي أو موعد تسليم</h3>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الموعد أو المهمة *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: موعد صب خرسانة السقف أو الاستلام الابتدائي"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المشروع المرتبط
                </label>
                <select
                  value={newProjectId}
                  onChange={e => setNewProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تصنيف الموعد
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="deadline">موعد نهائي تعاقدي (Deadline)</option>
                    <option value="handover">استلام وتسليم ابتدائي/نهائي</option>
                    <option value="inspection">فحص موقعي واختبارات صب</option>
                    <option value="milestone">محطة إنجاز مرحلي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  درجة الأولوية
                </label>
                <div className="flex gap-2">
                  {(['عاجل', 'متوسط', 'عادي'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                        newPriority === p
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تفاصيل إضافية / توجيهات الاستشاري
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="ملاحظات فنية، عينات مطلوبة، أسماء أعضاء لجنة الفحص..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ الموعد بالتقويم'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
