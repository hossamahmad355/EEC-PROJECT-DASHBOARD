import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TopKpiCards } from './components/TopKpiCards';
import { ConstructionStatusCard } from './components/ConstructionStatusCard';
import { MonthlyProgressChart } from './components/MonthlyProgressChart';
import { ProjectDonutChart } from './components/ProjectDonutChart';
import { QuickActionsCard } from './components/QuickActionsCard';
import { CurrentProjectsTable } from './components/CurrentProjectsTable';
import { AlertsCard } from './components/AlertsCard';
import { BottomSummaryCards } from './components/BottomSummaryCards';

// Modals
import { NewProjectModal } from './components/modals/NewProjectModal';
import { NewExtractionModal } from './components/modals/NewExtractionModal';
import { RecordProgressModal } from './components/modals/RecordProgressModal';
import { SiteReportModal } from './components/modals/SiteReportModal';
import { UploadDocModal } from './components/modals/UploadDocModal';
import { AllProjectsModal } from './components/modals/AllProjectsModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { MongoDbStatusModal } from './components/modals/MongoDbStatusModal';
import { SectionDataModal } from './components/modals/SectionDataModal';
import { ProjectCalendarModal } from './components/ProjectCalendarModal';
import { ProjectChatModal } from './components/modals/ProjectChatModal';
import { exportProjectsToPdf, exportSiteReportsToPdf } from './utils/pdfExport';
import { translations, Language } from './utils/translations';

import {
  Project,
  AlertItem,
  DashboardStats,
  MongoDbStatus,
  TaskItem,
  ApprovalItem,
  SiteReport,
  DocumentItem,
  QuickExtraction,
  CalendarEvent
} from './types';

// Default initial state matching the screenshot directly while loading
const defaultStats: DashboardStats = {
  totalProjects: 27,
  underExecution: 18,
  paused: 2,
  completed: 6,
  atRisk: 1,
  overallRate: 78,
  rateGrowth: 6,
  constructionCategories: [
    { id: 'cat-1', name: 'أعمال الخرسانات', rate: 86, color: '#22c55e', icon: 'concrete' },
    { id: 'cat-2', name: 'أعمال المباني', rate: 79, color: '#06b6d4', icon: 'masonry' },
    { id: 'cat-3', name: 'أعمال التشطيبات', rate: 62, color: '#f59e0b', icon: 'finishing' },
    { id: 'cat-4', name: 'الأعمال الكهروميكانيكية', rate: 58, color: '#38bdf8', icon: 'mep' }
  ],
  monthlyCurve: [
    { month: 'يونيو', rate: 42 },
    { month: 'يوليو', rate: 54 },
    { month: 'أغسطس', rate: 62 },
    { month: 'سبتمبر', rate: 70 },
    { month: 'أكتوبر', rate: 74 },
    { month: 'نوفمبر', rate: 78 }
  ],
  classification: {
    underExecution: { count: 18, percentage: 66.7 },
    completed: { count: 6, percentage: 22.2 },
    paused: { count: 2, percentage: 7.4 },
    atRisk: { count: 1, percentage: 3.7 }
  },
  tasksCount: 35,
  approvalsCount: 12,
  reportsCount: 56,
  documentsCount: 1342
};

export default function App() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);

  // Lists for bottom sections
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [reports, setReports] = useState<SiteReport[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Filter and search state
  const [lang, setLang] = useState<Language>('ar');
  const [activeFilter, setActiveFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewExtractionOpen, setIsNewExtractionOpen] = useState(false);
  const [isRecordProgressOpen, setIsRecordProgressOpen] = useState(false);
  const [isSiteReportOpen, setIsSiteReportOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [activeSectionModal, setActiveSectionModal] = useState<'tasks' | 'approvals' | 'reports' | 'documents' | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all initial data from backend API
  const loadDashboardData = async () => {
    try {
      const [statsRes, projectsRes, alertsRes, dbRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/projects'),
        fetch('/api/alerts'),
        fetch('/api/db/status')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        setDbStatus(dbData);
      }
    } catch (err) {
      console.warn('Backend API connection warning (running fallback):', err);
    }
  };

  // Load section detailed records and calendar events
  const loadSectionRecords = async () => {
    try {
      const [tRes, aRes, rRes, dRes, calRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/approvals'),
        fetch('/api/site-reports'),
        fetch('/api/documents'),
        fetch('/api/calendar-events')
      ]);
      if (tRes.ok) setTasks(await tRes.json());
      if (aRes.ok) setApprovals(await aRes.json());
      if (rRes.ok) setReports(await rRes.json());
      if (dRes.ok) setDocuments(await dRes.json());
      if (calRes.ok) setCalendarEvents(await calRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadSectionRecords();
  }, []);

  // Filter projects by status and search
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'الكل' || p.status === activeFilter;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  // Handlers for Quick Actions and CRUD operations
  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        showToast('✅ تم إنشاء المشروع وحفظه بنجاح في قاعدة بيانات MongoDB');
        await loadDashboardData();
      }
    } catch (err) {
      showToast('❌ حدث خطأ أثناء إنشاء المشروع');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showToast('✅ تم تحديث بيانات المشروع في MongoDB بنجاح');
        await loadDashboardData();
      }
    } catch (err) {
      showToast('❌ حدث خطأ أثناء التحديث');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('🗑️ تم حذف المشروع من قاعدة البيانات');
        await loadDashboardData();
      }
    } catch (err) {
      showToast('❌ حدث خطأ أثناء الحذف');
    }
  };

  const handleCreateExtraction = async (extractData: Omit<QuickExtraction, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/extracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractData)
      });
      if (res.ok) {
        showToast(`✅ تم اعتماد وإصدار المستخلص رقم ${extractData.extractionNumber} بنجاح`);
        await loadDashboardData();
      }
    } catch (err) {
      showToast('❌ تعذر إصدار المستخلص');
    }
  };

  const handleUpdateProgress = async (projectId: string, newProgress: number, preliminary?: number) => {
    await handleUpdateProject(projectId, {
      progress: newProgress,
      preliminaryHandover: preliminary
    });
  };

  const handleCreateSiteReport = async (reportData: Omit<SiteReport, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/site-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        showToast('✅ تم تسجيل وحفظ تقرير الموقع في سجلات MongoDB');
        await loadDashboardData();
        await loadSectionRecords();
      }
    } catch (err) {
      showToast('❌ تعذر حفظ التقرير');
    }
  };

  const handleUploadDocument = async (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      if (res.ok) {
        showToast('✅ تم رفع وتوثيق المستند الهندسي بنجاح');
        await loadDashboardData();
        await loadSectionRecords();
      }
    } catch (err) {
      showToast('❌ تعذر رفع المستند');
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}/acknowledge`, { method: 'PUT' });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
        showToast('تمت قراءة التنبيه وأرشفته');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCalendarEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const res = await fetch('/api/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        const created = await res.json();
        setCalendarEvents(prev => [...prev, created]);
        showToast('📅 تم حفظ الموعد الهندسي بنجاح في تقويم المشروعات');
      }
    } catch (err) {
      showToast('❌ تعذر حفظ الموعد بالتقويم');
    }
  };

  const handleToggleCalendarEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/calendar-events/${id}/toggle`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setCalendarEvents(prev => prev.map(e => e.id === id ? updated : e));
        showToast(updated.completed ? '✔️ تم تحديد الموعد كمكتمل' : '↩️ تم إلغاء اكتمال الموعد');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/calendar-events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCalendarEvents(prev => prev.filter(e => e.id !== id));
        showToast('🗑️ تم حذف الموعد من التقويم');
      }
    } catch (err) {
      showToast('❌ تعذر حذف الموعد');
    }
  };

  const handleResetDatabase = async () => {
    const res = await fetch('/api/db/reset', { method: 'POST' });
    if (res.ok) {
      await loadDashboardData();
      await loadSectionRecords();
      showToast('تمت استعادة كافة البيانات الافتراضية للوحة المشروعات');
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#eef5fc] text-slate-800 p-3 sm:p-4 md:p-6 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto w-full space-y-3.5">
        {/* 1. Header with branding, skyline, and controls */}
        <Header
          alerts={alerts}
          dbStatus={dbStatus}
          onOpenMongoModal={() => setIsMongoModalOpen(true)}
          onOpenCalendarModal={() => setIsCalendarOpen(true)}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          lang={lang}
          onToggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
        />

        {/* 2. Top 5 KPI Cards Row */}
        <TopKpiCards
          stats={stats}
          onFilterStatus={status => setActiveFilter(status)}
        />

        {/* Project Calendar & Upcoming Deadlines Strip */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-[0_3px_12px_rgba(20,70,140,0.06)] border border-[#d6e4f3] flex flex-wrap items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>فتح التقويم الشهري الكامل</span>
              <span className="font-mono text-[11px] bg-blue-500/50 px-1.5 py-0.2 rounded">نوفمبر 2026</span>
            </button>
            <span className="text-xs text-slate-500 hidden md:inline">
              متابعة مواعيد الاستلام الابتدائي، صب الخرسانات، واعتمادات الاستشاري
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {calendarEvents.slice(0, 3).map(ev => (
              <div
                key={ev.id}
                onClick={() => setIsCalendarOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#f8fbff] hover:bg-[#eef5fc] border border-[#cce0f5] text-xs font-bold cursor-pointer transition-all shrink-0"
              >
                <span className={`w-2 h-2 rounded-full ${
                  ev.type === 'deadline' ? 'bg-red-500' : ev.type === 'handover' ? 'bg-purple-500' : 'bg-emerald-500'
                }`} />
                <span className="text-slate-800 text-[11px]">{ev.title}</span>
                <span className="text-slate-400 font-mono text-[10px] tabular-nums">({ev.date.split('-').slice(1).join('/')})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Middle Section: 4 Equal Columns Grid matching the screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
          {/* Column 1 (Right in RTL): إجراءات سريعة */}
          <div className="h-full">
            <QuickActionsCard
              onNewProject={() => setIsNewProjectOpen(true)}
              onNewExtraction={() => setIsNewExtractionOpen(true)}
              onRecordProgress={() => setIsRecordProgressOpen(true)}
              onSiteReport={() => setIsSiteReportOpen(true)}
              onUploadDoc={() => setIsUploadDocOpen(true)}
            />
          </div>

          {/* Column 2 (Middle-Right in RTL): تصنيف المشروعات (Donut Chart) */}
          <div className="h-full">
            <ProjectDonutChart
              stats={stats}
              onSelectCategory={cat => setActiveFilter(cat)}
              activeFilter={activeFilter}
            />
          </div>

          {/* Column 3 (Middle-Left in RTL): منحنى تقدم المشروعات (شهري) */}
          <div className="h-full">
            <MonthlyProgressChart data={stats.monthlyCurve} />
          </div>

          {/* Column 4 (Left in RTL): موقف الإنشاءات */}
          <div className="h-full">
            <ConstructionStatusCard categories={stats.constructionCategories} />
          </div>
        </div>

        {/* Active Filter Indicator if user selected a status */}
        {activeFilter !== 'الكل' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-bold text-blue-900">
            <div className="flex items-center gap-2">
              <span>تصفية المشروعات المعروضة حسب الحالة:</span>
              <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{activeFilter}</span>
            </div>
            <button
              onClick={() => setActiveFilter('الكل')}
              className="text-blue-700 hover:text-blue-900 underline text-xs cursor-pointer"
            >
              عرض كافة المشروعات (27)
            </button>
          </div>
        )}

        {/* 4. Lower Section: Current Projects Table & Important Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Right in RTL (4 Cols): أهم التنبيهات */}
          <div className="lg:col-span-4 h-full">
            <AlertsCard
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onOpenProjectByName={name => {
                const found = projects.find(p => p.name.includes(name));
                if (found) setSelectedProject(found);
              }}
            />
          </div>

          {/* Left in RTL (8 Cols): المشروعات الجارية */}
          <div className="lg:col-span-8 h-full">
            <CurrentProjectsTable
              projects={filteredProjects}
              onViewAll={() => setIsAllProjectsOpen(true)}
              onSelectProject={project => setSelectedProject(project)}
              onExportPdf={() => exportProjectsToPdf(filteredProjects, 'تقرير قائمة المشروعات الهندسية - الشركة المصرية للمقاولات')}
              activeFilter={activeFilter}
            />
          </div>
        </div>

        {/* 5. Bottom Section: 4 KPI Cards (Tasks, Approvals, Reports, Documents) */}
        <BottomSummaryCards
          stats={stats}
          onOpenSection={section => {
            loadSectionRecords();
            setActiveSectionModal(section);
          }}
        />
      </div>

      {/* Footer Details */}
      <footer className="mt-6 pt-4 border-t border-slate-200/80 text-center text-xs text-slate-500 font-semibold flex flex-wrap items-center justify-between max-w-[1440px] mx-auto w-full gap-2">
        <div className="flex items-center gap-2">
          <span>نظام المتابعة الهندسية المتكامل v2.6</span>
          <span>•</span>
          <span className="font-mono text-slate-400">Node.js Express + React + MongoDB</span>
        </div>
        <div>
          جميع الحقوق محفوظة © {new Date().getFullYear()} الشركة المصرية الهندسية للمقاولات
        </div>
      </footer>

      {/* --- ALL INTERACTIVE MODALS --- */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      <NewExtractionModal
        isOpen={isNewExtractionOpen}
        onClose={() => setIsNewExtractionOpen(false)}
        projects={projects}
        onSubmit={handleCreateExtraction}
      />

      <RecordProgressModal
        isOpen={isRecordProgressOpen}
        onClose={() => setIsRecordProgressOpen(false)}
        projects={projects}
        onUpdateProgress={handleUpdateProgress}
      />

      <SiteReportModal
        isOpen={isSiteReportOpen}
        onClose={() => setIsSiteReportOpen(false)}
        projects={projects}
        onSubmit={handleCreateSiteReport}
      />

      <UploadDocModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        projects={projects}
        onSubmit={handleUploadDocument}
      />

      <AllProjectsModal
        isOpen={isAllProjectsOpen}
        onClose={() => setIsAllProjectsOpen(false)}
        projects={projects}
        onSelectProject={project => setSelectedProject(project)}
        onNewProject={() => setIsNewProjectOpen(true)}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        onOpenChat={proj => setChatProject(proj)}
      />

      <MongoDbStatusModal
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
        status={dbStatus}
        onResetSeed={handleResetDatabase}
      />

      <SectionDataModal
        isOpen={!!activeSectionModal}
        onClose={() => setActiveSectionModal(null)}
        section={activeSectionModal}
        tasks={tasks}
        approvals={approvals}
        reports={reports}
        documents={documents}
      />

      {isCalendarOpen && (
        <ProjectCalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          projects={projects}
          events={calendarEvents}
          onAddEvent={handleAddCalendarEvent}
          onToggleEvent={handleToggleCalendarEvent}
          onDeleteEvent={handleDeleteCalendarEvent}
        />
      )}

      {chatProject && (
        <ProjectChatModal
          isOpen={!!chatProject}
          onClose={() => setChatProject(null)}
          project={chatProject}
          currentUser={{ name: 'م. حسام أحمد', role: 'مدير عام المشروعات' }}
          onNewMessageNotify={msg => {
            showToast(`💬 رسالة جديدة في [${msg.projectId}]: ${msg.message.substring(0, 30)}...`);
          }}
        />
      )}
    </div>
  );
}
