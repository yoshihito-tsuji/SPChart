/**
 * 注意係数（Caution Index）の計算
 *
 * 生徒の注意係数 CS_i = (A - B) / (C - D × E)
 *   A: S曲線より左側の誤答に対応する問題の正答者数の和
 *   B: S曲線より右側の正答に対応する問題の正答者数の和
 *   C: S曲線より左側の問題の正答者数の和
 *   D: 生徒iの合計得点
 *   E: 全問題の正答者数の平均
 *
 * 問題の注意係数 CP_j: 生徒と問題の役割を入れ替えて同様に計算
 *
 * 分母が0の場合はnullを返す
 */

import type { SortedStudent, SortedProblem } from '../../types/sp';

interface CautionIndicesResult {
  /** 生徒ごとの注意係数（CS） */
  studentCautionIndices: (number | null)[];
  /** 問題ごとの注意係数（CP） */
  problemCautionIndices: (number | null)[];
}

/**
 * 生徒の注意係数（CS）を計算
 */
function computeStudentCautionIndex(
  studentIndex: number,
  sortedMatrix: number[][],
  sortedProblems: Pick<SortedProblem, 'correctCount'>[],
  studentScore: number,
  averageCorrectCount: number
): number | null {
  const problemCount = sortedProblems.length;

  // S曲線の位置 = 生徒の得点（左からscore個目まで）
  const sCurvePosition = studentScore;

  // A: S曲線より左側の誤答に対応する問題の正答者数の和
  let A = 0;
  for (let j = 0; j < sCurvePosition && j < problemCount; j++) {
    if (sortedMatrix[studentIndex][j] === 0) {
      // 誤答
      A += sortedProblems[j].correctCount;
    }
  }

  // B: S曲線より右側の正答に対応する問題の正答者数の和
  let B = 0;
  for (let j = sCurvePosition; j < problemCount; j++) {
    if (sortedMatrix[studentIndex][j] === 1) {
      // 正答
      B += sortedProblems[j].correctCount;
    }
  }

  // C: S曲線より左側の問題の正答者数の和
  let C = 0;
  for (let j = 0; j < sCurvePosition && j < problemCount; j++) {
    C += sortedProblems[j].correctCount;
  }

  // D: 生徒の合計得点
  const D = studentScore;

  // E: 全問題の正答者数の平均
  const E = averageCorrectCount;

  // 分母
  const denominator = C - D * E;

  // 分母が0の場合は計算不可
  if (denominator === 0) {
    return null;
  }

  // CS = (A - B) / (C - D × E)
  const CS = (A - B) / denominator;

  return CS;
}

/**
 * 問題の注意係数（CP）を計算
 * 生徒と問題の役割を入れ替えて計算
 */
function computeProblemCautionIndex(
  problemIndex: number,
  sortedMatrix: number[][],
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  problemCorrectCount: number,
  averageScore: number
): number | null {
  const studentCount = sortedStudents.length;

  // P曲線の位置 = 問題の正答者数（上からcorrectCount人目まで）
  const pCurvePosition = problemCorrectCount;

  // A: P曲線より上側の誤答に対応する生徒の得点の和
  let A = 0;
  for (let i = 0; i < pCurvePosition && i < studentCount; i++) {
    if (sortedMatrix[i][problemIndex] === 0) {
      // 誤答
      A += sortedStudents[i].totalScore;
    }
  }

  // B: P曲線より下側の正答に対応する生徒の得点の和
  let B = 0;
  for (let i = pCurvePosition; i < studentCount; i++) {
    if (sortedMatrix[i][problemIndex] === 1) {
      // 正答
      B += sortedStudents[i].totalScore;
    }
  }

  // C: P曲線より上側の生徒の得点の和
  let C = 0;
  for (let i = 0; i < pCurvePosition && i < studentCount; i++) {
    C += sortedStudents[i].totalScore;
  }

  // D: 問題の正答者数
  const D = problemCorrectCount;

  // E: 全生徒の得点の平均
  const E = averageScore;

  // 分母
  const denominator = C - D * E;

  // 分母が0の場合は計算不可
  if (denominator === 0) {
    return null;
  }

  // CP = (A - B) / (C - D × E)
  const CP = (A - B) / denominator;

  return CP;
}

/**
 * 全生徒・全問題の注意係数を計算
 */
export function computeCautionIndices(
  sortedMatrix: number[][],
  sortedStudents: Pick<SortedStudent, 'totalScore'>[],
  sortedProblems: Pick<SortedProblem, 'correctCount'>[]
): CautionIndicesResult {
  const studentCount = sortedStudents.length;
  const problemCount = sortedProblems.length;

  // 平均正答者数
  const totalCorrectCount = sortedProblems.reduce((sum, p) => sum + p.correctCount, 0);
  const averageCorrectCount = problemCount > 0 ? totalCorrectCount / problemCount : 0;

  // 平均得点
  const totalScore = sortedStudents.reduce((sum, s) => sum + s.totalScore, 0);
  const averageScore = studentCount > 0 ? totalScore / studentCount : 0;

  // 生徒ごとの注意係数
  const studentCautionIndices: (number | null)[] = sortedStudents.map((student, i) =>
    computeStudentCautionIndex(
      i,
      sortedMatrix,
      sortedProblems,
      student.totalScore,
      averageCorrectCount
    )
  );

  // 問題ごとの注意係数
  const problemCautionIndices: (number | null)[] = sortedProblems.map((problem, j) =>
    computeProblemCautionIndex(
      j,
      sortedMatrix,
      sortedStudents,
      problem.correctCount,
      averageScore
    )
  );

  return {
    studentCautionIndices,
    problemCautionIndices,
  };
}
