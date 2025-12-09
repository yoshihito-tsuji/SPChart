/**
 * S-P表の並べ替え処理
 *
 * 並べ替えルール（安定ソート）:
 * - 生徒: 得点降順 → 元インデックス昇順
 * - 問題: 正答者数降順 → 元インデックス昇順
 */

import type { RawTestData, SortedStudent, SortedProblem } from '../../types/sp';

interface SortResult {
  /** 並べ替え後の生徒一覧（注意係数は未計算） */
  sortedStudents: Omit<SortedStudent, 'cautionIndex'>[];
  /** 並べ替え後の問題一覧（注意係数は未計算） */
  sortedProblems: Omit<SortedProblem, 'cautionIndex'>[];
  /** 並べ替え後の行列 */
  sortedMatrix: number[][];
  /** 生徒の並べ替えインデックス（元インデックス → 新インデックス） */
  studentSortOrder: number[];
  /** 問題の並べ替えインデックス（元インデックス → 新インデックス） */
  problemSortOrder: number[];
}

/**
 * 生徒ごとの合計得点を計算
 */
function computeStudentScores(matrix: number[][]): number[] {
  return matrix.map(row => row.reduce((sum, val) => sum + val, 0));
}

/**
 * 問題ごとの正答者数を計算
 */
function computeProblemCorrectCounts(matrix: number[][]): number[] {
  if (matrix.length === 0) return [];
  const problemCount = matrix[0].length;
  const counts: number[] = new Array(problemCount).fill(0);

  for (const row of matrix) {
    for (let j = 0; j < problemCount; j++) {
      counts[j] += row[j];
    }
  }

  return counts;
}

/**
 * S-P表の並べ替えを実行
 */
export function sortTable(data: RawTestData): SortResult {
  const { studentIds, problemIds, matrix } = data;
  const studentCount = studentIds.length;
  const problemCount = problemIds.length;

  // 生徒ごとの得点を計算
  const studentScores = computeStudentScores(matrix);

  // 問題ごとの正答者数を計算
  const problemCorrectCounts = computeProblemCorrectCounts(matrix);

  // 生徒の並べ替え（得点降順 → 元インデックス昇順）
  const studentIndices = Array.from({ length: studentCount }, (_, i) => i);
  studentIndices.sort((a, b) => {
    const scoreDiff = studentScores[b] - studentScores[a]; // 降順
    if (scoreDiff !== 0) return scoreDiff;
    return a - b; // 元インデックス昇順（安定ソート）
  });

  // 問題の並べ替え（正答者数降順 → 元インデックス昇順）
  const problemIndices = Array.from({ length: problemCount }, (_, i) => i);
  problemIndices.sort((a, b) => {
    const countDiff = problemCorrectCounts[b] - problemCorrectCounts[a]; // 降順
    if (countDiff !== 0) return countDiff;
    return a - b; // 元インデックス昇順（安定ソート）
  });

  // 並べ替え後の行列を構築
  const sortedMatrix: number[][] = studentIndices.map(si =>
    problemIndices.map(pi => matrix[si][pi])
  );

  // 並べ替え後の生徒データ
  const sortedStudents: Omit<SortedStudent, 'cautionIndex'>[] = studentIndices.map((origIdx, newIdx) => ({
    id: studentIds[origIdx],
    originalIndex: origIdx,
    totalScore: studentScores[origIdx],
    responses: sortedMatrix[newIdx],
  }));

  // 並べ替え後の問題データ
  const sortedProblems: Omit<SortedProblem, 'cautionIndex'>[] = problemIndices.map(origIdx => ({
    id: problemIds[origIdx],
    originalIndex: origIdx,
    correctCount: problemCorrectCounts[origIdx],
    correctRate: studentCount > 0 ? problemCorrectCounts[origIdx] / studentCount : 0,
  }));

  return {
    sortedStudents,
    sortedProblems,
    sortedMatrix,
    studentSortOrder: studentIndices,
    problemSortOrder: problemIndices,
  };
}
