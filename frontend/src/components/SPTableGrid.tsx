/**
 * S-P表グリッド表示コンポーネント
 */

import type { SPTableResult, SortedProblem } from '../types/sp';
import { getCautionLevel, type CautionLevel } from '../types/sp';

interface SPTableGridProps {
  result: SPTableResult;
}

/**
 * 注意レベルに応じた背景色クラスを取得（ヘッダー用）
 * WCAGコントラスト確保: Amber/Red + text-slate-900
 */
function getHeaderCautionBgClass(level: CautionLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-red-200';
    case 'warning':
      return 'bg-amber-200';
    case 'unknown':
      return 'bg-gray-200';
    default:
      return 'bg-gray-50';
  }
}

/**
 * 注意レベルに応じた背景色クラスを取得（セル用）
 */
function getCautionBgClass(cautionIndex: number | null): string {
  const level = getCautionLevel(cautionIndex);
  switch (level) {
    case 'critical':
      return 'bg-red-200';
    case 'warning':
      return 'bg-yellow-200';
    case 'unknown':
      return 'bg-gray-200';
    default:
      return '';
  }
}

/**
 * 注意レベルに応じたバッジテキストを取得
 */
function getCautionBadgeText(level: CautionLevel): string {
  switch (level) {
    case 'critical':
      return '特注';
    case 'warning':
      return '注意';
    default:
      return '';
  }
}

/**
 * 注意レベルに応じたバッジクラスを取得
 * コンパクトなバッジスタイル（rounded-full, focus-visible対応）
 */
function getCautionBadgeClass(level: CautionLevel): string {
  const baseClass = 'text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400';
  switch (level) {
    case 'critical':
      return `${baseClass} bg-red-500 text-white`;
    case 'warning':
      return `${baseClass} bg-amber-500 text-white`;
    default:
      return '';
  }
}

/**
 * 問題ヘッダーのツールチップテキストを生成
 */
function getProblemTooltip(problem: SortedProblem): string {
  const cpText = problem.cautionIndex !== null
    ? `CP=${problem.cautionIndex.toFixed(2)}`
    : 'CP=計算不可';
  const rateText = `正答率=${(problem.correctRate * 100).toFixed(0)}%`;
  const level = getCautionLevel(problem.cautionIndex);
  const statusText = level === 'critical' ? '【特に注意】'
    : level === 'warning' ? '【要注意】'
    : '';
  return `${problem.id}\n${cpText}, ${rateText}\n${statusText}`.trim();
}

/**
 * セルの背景色クラスを取得
 * 逆転セル（高得点帯の誤答、低得点帯の正答）は淡色ハイライト
 * 既存の注意ハイライトより弱い色で視認性を損ねない
 */
function getCellBgClass(
  value: number,
  isLeftOfSCurve: boolean,
  isAbovePCurve: boolean
): string {
  if (value === 1) {
    // 正答
    if (!isAbovePCurve) {
      // P曲線より下（低得点帯）の正答 = 逆転（ラッキー正答）
      return 'bg-blue-50';
    }
    return 'bg-blue-100';
  } else {
    // 誤答
    if (isLeftOfSCurve) {
      // S曲線より左側の誤答（要注意） - 優先度高
      return 'bg-orange-200';
    } else if (isAbovePCurve) {
      // P曲線より上（高得点帯）の誤答 = 逆転（意外な誤答）- 薄色
      return 'bg-red-50';
    } else {
      // S曲線より右側の誤答（期待通り）
      return 'bg-gray-100';
    }
  }
}

export function SPTableGrid({ result }: SPTableGridProps) {
  const { sortedStudents, sortedProblems, sortedMatrix } = result;

  return (
    <div className="overflow-auto max-h-[600px] border border-gray-300 rounded-lg">
      <table className="border-collapse text-sm">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            {/* 左上角のセル */}
            <th className="border border-gray-300 p-1 bg-gray-50 sticky left-0 z-20">
              生徒＼問題
            </th>
            {/* 問題ID + CPバッジ */}
            {sortedProblems.map((problem) => {
              const level = getCautionLevel(problem.cautionIndex);
              const badgeText = getCautionBadgeText(level);
              const badgeClass = getCautionBadgeClass(level);
              const headerBgClass = getHeaderCautionBgClass(level);
              return (
                <th
                  key={problem.id}
                  className={`
                    border border-gray-300 p-1 text-center min-w-[40px] text-slate-900
                    ${headerBgClass}
                  `}
                  title={getProblemTooltip(problem)}
                  tabIndex={0}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{problem.id}</span>
                    {badgeText && (
                      <span
                        className={badgeClass}
                        tabIndex={0}
                      >
                        {badgeText}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
            {/* 得点列 */}
            <th className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20">
              得点
            </th>
            {/* CS列 */}
            <th className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20">
              CS
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, i) => (
            <tr key={student.id}>
              {/* 生徒ID */}
              <td
                className={`
                  border border-gray-300 p-1 font-medium sticky left-0 bg-white z-10
                  ${getCautionBgClass(student.cautionIndex)}
                `}
              >
                {student.id}
              </td>
              {/* 回答セル */}
              {sortedMatrix[i].map((value, j) => {
                const isLeftOfSCurve = j < student.totalScore;
                const problem = sortedProblems[j];
                // P曲線より上 = この生徒の順位がこの問題の正答者数より小さい
                const isAbovePCurve = i < problem.correctCount;
                return (
                  <td
                    key={j}
                    className={`
                      border border-gray-300 p-1 text-center
                      ${getCellBgClass(value, isLeftOfSCurve, isAbovePCurve)}
                    `}
                  >
                    {value}
                  </td>
                );
              })}
              {/* 得点 */}
              <td className="border border-gray-300 p-1 text-center font-medium bg-gray-50 sticky right-0 z-10">
                {student.totalScore}
              </td>
              {/* CS */}
              <td
                className={`
                  border border-gray-300 p-1 text-center sticky right-0 z-10
                  ${getCautionBgClass(student.cautionIndex)}
                `}
              >
                {student.cautionIndex !== null
                  ? student.cautionIndex.toFixed(3)
                  : '-'}
              </td>
            </tr>
          ))}
          {/* フッター行：正答者数とCP */}
          <tr className="sticky bottom-0 bg-white z-10">
            <td className="border border-gray-300 p-1 font-medium bg-gray-50 sticky left-0 z-20">
              正答者数
            </td>
            {sortedProblems.map(problem => (
              <td
                key={problem.id}
                className="border border-gray-300 p-1 text-center bg-gray-50"
              >
                {problem.correctCount}
              </td>
            ))}
            <td className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20" />
            <td className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20" />
          </tr>
          <tr className="sticky bottom-0 bg-white z-10">
            <td className="border border-gray-300 p-1 font-medium bg-gray-50 sticky left-0 z-20">
              CP
            </td>
            {sortedProblems.map(problem => (
              <td
                key={problem.id}
                className={`
                  border border-gray-300 p-1 text-center
                  ${getCautionBgClass(problem.cautionIndex)}
                `}
              >
                {problem.cautionIndex !== null
                  ? problem.cautionIndex.toFixed(3)
                  : '-'}
              </td>
            ))}
            <td className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20" />
            <td className="border border-gray-300 p-1 bg-gray-50 sticky right-0 z-20" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
