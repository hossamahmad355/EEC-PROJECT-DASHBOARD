import React, { useState } from 'react';
import { X, UploadCloud, Check, File } from 'lucide-react';
import { Project, DocumentItem } from '../../types';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSubmit: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => Promise<void>;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSubmit
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '01');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('مخططات أوتوكاد');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('12.4 MB');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const proj = projects.find(p => p.id === projectId);
    setLoading(true);
    try {
      await onSubmit({
        title,
        projectName: proj?.name || 'مشروع غير محدد',
        category,
        fileSize: fileSize || '8.5 MB',
        fileType: fileName ? fileName.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF'
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-700 to-blue-700 text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold">رفع مستندات أو مخططات هندسية</h2>
            <UploadCloud className="w-5 h-5" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              المشروع المرتبط بالمستند
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان المستند أو المخطط *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="مثال: المخططات الإنشائية المعتمدة للأساسات"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تصنيف الوثيقة
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="مخططات أوتوكاد">مخططات أوتوكاد و Shop Drawings</option>
              <option value="جداول كميات">جداول كميات ومواصفات BOQ</option>
              <option value="عقود وضمانات">عقود وضمانات بنكية</option>
              <option value="مستخلصات">مستخلصات وفواتير معتمدة</option>
            </select>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-4 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                  if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
                }
              }}
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">
                {fileName ? fileName : 'انقر لاختيار ملف من جهازك أو اسحبه هنا'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                يدعم صيغ PDF, DWG, DXF, XLSX, ZIP (حتى 100 ميجابايت)
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'جاري الرفع...' : 'تأكيد رفع الملف'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
