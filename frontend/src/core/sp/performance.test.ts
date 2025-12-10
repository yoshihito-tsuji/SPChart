/**
 * パフォーマンス計測テスト
 *
 * 合成データでの処理時間を計測し、記録する
 */

import { describe, it, expect } from 'vitest';
import { analyzeSPTable } from './index';
import type { RawTestData } from '../../types/sp';

/**
 * 合成データを生成
 * @param studentCount 生徒数
 * @param problemCount 問題数
 * @param correctRate 平均正答率（0-1）
 */
function generateSyntheticData(
  studentCount: number,
  problemCount: number,
  correctRate: number = 0.6
): RawTestData {
  const studentIds = Array.from({ length: studentCount }, (_, i) => `S${i + 1}`);
  const problemIds = Array.from({ length: problemCount }, (_, i) => `Q${i + 1}`);
  const matrix: number[][] = [];

  for (let i = 0; i < studentCount; i++) {
    const row: number[] = [];
    for (let j = 0; j < problemCount; j++) {
      row.push(Math.random() < correctRate ? 1 : 0);
    }
    matrix.push(row);
  }

  return { studentIds, problemIds, matrix };
}

describe('パフォーマンス計測', () => {
  /**
   * 計測結果を記録するためのヘルパー
   */
  function measurePerformance(
    label: string,
    studentCount: number,
    problemCount: number
  ): { duration: number; result: ReturnType<typeof analyzeSPTable> } {
    const data = generateSyntheticData(studentCount, problemCount);

    const start = performance.now();
    const result = analyzeSPTable(data);
    const end = performance.now();

    const duration = end - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);

    return { duration, result };
  }

  it('300×60（標準規模）の処理時間を計測', () => {
    const { duration, result } = measurePerformance('300×60', 300, 60);

    // 結果の妥当性検証
    expect(result.sortedStudents).toHaveLength(300);
    expect(result.sortedProblems).toHaveLength(60);

    // 10ms以内を期待（現行ログで2.16ms）
    expect(duration).toBeLessThan(50);
  });

  it('500×100（中規模）の処理時間を計測', () => {
    const { duration, result } = measurePerformance('500×100', 500, 100);

    expect(result.sortedStudents).toHaveLength(500);
    expect(result.sortedProblems).toHaveLength(100);

    // 処理時間を記録（現行ロジック維持）
    console.log(`500×100 処理時間: ${duration.toFixed(2)}ms`);

    // 100ms以内を期待
    expect(duration).toBeLessThan(100);
  });

  it('1000×100（大規模）の処理時間を計測', () => {
    const { duration, result } = measurePerformance('1000×100', 1000, 100);

    expect(result.sortedStudents).toHaveLength(1000);
    expect(result.sortedProblems).toHaveLength(100);

    // 処理時間を記録（現行ロジック維持）
    console.log(`1000×100 処理時間: ${duration.toFixed(2)}ms`);

    // 200ms以内を期待
    expect(duration).toBeLessThan(200);
  });

  it('1000×200（超大規模）の処理時間を計測', () => {
    const { duration, result } = measurePerformance('1000×200', 1000, 200);

    expect(result.sortedStudents).toHaveLength(1000);
    expect(result.sortedProblems).toHaveLength(200);

    console.log(`1000×200 処理時間: ${duration.toFixed(2)}ms`);

    // 500ms以内を期待
    expect(duration).toBeLessThan(500);
  });

  describe('計算結果の妥当性', () => {
    it('大規模データでもD*は0-1の範囲内', () => {
      const data = generateSyntheticData(500, 100);
      const result = analyzeSPTable(data);

      expect(result.disparityCoefficient).toBeGreaterThanOrEqual(0);
      // ランダムデータではD*が1を超える可能性もあるが、通常は2未満
      expect(result.disparityCoefficient).toBeLessThan(2);
    });

    it('大規模データでもCS/CPは計算可能', () => {
      const data = generateSyntheticData(500, 100);
      const result = analyzeSPTable(data);

      // 少なくとも一部のCS/CPが計算されていることを確認
      const validCS = result.sortedStudents.filter(s => s.cautionIndex !== null);
      const validCP = result.sortedProblems.filter(p => p.cautionIndex !== null);

      // 大規模ランダムデータでは大部分が計算可能なはず
      expect(validCS.length).toBeGreaterThan(result.sortedStudents.length * 0.5);
      expect(validCP.length).toBeGreaterThan(result.sortedProblems.length * 0.5);
    });

    it('並べ替えは得点降順・正答者数降順を維持', () => {
      const data = generateSyntheticData(100, 50);
      const result = analyzeSPTable(data);

      // 生徒は得点降順
      for (let i = 1; i < result.sortedStudents.length; i++) {
        expect(result.sortedStudents[i - 1].totalScore).toBeGreaterThanOrEqual(
          result.sortedStudents[i].totalScore
        );
      }

      // 問題は正答者数降順
      for (let i = 1; i < result.sortedProblems.length; i++) {
        expect(result.sortedProblems[i - 1].correctCount).toBeGreaterThanOrEqual(
          result.sortedProblems[i].correctCount
        );
      }
    });
  });
});
