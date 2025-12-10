/**
 * エクスポートユーティリティ
 */

import type { SPTableResult } from '../types/sp';

/**
 * EChartsインスタンスからPNG画像を取得
 */
export function getChartPNG(echartInstance: unknown): string | null {
  if (!echartInstance || typeof echartInstance !== 'object') return null;

  const instance = echartInstance as { getDataURL?: (opts: object) => string };
  if (typeof instance.getDataURL !== 'function') return null;

  return instance.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff',
  });
}

/**
 * 画像をダウンロード
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * S-P表結果をCSV形式に変換
 * originalIndexを含む
 */
export function exportToCSV(result: SPTableResult): string {
  const { sortedStudents, sortedProblems, sortedMatrix } = result;

  const lines: string[] = [];

  // ヘッダー行（問題ID + メタ情報）
  const headerRow = [
    '生徒ID',
    '元インデックス',
    ...sortedProblems.map(p => p.id),
    '得点',
    'CS',
  ];
  lines.push(headerRow.join(','));

  // 生徒データ行
  sortedStudents.forEach((student, i) => {
    const row = [
      student.id,
      String(student.originalIndex),
      ...sortedMatrix[i].map(String),
      String(student.totalScore),
      student.cautionIndex !== null ? student.cautionIndex.toFixed(4) : '',
    ];
    lines.push(row.join(','));
  });

  // 空行
  lines.push('');

  // 問題サマリ行
  lines.push('問題ID,元インデックス,正答者数,正答率,CP');
  sortedProblems.forEach(problem => {
    const row = [
      problem.id,
      String(problem.originalIndex),
      String(problem.correctCount),
      problem.correctRate.toFixed(4),
      problem.cautionIndex !== null ? problem.cautionIndex.toFixed(4) : '',
    ];
    lines.push(row.join(','));
  });

  // 空行
  lines.push('');

  // サマリ
  lines.push(`差異係数(D*),${result.disparityCoefficient.toFixed(4)}`);
  lines.push(`生徒数,${result.summary.studentCount}`);
  lines.push(`問題数,${result.summary.problemCount}`);
  lines.push(`平均得点,${result.summary.averageScore.toFixed(2)}`);
  lines.push(`平均正答率,${result.summary.averageCorrectRate.toFixed(4)}`);
  lines.push(`要注意生徒数,${result.summary.cautionStudentCount}`);
  lines.push(`特に注意生徒数,${result.summary.highCautionStudentCount}`);
  lines.push(`要注意問題数,${result.summary.cautionProblemCount}`);
  lines.push(`特に注意問題数,${result.summary.highCautionProblemCount}`);

  return lines.join('\n');
}

/**
 * S-P表結果をJSON形式に変換
 * originalIndexを含む
 */
export function exportToJSON(result: SPTableResult): string {
  const exportData = {
    students: result.sortedStudents.map(s => ({
      id: s.id,
      originalIndex: s.originalIndex,
      totalScore: s.totalScore,
      cautionIndex: s.cautionIndex,
      responses: s.responses,
    })),
    problems: result.sortedProblems.map(p => ({
      id: p.id,
      originalIndex: p.originalIndex,
      correctCount: p.correctCount,
      correctRate: p.correctRate,
      cautionIndex: p.cautionIndex,
    })),
    matrix: result.sortedMatrix,
    curves: {
      sCurve: result.curves.sCurve,
      pCurve: result.curves.pCurve,
    },
    statistics: {
      disparityCoefficient: result.disparityCoefficient,
      ...result.summary,
    },
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * テキストファイルをダウンロード
 */
export function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
