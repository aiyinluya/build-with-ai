import React from 'react';
import { exportToCSV, exportToMarkdown } from '../utils/export';

export function ExportPanel() {
  const handleExportCSV = () => {
    exportToCSV();
  };

  const handleExportReport = () => {
    exportToMarkdown();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        📤 导出数据
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        将你的健康数据导出为文件，方便备份或分享
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleExportCSV}
          className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          📊 CSV 数据
        </button>
        <button
          onClick={handleExportReport}
          className="flex-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors"
        >
          📝 健康报告
        </button>
      </div>
    </div>
  );
}
