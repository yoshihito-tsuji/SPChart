/**
 * computeDisparityCoefficient.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import { computeDisparityCoefficient } from './computeDisparityCoefficient';

describe('computeDisparityCoefficient', () => {
  describe('空データ', () => {
    it('生徒0人・問題0問の場合、D*=0を返す', () => {
      const result = computeDisparityCoefficient([], [], []);
      expect(result).toBe(0);
    });
  });

  describe('1人1問', () => {
    it('1人1問で正答の場合、D*=0（完全Guttman）', () => {
      // S曲線位置=1、左側で誤答なし → 分離面積=0
      const sortedMatrix = [[1]];
      const sortedStudents = [{ totalScore: 1 }];
      const sortedProblems = [{ correctCount: 1 }];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // 期待面積 = 1 × (1 - 1) = 0 なので、分離面積も0ならD*=0
      expect(result).toBe(0);
    });

    it('1人1問で誤答の場合、D*=0', () => {
      // S曲線位置=0、左側の問題なし → 分離面積=0
      const sortedMatrix = [[0]];
      const sortedStudents = [{ totalScore: 0 }];
      const sortedProblems = [{ correctCount: 0 }];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      expect(result).toBe(0);
    });
  });

  describe('全0/全1', () => {
    it('全員全問正答の場合、D*=0', () => {
      const sortedMatrix = [
        [1, 1],
        [1, 1],
      ];
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 2 },
      ];
      const sortedProblems = [
        { correctCount: 2 },
        { correctCount: 2 },
      ];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // 全員満点で左側に誤答なし → 分離面積=0
      // 期待面積 = 2×(1-1) + 2×(1-1) = 0
      // D* = 0 / 0 → 0（特殊ケース）
      expect(result).toBe(0);
    });

    it('全員全問誤答の場合、D*=0', () => {
      const sortedMatrix = [
        [0, 0],
        [0, 0],
      ];
      const sortedStudents = [
        { totalScore: 0 },
        { totalScore: 0 },
      ];
      const sortedProblems = [
        { correctCount: 0 },
        { correctCount: 0 },
      ];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // 全員0点で左側の問題なし → 分離面積=0
      expect(result).toBe(0);
    });
  });

  describe('完全Guttmanパターン', () => {
    /**
     * 完全Guttmanパターン（理想的な累積分布）
     *
     *        Q1  Q2  Q3  得点
     * S1     1   1   1    3
     * S2     1   1   0    2
     * S3     1   0   0    1
     * 正答者  3   2   1
     */
    it('完全Guttmanパターンの場合、D*=0', () => {
      const sortedMatrix = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 0],
      ];
      const sortedStudents = [
        { totalScore: 3 },
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 3 },
        { correctCount: 2 },
        { correctCount: 1 },
      ];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // S曲線より左側で誤答なし → 分離面積=0 → D*=0
      expect(result).toBe(0);
    });
  });

  describe('逸脱パターン', () => {
    /**
     * 逸脱があるパターン
     *
     *        Q1  Q2  Q3  得点
     * S1     1   0   1    2   ← Q2で誤答（期待正答位置）
     * S2     1   1   0    2
     * S3     1   0   0    1
     * 正答者  3   1   1
     */
    it('逸脱がある場合、D*>0', () => {
      const sortedMatrix = [
        [1, 0, 1], // S1: 得点2、左側2問目で誤答
        [1, 1, 0], // S2: 得点2、逸脱なし
        [1, 0, 0], // S3: 得点1、逸脱なし
      ];
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 3 },
        { correctCount: 1 },
        { correctCount: 1 },
      ];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // S1: 左側2問(Q1,Q2)で誤答1つ(Q2) → 分離面積+=1
      // S2: 左側2問で誤答なし
      // S3: 左側1問で誤答なし
      // 分離面積 = 1

      // 期待分離面積の計算:
      // 問題の正答率: Q1=1, Q2=1/3, Q3=1/3
      // S1(score=2): (1-1) + (1-1/3) = 0 + 2/3 = 2/3
      // S2(score=2): (1-1) + (1-1/3) = 0 + 2/3 = 2/3
      // S3(score=1): (1-1) = 0
      // 期待面積 = 2/3 + 2/3 + 0 = 4/3

      // D* = 1 / (4/3) = 3/4 = 0.75
      expect(result).toBeCloseTo(0.75, 5);
    });

    /**
     * 最大逸脱パターン（逆Guttman）
     *
     *        Q1  Q2  Q3  得点
     * S1     0   0   1    1   ← 難問のみ正答
     * S2     0   1   0    1   ← 中問のみ正答
     * S3     1   0   0    1   ← 易問のみ正答
     * 正答者  1   1   1
     */
    it('大きな逸脱がある場合、D*が高くなる', () => {
      const sortedMatrix = [
        [0, 0, 1], // S1: 得点1、左側1問で誤答(Q1)
        [0, 1, 0], // S2: 得点1、左側1問で誤答(Q1)
        [1, 0, 0], // S3: 得点1、左側1問で正答
      ];
      const sortedStudents = [
        { totalScore: 1 },
        { totalScore: 1 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 1 },
        { correctCount: 1 },
        { correctCount: 1 },
      ];

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      // S1: 左側1問(Q1)で誤答 → 分離面積+=1
      // S2: 左側1問(Q1)で誤答 → 分離面積+=1
      // S3: 左側1問(Q1)で正答
      // 分離面積 = 2

      // 問題の正答率: すべて1/3
      // 各生徒(score=1): (1-1/3) = 2/3
      // 期待面積 = 2/3 × 3 = 2

      // D* = 2 / 2 = 1
      expect(result).toBeCloseTo(1, 5);
    });
  });

  describe('大規模データ', () => {
    it('100人×50問でもエラーなく計算できる', () => {
      const studentCount = 100;
      const problemCount = 50;

      // ランダムな回答パターンを生成
      const sortedMatrix: number[][] = [];
      const sortedStudents: { totalScore: number }[] = [];
      const sortedProblems: { correctCount: number }[] = new Array(problemCount)
        .fill(null)
        .map(() => ({ correctCount: 0 }));

      for (let i = 0; i < studentCount; i++) {
        const row: number[] = [];
        let score = 0;
        for (let j = 0; j < problemCount; j++) {
          const val = Math.random() > 0.5 ? 1 : 0;
          row.push(val);
          score += val;
          sortedProblems[j].correctCount += val;
        }
        sortedMatrix.push(row);
        sortedStudents.push({ totalScore: score });
      }

      const result = computeDisparityCoefficient(sortedMatrix, sortedStudents, sortedProblems);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
