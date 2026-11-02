export type ProjectStatus = 'قيد التنفيذ' | 'مكتمل' | 'متوقف' | 'متأخر' | 'معرض للمخاطر';

export interface Project {
  _id?: string;
  id: string;
  code: string;
  name: string;
  category: 'أعمال خرسانية' | 'مباني وإنشاءات' | 'تشطيبات' | 'كهروميكانيك' | 'بنية تحتية';
  progress: number;
  preliminaryHandover: number;
  finalHandover: number;
  status: ProjectStatus;
  client: string;
  budget: number;
  spent: number;
  startDate: string;
  expectedEndDate: string;
  location: string;
  projectManager: string;
  consultant: string;
}

export interface AlertItem {
  id: string;
  title: string;
  projectName?: string;
  severity: 'high' | 'warning' | 'info';
  date: string;
  acknowledged?: boolean;
}

export interface MonthlyProgressPoint {
  month: string;
  rate: number;
}

export interface ConstructionCategory {
  id: string;
  name: string;
  rate: number;
  color: string;
  icon: 'concrete' | 'masonry' | 'finishing' | 'mep';
}

export interface QuickExtraction {
  id: string;
  projectId: string;
  projectName: string;
  extractionNumber: number;
  amount: number;
  period: string;
  status: 'معتمد' | 'تحت المراجعة' | 'مسودة';
  date: string;
}

export interface SiteReport {
  id: string;
  projectId: string;
  projectName: string;
  author: string;
  weather: string;
  manpowerCount: number;
  activities: string;
  date: string;
}

export interface TaskItem {
  id: string;
  title: string;
  projectName: string;
  assignee: string;
  dueDate: string;
  priority: 'عاجل' | 'متوسط' | 'عادي';
  status: 'قيد الانتظار' | 'جاري التنفيذ' | 'مكتملة';
}

export interface ApprovalItem {
  id: string;
  title: string;
  projectName: string;
  requester: string;
  submissionDate: string;
  status: 'معلقة' | 'تمت الموافقة' | 'مرفوضة';
}

export interface DocumentItem {
  id: string;
  title: string;
  projectName: string;
  category: 'مخططات أوتوكاد' | 'جداول كميات' | 'عقود وضمانات' | 'مستخلصات';
  fileSize: string;
  uploadDate: string;
  fileType: string;
}

export interface DashboardStats {
  totalProjects: number;
  underExecution: number;
  paused: number;
  completed: number;
  atRisk: number;
  overallRate: number;
  rateGrowth: number;
  constructionCategories: ConstructionCategory[];
  monthlyCurve: MonthlyProgressPoint[];
  classification: {
    underExecution: { count: number; percentage: number };
    completed: { count: number; percentage: number };
    paused: { count: number; percentage: number };
    atRisk: { count: number; percentage: number };
  };
  tasksCount: number;
  approvalsCount: number;
  reportsCount: number;
  documentsCount: number;
}

export interface MongoDbStatus {
  connected: boolean;
  mode: 'real_mongodb' | 'embedded_store';
  uri?: string;
  database: string;
  collections: {
    projects: number;
    alerts: number;
    tasks: number;
    approvals: number;
    site_reports: number;
    documents: number;
    extracts: number;
    calendar_events?: number;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  date: string;
  type: 'deadline' | 'inspection' | 'milestone' | 'handover';
  priority: 'عاجل' | 'متوسط' | 'عادي';
  description?: string;
  completed?: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
}
