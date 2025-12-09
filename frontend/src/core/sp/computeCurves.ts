/**
 * S曲線・P曲線の計算
 *
 * S曲線: 各生徒について、左から正答数分のセルを数えた位置を結ぶ階段状折れ線
 * P曲線: 各問題について、上から正答者数分のセルを数えた位置を結ぶ折れ線
 *
 * 座標は0-1に正規化して返す
 */

import type { CurvesData, CurvePoint, SortedStudent, SortedProblem } from '../../types/sp';

/**
 * S曲線を計算
 * 各生徒の正答数に基づく階段状の折れ線
 */
function computeSCurve(
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  problemCount: number
): CurvePoint[] {
  const studentCount = sortedStudents.length;
  if (studentCount === 0 || problemCount === 0) return [];

  const points: CurvePoint[] = [];

  // 開始点（左上）
  points.push({ x: 0, y: 0 });

  for (let i = 0; i < studentCount; i++) {
    const score = sortedStudents[i].totalScore;
    const y = i / studentCount; // 上からの位置（0-1）
    const x = score / problemCount; // 左からの位置（0-1）

    // 階段状に描画するため、まず横に移動
    points.push({ x, y });

    // 次に縦に移動（次の生徒の位置へ）
    const nextY = (i + 1) / studentCount;
    points.push({ x, y: nextY });
  }

  return points;
}

/**
 * P曲線を計算
 * 各問題の正答者数に基づく折れ線
 */
function computePCurve(
  sortedProblems: Pick<SortedProblem, 'correctCount'>[],
  studentCount: number
): CurvePoint[] {
  const problemCount = sortedProblems.length;
  if (studentCount === 0 || problemCount === 0) return [];

  const points: CurvePoint[] = [];

  // 開始点（左上）
  points.push({ x: 0, y: 0 });

  for (let j = 0; j < problemCount; j++) {
    const correctCount = sortedProblems[j].correctCount;
    const x = j / problemCount; // 左からの位置（0-1）
    const y = correctCount / studentCount; // 上からの位置（0-1）

    // 階段状に描画するため、まず縦に移動
    points.push({ x, y });

    // 次に横に移動（次の問題の位置へ）
    const nextX = (j + 1) / problemCount;
    points.push({ x: nextX, y });
  }

  return points;
}

/**
 * S曲線とP曲線を計算
 */
export function computeCurves(
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  sortedProblems: Pick<SortedProblem, 'correctCount'>[]
): CurvesData {
  const studentCount = sortedStudents.length;
  const problemCount = sortedProblems.length;

  return {
    sCurve: computeSCurve(sortedStudents, problemCount),
    pCurve: computePCurve(sortedProblems, studentCount),
  };
}
