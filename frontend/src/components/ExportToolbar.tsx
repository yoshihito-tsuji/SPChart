/**
 * エクスポートツールバーコンポーネント
 */

import type { SPTableResult } from '../types/sp';
import { exportToCSV, exportToJSON, downloadTextFile } from '../utils/export';

interface ExportToolbarProps {
  result: SPTableResult;
  onExportPNG?: () => void;
  onExportPDF?: () => void;
}

export function ExportToolbar({ result, onExportPNG, onExportPDF }: ExportToolbarProps) {
  const handleExportCSV = () => {
    const csv = exportToCSV(result);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(csv, `sp-table-${timestamp}.csv`, 'text/csv;charset=utf-8');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(result);
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(json, `sp-table-${timestamp}.json`, 'application/json');
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* PNG出力 */}
      {onExportPNG && (
        <button
          onClick={onExportPNG}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
          title="S-P曲線をPNG画像でダウンロード"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          曲線をPNG保存
        </button>
      )}

      {/* PDF出力 */}
      {onExportPDF && (
        <button
          onClick={onExportPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
          title="レポートをPDFでダウンロード"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDF出力
        </button>
      )}

      {/* CSV出力 */}
      <button
        onClick={handleExportCSV}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-md border border-green-200 transition-colors"
        title="結果をCSVでダウンロード（originalIndex含む）"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        CSV保存
      </button>

      {/* JSON出力 */}
      <button
        onClick={handleExportJSON}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors"
        title="結果をJSONでダウンロード（originalIndex含む）"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        JSON保存
      </button>
    </div>
  );
}
