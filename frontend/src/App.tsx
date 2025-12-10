/**
 * SPChart - S-P表分析ツール
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { RawTestData, SPTableResult } from './types/sp';
import { analyzeSPTable } from './core/sp';
import { FileUploader } from './components/FileUploader';
import { SampleDataSelector } from './components/SampleDataSelector';
import { SPTableGrid } from './components/SPTableGrid';
import { SPCurvesChart, type SPCurvesChartHandle } from './components/SPCurvesChart';
import { StatsSummary } from './components/StatsSummary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ExportToolbar } from './components/ExportToolbar';
import { DataInputForm } from './components/DataInputForm';
import { HelpDialog } from './components/HelpDialog';
import { LanguageSwitch } from './components/LanguageSwitch';
import { generatePDF } from './utils/pdfExport';
import { logger, toError } from './utils/logger';
import { useLanguage } from './i18n/LanguageContext';

type AppState = 'idle' | 'loading' | 'ready' | 'error' | 'form';

function App() {
  const { t } = useLanguage();
  const [state, setState] = useState<AppState>('idle');
  const [rawData, setRawData] = useState<RawTestData | null>(null);
  const [result, setResult] = useState<SPTableResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // チャートとグリッドへの参照（PDF出力用）
  const chartRef = useRef<SPCurvesChartHandle>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // データがロードされたら分析を実行
  useEffect(() => {
    if (!rawData) return;

    setState('loading');
    setError(null);

    // 非同期で計算（UIブロッキング回避）
    const timer = setTimeout(() => {
      try {
        logger.info('S-P表分析を開始', {
          studentCount: rawData.studentIds.length,
          problemCount: rawData.problemIds.length,
        });
        const startTime = performance.now();
        const analysisResult = analyzeSPTable(rawData);
        const duration = performance.now() - startTime;
        logger.info('S-P表分析が完了', {
          duration: `${duration.toFixed(2)}ms`,
          disparityCoefficient: analysisResult.disparityCoefficient,
        });
        setResult(analysisResult);
        setState('ready');
      } catch (e) {
        const err = toError(e);
        logger.error('S-P表分析でエラー', err);
        setError(err.message || '分析中にエラーが発生しました');
        setState('error');
      }
    }, 50); // 最小限の遅延でスケルトン表示

    return () => clearTimeout(timer);
  }, [rawData]);

  const handleDataLoaded = useCallback((data: RawTestData) => {
    logger.info('データを読み込み', {
      studentCount: data.studentIds.length,
      problemCount: data.problemIds.length,
    });
    setRawData(data);
  }, []);

  const handleError = useCallback((errorMsg: string) => {
    logger.warn('ユーザー操作でエラー', { message: errorMsg });
    setError(errorMsg);
    setState('error');
  }, []);

  const handleReset = useCallback(() => {
    setRawData(null);
    setResult(null);
    setError(null);
    setState('idle');
  }, []);

  const handleShowForm = useCallback(() => {
    setState('form');
  }, []);

  const handleCancelForm = useCallback(() => {
    setState('idle');
  }, []);

  // PNG出力
  const handleExportPNG = useCallback(() => {
    chartRef.current?.downloadPNG();
  }, []);

  // PDF出力
  const handleExportPDF = useCallback(async () => {
    if (!result) return;

    try {
      logger.info('PDF出力を開始');
      await generatePDF({
        result,
        chartElement: chartContainerRef.current,
        gridElement: gridContainerRef.current,
      });
      logger.info('PDF出力が完了');
    } catch (e) {
      const err = toError(e);
      logger.error('PDF出力でエラー', err);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {t.appTitle}
            </h1>
            <div className="flex items-center gap-3">
              {(state !== 'idle' && state !== 'form') && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  {t.reset}
                </button>
              )}
              <LanguageSwitch />
              <button
                onClick={() => setIsHelpOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t.help}
                title={t.help}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* データ入力セクション（idle/error時のみ表示） */}
        {(state === 'idle' || state === 'error') && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 no-print">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <FileUploader
                onDataLoaded={handleDataLoaded}
                onError={handleError}
                disabled={false}
              />
              <div className="border-l border-gray-300 h-8 hidden md:block" />
              <SampleDataSelector
                onSelect={handleDataLoaded}
                disabled={false}
              />
              <div className="border-l border-gray-300 h-8 hidden md:block" />
              <button
                onClick={handleShowForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t.manualInput}
              </button>
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {state === 'error' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{t.error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
            <p className="mt-2 text-sm text-red-500">
              {t.tryOtherFile}
            </p>
          </div>
        )}

        {/* フォーム入力モード */}
        {state === 'form' && (
          <DataInputForm
            onDataLoaded={handleDataLoaded}
            onCancel={handleCancelForm}
          />
        )}

        {/* アイドル状態 */}
        {state === 'idle' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              {t.loadData}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {t.loadDataHint}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t.csvFormat}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t.maxSize}</span>
              </div>
            </div>
          </div>
        )}

        {/* ローディング状態 */}
        {state === 'loading' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-blue-700">{t.analyzing}</span>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* 結果表示 */}
        {state === 'ready' && result && (
          <div className="space-y-6">
            {/* エクスポートツールバー */}
            <div className="bg-white rounded-lg shadow-sm p-4 no-print">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-sm font-medium text-gray-700">{t.export}</h3>
                <ExportToolbar
                  result={result}
                  onExportPNG={handleExportPNG}
                  onExportPDF={handleExportPDF}
                />
              </div>
            </div>

            {/* 統計サマリ */}
            <StatsSummary result={result} />

            {/* S-P曲線グラフ */}
            <div ref={chartContainerRef}>
              <SPCurvesChart ref={chartRef} result={result} />
            </div>

            {/* S-P表グリッド */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-bold mb-4">{t.spTable}</h3>
              <div ref={gridContainerRef}>
                <SPTableGrid result={result} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-8 no-print">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>
            {t.appTitle} |{' '}
            <a
              href="https://github.com/yoshihito-tsuji/SPChart"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
          <p className="mt-1">
            {t.footerTheory} | {t.footerLab}
          </p>
        </div>
      </footer>

      {/* ヘルプダイアログ */}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
