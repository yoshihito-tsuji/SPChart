/**
 * SPChart - S-P表分析ツール
 */

import { useState, useCallback, useEffect } from 'react';
import type { RawTestData, SPTableResult } from './types/sp';
import { analyzeSPTable } from './core/sp';
import { FileUploader } from './components/FileUploader';
import { SampleDataSelector } from './components/SampleDataSelector';
import { SPTableGrid } from './components/SPTableGrid';
import { SPCurvesChart } from './components/SPCurvesChart';
import { StatsSummary } from './components/StatsSummary';
import { LoadingSkeleton } from './components/LoadingSkeleton';

type AppState = 'idle' | 'loading' | 'ready' | 'error';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [rawData, setRawData] = useState<RawTestData | null>(null);
  const [result, setResult] = useState<SPTableResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // データがロードされたら分析を実行
  useEffect(() => {
    if (!rawData) return;

    setState('loading');
    setError(null);

    // 非同期で計算（UIブロッキング回避）
    const timer = setTimeout(() => {
      try {
        const analysisResult = analyzeSPTable(rawData);
        setResult(analysisResult);
        setState('ready');
      } catch (e) {
        setError(e instanceof Error ? e.message : '分析中にエラーが発生しました');
        setState('error');
      }
    }, 50); // 最小限の遅延でスケルトン表示

    return () => clearTimeout(timer);
  }, [rawData]);

  const handleDataLoaded = useCallback((data: RawTestData) => {
    setRawData(data);
  }, []);

  const handleError = useCallback((errorMsg: string) => {
    setError(errorMsg);
    setState('error');
  }, []);

  const handleReset = useCallback(() => {
    setRawData(null);
    setResult(null);
    setError(null);
    setState('idle');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              SPChart - S-P表分析ツール
            </h1>
            {state !== 'idle' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* データ入力セクション */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <FileUploader
              onDataLoaded={handleDataLoaded}
              onError={handleError}
              disabled={state === 'loading'}
            />
            <div className="border-l border-gray-300 h-8 hidden md:block" />
            <SampleDataSelector
              onSelect={handleDataLoaded}
              disabled={state === 'loading'}
            />
          </div>
        </div>

        {/* エラー表示 */}
        {state === 'error' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <svg
                className="w-5 h-5"
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
              <span className="font-medium">エラー</span>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
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
            <p className="text-gray-600">
              CSVファイルをアップロードするか、サンプルデータを選択してください
            </p>
          </div>
        )}

        {/* ローディング状態 */}
        {state === 'loading' && <LoadingSkeleton />}

        {/* 結果表示 */}
        {state === 'ready' && result && (
          <div className="space-y-6">
            {/* 統計サマリ */}
            <StatsSummary result={result} />

            {/* S-P曲線グラフ */}
            <SPCurvesChart result={result} />

            {/* S-P表グリッド */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-bold mb-4">S-P表</h3>
              <SPTableGrid result={result} />
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          <p>
            SPChart - S-P表分析ツール |{' '}
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
            S-P表理論: 佐藤隆博 (1969) | 公立はこだて未来大学 辻研究室
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
