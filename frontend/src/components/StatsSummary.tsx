/**
 * 統計サマリ表示コンポーネント
 */

import type { SPTableResult, SortedProblem } from '../types/sp';
import { getCautionLevel, type CautionLevel } from '../types/sp';

interface StatsSummaryProps {
  result: SPTableResult;
}

/**
 * 注意レベルに応じたバッジテキストを取得
 */
function getCautionBadgeText(level: CautionLevel): string {
  switch (level) {
    case 'critical':
      return '特に注意';
    case 'warning':
      return '要注意';
    default:
      return '正常';
  }
}

/**
 * 注意レベルに応じたバッジクラスを取得
 */
function getCautionBadgeClass(level: CautionLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-green-100 text-green-800';
  }
}

/**
 * 問題をCP降順でソート（nullは最後）
 */
function sortProblemsByCPDesc(problems: SortedProblem[]): SortedProblem[] {
  return [...problems].sort((a, b) => {
    // nullは最後に
    if (a.cautionIndex === null && b.cautionIndex === null) return 0;
    if (a.cautionIndex === null) return 1;
    if (b.cautionIndex === null) return -1;
    // CP降順
    return b.cautionIndex - a.cautionIndex;
  });
}

export function StatsSummary({ result }: StatsSummaryProps) {
  const { summary, disparityCoefficient, sortedProblems } = result;

  // CP降順でソートした問題リスト
  const problemsSortedByCP = sortProblemsByCPDesc(sortedProblems);

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

      {/* 問題一覧（CP降順） */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2">
          問題一覧 <span className="text-gray-500 font-normal">（CP降順）</span>
        </h4>
        <div className="overflow-auto max-h-[200px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-1 px-2">問題ID</th>
                <th className="text-right py-1 px-2">CP</th>
                <th className="text-right py-1 px-2">正答率</th>
                <th className="text-center py-1 px-2">状態</th>
              </tr>
            </thead>
            <tbody>
              {problemsSortedByCP.map((problem) => {
                const level = getCautionLevel(problem.cautionIndex);
                const badgeText = getCautionBadgeText(level);
                const badgeClass = getCautionBadgeClass(level);
                return (
                  <tr
                    key={problem.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    title={`${problem.id}: CP=${problem.cautionIndex?.toFixed(3) ?? '計算不可'}, 正答率=${(problem.correctRate * 100).toFixed(1)}%`}
                    tabIndex={0}
                  >
                    <td className="py-1 px-2 font-medium">{problem.id}</td>
                    <td className="py-1 px-2 text-right">
                      {problem.cautionIndex !== null
                        ? problem.cautionIndex.toFixed(3)
                        : '-'}
                    </td>
                    <td className="py-1 px-2 text-right">
                      {(problem.correctRate * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-center">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${badgeClass}`}
                      >
                        {badgeText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            <div className="w-4 h-4 bg-blue-200 border border-gray-300"></div>
            <span>逆転正答（低得点帯）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border border-gray-300"></div>
            <span>S曲線左側の誤答（要復習）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-gray-300"></div>
            <span>逆転誤答（高得点帯）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
            <span>S曲線右側の誤答</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-200 border border-gray-300"></div>
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
