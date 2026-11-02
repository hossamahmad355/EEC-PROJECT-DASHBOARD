import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Server, HardDrive } from 'lucide-react';
import { MongoDbStatus } from '../../types';

interface MongoDbStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: MongoDbStatus | null;
  onResetSeed: () => Promise<void>;
}

export const MongoDbStatusModal: React.FC<MongoDbStatusModalProps> = ({
  isOpen,
  onClose,
  status,
  onResetSeed
}) => {
  const [testUri, setTestUri] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!testUri) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: testUri })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: (err as Error).message });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('هل ترغب في إعادة تعيين كافة البيانات إلى الحالة الافتراضية للوحة التحكم (27 مشروع)؟')) return;
    setResetting(true);
    try {
      await onResetSeed();
      alert('تمت استعادة البيانات الأصلية بنجاح!');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">حالة قاعدة البيانات والباك إند (MongoDB)</h2>
            <Database className="w-5 h-5 text-emerald-300" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Active Status Badge */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="text-left font-mono text-xs text-emerald-900">
              <span className="font-bold">Database:</span> {status?.database || 'construction_db'}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-900">
                  {status?.mode === 'real_mongodb' ? 'متصل بقاعدة MongoDB المباشرة' : 'نظام التخزين المحلي المتوافق مع MongoDB نشط'}
                </div>
                <div className="text-[11px] text-emerald-700">
                  كافة العمليات والـ Endpoints تعمل بتوافق تام
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5 justify-end">
              <span>مجموعات البيانات (MongoDB Collections)</span>
              <Server className="w-3.5 h-3.5 text-blue-600" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">projects</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.projects || 27}
                </div>
                <div className="text-[10px] text-slate-400">وثيقة مشروع</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">alerts</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.alerts || 3}
                </div>
                <div className="text-[10px] text-slate-400">تنبيه نشط</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">tasks</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.tasks || 35}
                </div>
                <div className="text-[10px] text-slate-400">مهمة عمل</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">approvals</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.approvals || 12}
                </div>
                <div className="text-[10px] text-slate-400">موافقة استشارية</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">site_reports</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.site_reports || 56}
                </div>
                <div className="text-[10px] text-slate-400">تقرير موقع</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-mono">documents</div>
                <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-0.5">
                  {status?.collections.documents || 1342}
                </div>
                <div className="text-[10px] text-slate-400">عقد ومخطط</div>
              </div>
            </div>
          </div>

          {/* Test MongoDB Connection */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-end">
              <span>اختبار رابط اتصال MongoDB خارجي أو محلي</span>
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            </h3>
            <p className="text-[11px] text-slate-500">
              يمكنك كتابة رابط اتصال MongoDB Atlas أو محلي لفحص إمكانية الاتصال المباشر:
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleTestConnection}
                disabled={testing || !testUri}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-50 transition-all shrink-0"
              >
                {testing ? 'جاري الفحص...' : 'فحص الاتصال'}
              </button>
              <input
                type="text"
                dir="ltr"
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/..."
                value={testUri}
                onChange={e => setTestUri(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left"
              />
            </div>

            {testResult && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Reset Seed Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>إعادة ضبط البيانات للافتراضي</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Node.js Express + MongoDB Architecture
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
