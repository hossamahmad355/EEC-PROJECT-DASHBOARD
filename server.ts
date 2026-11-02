import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDb,
  getDbStatus,
  getDashboardStats,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getAlerts,
  acknowledgeAlert,
  addAlert,
  getExtracts,
  addExtract,
  getSiteReports,
  addSiteReport,
  getDocuments,
  addDocument,
  getTasks,
  getApprovals,
  getCalendarEvents,
  addCalendarEvent,
  toggleCalendarEvent,
  deleteCalendarEvent,
  getChatMessages,
  addChatMessage,
  testMongoConnection,
  resetDatabaseToSeed
} from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Endpoints
// Dashboard Summary Stats
app.get('/api/dashboard/stats', async (_req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { status, search } = req.query;
    const projects = await getProjects({
      status: status as string,
      search: search as string
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await addProject(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updated = await updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const success = await deleteProject(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Alerts API
app.get('/api/alerts', async (_req, res) => {
  try {
    const alerts = await getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = await addAlert(req.body);
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.put('/api/alerts/:id/acknowledge', async (req, res) => {
  try {
    const success = await acknowledgeAlert(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Payment Extractions API (المستخلصات)
app.get('/api/extracts', async (_req, res) => {
  try {
    const list = await getExtracts();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/extracts', async (req, res) => {
  try {
    const newExt = await addExtract(req.body);
    res.status(201).json(newExt);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Site Reports API
app.get('/api/site-reports', async (_req, res) => {
  try {
    const list = await getSiteReports();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/site-reports', async (req, res) => {
  try {
    const newReport = await addSiteReport(req.body);
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Documents API
app.get('/api/documents', async (_req, res) => {
  try {
    const docs = await getDocuments();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const newDoc = await addDocument(req.body);
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Tasks & Approvals API
app.get('/api/tasks', async (_req, res) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/approvals', async (_req, res) => {
  try {
    const approvals = await getApprovals();
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Project Calendar API (التقويم الشهري للمشروعات والمواعيد النهائية)
app.get('/api/calendar-events', async (req, res) => {
  try {
    const { month, projectId } = req.query;
    const events = await getCalendarEvents(month as string, projectId as string);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/calendar-events', async (req, res) => {
  try {
    const newEvent = await addCalendarEvent(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.put('/api/calendar-events/:id/toggle', async (req, res) => {
  try {
    const updated = await toggleCalendarEvent(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'الحدث غير موجود' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/calendar-events/:id', async (req, res) => {
  try {
    const success = await deleteCalendarEvent(req.params.id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Internal Project Chat API (دردشة المشروع الداخلية)
app.get('/api/chat-messages', async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ error: 'معرف المشروع مطلوب' });
    }
    const messages = await getChatMessages(projectId as string);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/chat-messages', async (req, res) => {
  try {
    const newMsg = await addChatMessage(req.body);
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// MongoDB Diagnostics & Configuration API
app.get('/api/db/status', (_req, res) => {
  res.json(getDbStatus());
});

app.post('/api/db/test', async (req, res) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ success: false, message: 'يرجى تقديم رابط اتصال MongoDB' });
  }
  const result = await testMongoConnection(uri);
  res.json(result);
});

app.post('/api/db/reset', async (_req, res) => {
  try {
    await resetDatabaseToSeed();
    res.json({ success: true, message: 'تمت استعادة البيانات الأصلية بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// Initialize database connection
initDb().catch(console.error);

// Vite middleware mounting for development / static serving for production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Egyptian Construction Management Server is running at http://localhost:${PORT}`);
  });
}

startServer();
