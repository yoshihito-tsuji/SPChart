/**
 * 差異係数（Disparity Coefficient: D*）の計算
 *
 * D* = S曲線とP曲線の間の面積 / ランダム反応時の期待面積
 *
 * D* = 0: 完全なガットマン尺度（S曲線とP曲線が一致）
 * 値が大きいほど反応パターンの一貫性が低い
 */

import type { SortedStudent, SortedProblem } from '../../types/sp';

/**
 * S曲線とP曲線の間の面積（分離面積）を計算
 *
 * 分離面積 = Σ（S曲線より左側の誤答セル数）
 *          = Σ（期待正答なのに誤答したセル数）
 */
function computeSeparationArea(
  sortedMatrix: number[][],
  sortedStudents: Pick<SortedStudent, 'totalScore'>[]
): number {
  let separationArea = 0;

  for (let i = 0; i < sortedStudents.length; i++) {
    const score = sortedStudents[i].totalScore;

    // S曲線より左側（期待正答領域）で誤答したセル数をカウント
    for (let j = 0; j < score && j < sortedMatrix[i].length; j++) {
      if (sortedMatrix[i][j] === 0) {
        separationArea++;
      }
    }
  }

  return separationArea;
}

/**
 * ランダム反応時の期待分離面積を計算
 *
 * ランダム反応の場合、各セルが正答となる確率は全体の正答率に等しい
 * 期待分離面積 = Σ_i Σ_j (j < score_i のとき) × (1 - p_j)
 *
 * 簡易的な近似として:
 * 期待分離面積 ≈ Σ_i score_i × (1 - 平均正答率)
 */
function computeExpectedSeparationArea(
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  sortedProblems: Pick<SortedProblem, 'correctCount'>[]
): number {
  const studentCount = sortedStudents.length;
  const problemCount = sortedProblems.length;

  if (studentCount === 0 || problemCount === 0) return 0;

  // 各問題の正答率
  const problemCorrectRates = sortedProblems.map(p => p.correctCount / studentCount);

  let expectedArea = 0;

  for (let i = 0; i < studentCount; i++) {
    const score = sortedStudents[i].totalScore;

    // S曲線より左側の各問題について、誤答の期待値を加算
    for (let j = 0; j < score && j < problemCount; j++) {
      // 問題jで誤答する確率 = 1 - 正答率
      expectedArea += 1 - problemCorrectRates[j];
    }
  }

  return expectedArea;
}

/**
 * 差異係数（D*）を計算
 */
export function computeDisparityCoefficient(
  sortedMatrix: number[][],
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  sortedProblems: Pick<SortedProblem, 'correctCount'>[]
): number {
  const separationArea = computeSeparationArea(sortedMatrix, sortedStudents);
  const expectedArea = computeExpectedSeparationArea(sortedStudents, sortedProblems);

  // 期待面積が0の場合（全員満点または全員0点など）
  if (expectedArea === 0) {
    // 分離面積も0なら完全なガットマン尺度
    return separationArea === 0 ? 0 : 1;
  }

  return separationArea / expectedArea;
}
