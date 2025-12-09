/**
 * 統計サマリ表示コンポーネント
 */

import type { SPTableResult } from '../types/sp';

interface StatsSummaryProps {
  result: SPTableResult;
}

export function StatsSummary({ result }: StatsSummaryProps) {
  const { summary, disparityCoefficient } = result;

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4">
      <h3 className="text-lg font-bold mb-4">統計サマリ</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 基本情報 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">生徒数</div>
          <div className="text-2xl font-bold">{summary.studentCount}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">問題数</div>
          <div className="text-2xl font-bold">{summary.problemCount}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">平均得点</div>
          <div className="text-2xl font-bold">
            {summary.averageScore.toFixed(1)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">平均正答率</div>
          <div className="text-2xl font-bold">
            {(summary.averageCorrectRate * 100).toFixed(1)}%
          </div>
        </div>

        {/* 差異係数 */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">差異係数 D*</div>
          <div className="text-2xl font-bold text-blue-700">
            {disparityCoefficient.toFixed(3)}
          </div>
        </div>

        {/* 注意係数による分類 */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">要注意生徒 (CS≥0.5)</div>
          <div className="text-2xl font-bold text-yellow-700">
            {summary.cautionStudentCount}名
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">特に注意生徒 (CS≥0.75)</div>
          <div className="text-2xl font-bold text-red-700">
            {summary.highCautionStudentCount}名
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">要注意問題 (CP≥0.5)</div>
          <div className="text-2xl font-bold text-yellow-700">
            {summary.cautionProblemCount}問
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2">凡例</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
            <span>正答</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border border-gray-300"></div>
            <span>S曲線左側の誤答（要復習）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
            <span>S曲線右側の誤答</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-gray-300"></div>
            <span>要注意 (≥0.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-gray-300"></div>
            <span>特に注意 (≥0.75)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
