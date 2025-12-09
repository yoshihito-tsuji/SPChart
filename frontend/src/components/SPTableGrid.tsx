/**
 * S-P表グリッド表示コンポーネント
 */

import type { SPTableResult } from '../types/sp';
import { getCautionLevel } from '../types/sp';

interface SPTableGridProps {
  result: SPTableResult;
}

/**
 * 注意レベルに応じた背景色クラスを取得
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
 * セルの背景色クラスを取得
 */
function getCellBgClass(value: number, isLeftOfSCurve: boolean): string {
  if (value === 1) {
    // 正答
    return 'bg-blue-100';
  } else {
    // 誤答
    if (isLeftOfSCurve) {
      // S曲線より左側の誤答（要注意）
      return 'bg-orange-200';
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
            {/* 問題ID */}
            {sortedProblems.map((problem) => (
              <th
                key={problem.id}
                className={`
                  border border-gray-300 p-1 text-center min-w-[40px]
                  ${getCautionBgClass(problem.cautionIndex)}
                `}
                title={`${problem.id}\n正答者数: ${problem.correctCount}\n正答率: ${(problem.correctRate * 100).toFixed(1)}%\nCP: ${problem.cautionIndex?.toFixed(3) ?? '計算不可'}`}
              >
                {problem.id}
              </th>
            ))}
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
                return (
                  <td
                    key={j}
                    className={`
                      border border-gray-300 p-1 text-center
                      ${getCellBgClass(value, isLeftOfSCurve)}
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
