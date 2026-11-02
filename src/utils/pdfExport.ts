import { Project, SiteReport } from '../types';

export function exportProjectsToPdf(projects: Project[], title: string = 'تقرير قائمة المشروعات الهندسية') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بفتح النوافذ المنبوذة (Popups) لتصدير ملف الـ PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; background: #ffffff; color: #1e293b; padding: 20px; margin: 0; }
          .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { font-size: 22px; color: #1e40af; margin: 0 0 5px 0; }
          .header h2 { font-size: 14px; color: #64748b; margin: 0; }
          .meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: right; }
          th { background-color: #1e40af; color: #ffffff; font-weight: 700; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; }
          .status-exec { background: #dcfce7; color: #15803d; }
          .status-paused { background: #fef9c3; color: #a16207; }
          .status-late { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: center;">
          <button onclick="window.print()" style="background: #1e40af; color: white; border: none; padding: 10px 20px; font-family: 'Cairo'; font-weight: bold; border-radius: 8px; cursor: pointer;">
            🖨️ طباعة المستند أو حفظ كـ PDF
          </button>
        </div>

        <div class="header">
          <h1>الشركة المصرية الهندسية للمقاولات</h1>
          <h2>${title}</h2>
        </div>

        <div class="meta">
          <div>تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}</div>
          <div>عدد المشروعات: ${projects.length} مشروعاً</div>
          <div>إدارة المشروعات الهندسية</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>الكود</th>
              <th>اسم المشروع</th>
              <th>الجهة المالكة</th>
              <th>الموقع</th>
              <th>نسبة الإنجاز</th>
              <th>الميزانية (ج.م)</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${p.code}</td>
                <td style="font-weight: bold;">${p.name}</td>
                <td>${p.client}</td>
                <td>${p.location}</td>
                <td style="font-family: monospace; font-weight: bold;">${p.progress}%</td>
                <td style="font-family: monospace;">${p.budget.toLocaleString('en-US')}</td>
                <td>
                  <span class="status-badge ${p.status === 'قيد التنفيذ' ? 'status-exec' : p.status === 'متوقف' ? 'status-paused' : 'status-late'}">
                    ${p.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          تم إنشاء هذا التقرير تلقائياً من نظام إدارة المشروعات الهندسية • جميع الحقوق محفوظة © ${new Date().getFullYear()}
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function exportSiteReportsToPdf(reports: SiteReport[], title: string = 'تقرير تقارير الموقع اليومية') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بفتح النوافذ المنبوذة (Popups) لتصدير ملف الـ PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; background: #ffffff; color: #1e293b; padding: 20px; margin: 0; }
          .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { font-size: 22px; color: #1e40af; margin: 0 0 5px 0; }
          .header h2 { font-size: 14px; color: #64748b; margin: 0; }
          .report-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #f8fafc; }
          .report-title { font-weight: bold; font-size: 14px; color: #1e40af; margin-bottom: 5px; }
          .report-meta { font-size: 11px; color: #64748b; margin-bottom: 8px; display: flex; gap: 15px; }
          .report-act { font-size: 12px; color: #334155; line-height: 1.6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: center;">
          <button onclick="window.print()" style="background: #1e40af; color: white; border: none; padding: 10px 20px; font-family: 'Cairo'; font-weight: bold; border-radius: 8px; cursor: pointer;">
            🖨️ طباعة تقارير الموقع أو حفظ كـ PDF
          </button>
        </div>

        <div class="header">
          <h1>الشركة المصرية الهندسية للمقاولات</h1>
          <h2>${title}</h2>
        </div>

        <div>
          ${reports.map(r => `
            <div class="report-card">
              <div class="report-title">${r.projectName}</div>
              <div class="report-meta">
                <span>التاريخ: ${r.date}</span>
                <span>المهندس: ${r.author}</span>
                <span>الطقس: ${r.weather}</span>
                <span>العمالة: ${r.manpowerCount} فني وعامل</span>
              </div>
              <div class="report-act"><strong>الأنشطة والأعمال المنجزة:</strong> ${r.activities}</div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          تم إنشاء هذا التقرير تلقائياً من نظام إدارة المشروعات الهندسية • جميع الحقوق محفوظة © ${new Date().getFullYear()}
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => { window.print(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
