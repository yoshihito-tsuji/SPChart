/**
 * S-P表コア計算モジュール
 */

export { sortTable } from './sortTable';
export { computeCurves } from './computeCurves';
export { computeCautionIndices } from './computeCautionIndices';
export { computeDisparityCoefficient } from './computeDisparityCoefficient';

import type {
  RawTestData,
  SPTableResult,
  SortedStudent,
  SortedProblem,
  SPTableSummary,
} from '../../types/sp';

import { sortTable } from './sortTable';
import { computeCurves } from './computeCurves';
import { computeCautionIndices } from './computeCautionIndices';
import { computeDisparityCoefficient } from './computeDisparityCoefficient';

/**
 * S-P表の完全な分析を実行
 */
export function analyzeSPTable(data: RawTestData): SPTableResult {
  // 1. 並べ替え
  const { sortedStudents: studentsWithoutCI, sortedProblems: problemsWithoutCI, sortedMatrix } =
    sortTable(data);

  // 2. 注意係数の計算
  const { studentCautionIndices, problemCautionIndices } = computeCautionIndices(
    sortedMatrix,
    studentsWithoutCI,
    problemsWithoutCI
  );

  // 3. 注意係数を付与
  const sortedStudents: SortedStudent[] = studentsWithoutCI.map((s, i) => ({
    ...s,
    cautionIndex: studentCautionIndices[i],
  }));

  const sortedProblems: SortedProblem[] = problemsWithoutCI.map((p, i) => ({
    ...p,
    cautionIndex: problemCautionIndices[i],
  }));

  // 4. 曲線の計算
  const curves = computeCurves(sortedStudents, sortedProblems);

  // 5. 差異係数の計算
  const disparityCoefficient = computeDisparityCoefficient(
    sortedMatrix,
    sortedStudents,
    sortedProblems
  );

  // 6. 統計サマリの作成
  const summary = computeSummary(sortedStudents, sortedProblems);

  return {
    sortedStudents,
    sortedProblems,
    sortedMatrix,
    curves,
    disparityCoefficient,
    summary,
  };
}

/**
 * 統計サマリを計算
 */
function computeSummary(
  sortedStudents: SortedStudent[],
  sortedProblems: SortedProblem[]
): SPTableSummary {
  const studentCount = sortedStudents.length;
  const problemCount = sortedProblems.length;

  // 平均得点
  const totalScore = sortedStudents.reduce((sum, s) => sum + s.totalScore, 0);
  const averageScore = studentCount > 0 ? totalScore / studentCount : 0;

  // 平均正答率
  const totalCorrectRate = sortedProblems.reduce((sum, p) => sum + p.correctRate, 0);
  const averageCorrectRate = problemCount > 0 ? totalCorrectRate / problemCount : 0;

  // 注意係数による分類（閾値: 0.5, 0.75）
  const WARNING_THRESHOLD = 0.5;
  const CRITICAL_THRESHOLD = 0.75;

  const cautionStudentCount = sortedStudents.filter(
    s => s.cautionIndex !== null && s.cautionIndex >= WARNING_THRESHOLD
  ).length;

  const highCautionStudentCount = sortedStudents.filter(
    s => s.cautionIndex !== null && s.cautionIndex >= CRITICAL_THRESHOLD
  ).length;

  const cautionProblemCount = sortedProblems.filter(
    p => p.cautionIndex !== null && p.cautionIndex >= WARNING_THRESHOLD
  ).length;

  const highCautionProblemCount = sortedProblems.filter(
    p => p.cautionIndex !== null && p.cautionIndex >= CRITICAL_THRESHOLD
  ).length;

  return {
    studentCount,
    problemCount,
    averageScore,
    averageCorrectRate,
    cautionStudentCount,
    highCautionStudentCount,
    cautionProblemCount,
    highCautionProblemCount,
  };
}
