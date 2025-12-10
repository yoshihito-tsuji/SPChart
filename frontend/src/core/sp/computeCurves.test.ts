/**
 * computeCurves.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import { computeCurves } from './computeCurves';

describe('computeCurves', () => {
  describe('空データ', () => {
    it('生徒0人の場合、空配列を返す', () => {
      const result = computeCurves([], [{ correctCount: 1 }]);

      expect(result.sCurve).toHaveLength(0);
      expect(result.pCurve).toHaveLength(0);
    });

    it('問題0問の場合、空配列を返す', () => {
      const result = computeCurves([{ totalScore: 1 }], []);

      expect(result.sCurve).toHaveLength(0);
      expect(result.pCurve).toHaveLength(0);
    });
  });

  describe('1人1問', () => {
    it('1人1問で正答の場合', () => {
      const result = computeCurves(
        [{ totalScore: 1 }],
        [{ correctCount: 1 }]
      );

      // S曲線: 開始点 + 2点（階段状）
      expect(result.sCurve.length).toBeGreaterThanOrEqual(1);
      // 最初の点は (0, 0)
      expect(result.sCurve[0]).toEqual({ x: 0, y: 0 });

      // P曲線: 開始点 + 2点（階段状）
      expect(result.pCurve.length).toBeGreaterThanOrEqual(1);
      expect(result.pCurve[0]).toEqual({ x: 0, y: 0 });
    });
  });

  describe('座標の正規化', () => {
    /**
     * 3人×3問のケース
     *
     *        Q1  Q2  Q3  得点
     * S1     1   1   1    3
     * S2     1   1   0    2
     * S3     1   0   0    1
     * 正答者  3   2   1
     */
    it('S曲線のX座標は得点/問題数で0-1に正規化される', () => {
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

      const result = computeCurves(sortedStudents, sortedProblems);

      // S曲線の横方向の位置は score / problemCount
      // S1: 3/3 = 1.0
      // S2: 2/3 ≈ 0.667
      // S3: 1/3 ≈ 0.333

      // 各生徒のX座標を確認
      const xCoords = result.sCurve.filter((_, i) => i > 0 && i % 2 === 1).map(p => p.x);
      expect(xCoords).toContain(1);
      expect(xCoords.some(x => Math.abs(x - 2/3) < 0.001)).toBe(true);
      expect(xCoords.some(x => Math.abs(x - 1/3) < 0.001)).toBe(true);
    });

    it('S曲線のY座標は生徒インデックス/生徒数で0-1に正規化される', () => {
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

      const result = computeCurves(sortedStudents, sortedProblems);

      // Y座標は 0, 1/3, 2/3, 1 のいずれか
      const yCoords = result.sCurve.map(p => p.y);
      expect(yCoords.every(y => y >= 0 && y <= 1)).toBe(true);
    });

    it('P曲線のX座標は問題インデックス/問題数で0-1に正規化される', () => {
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

      const result = computeCurves(sortedStudents, sortedProblems);

      // X座標は 0, 1/3, 2/3, 1 のいずれか
      const xCoords = result.pCurve.map(p => p.x);
      expect(xCoords.every(x => x >= 0 && x <= 1)).toBe(true);
    });

    it('P曲線のY座標は正答者数/生徒数で0-1に正規化される', () => {
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

      const result = computeCurves(sortedStudents, sortedProblems);

      // P曲線の縦方向の位置は correctCount / studentCount
      // Q1: 3/3 = 1.0
      // Q2: 2/3 ≈ 0.667
      // Q3: 1/3 ≈ 0.333

      const yCoords = result.pCurve.filter((_, i) => i > 0 && i % 2 === 1).map(p => p.y);
      expect(yCoords).toContain(1);
      expect(yCoords.some(y => Math.abs(y - 2/3) < 0.001)).toBe(true);
      expect(yCoords.some(y => Math.abs(y - 1/3) < 0.001)).toBe(true);
    });
  });

  describe('階段状の形状', () => {
    it('S曲線は階段状（水平→垂直の繰り返し）', () => {
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 2 },
        { correctCount: 1 },
      ];

      const result = computeCurves(sortedStudents, sortedProblems);

      // 階段状なので、連続する2点は x同じでy違う or y同じでx違う のどちらか
      for (let i = 1; i < result.sCurve.length; i++) {
        const prev = result.sCurve[i - 1];
        const curr = result.sCurve[i];

        // xが同じか、yが同じか
        const xSame = Math.abs(prev.x - curr.x) < 0.0001;
        const ySame = Math.abs(prev.y - curr.y) < 0.0001;

        expect(xSame || ySame).toBe(true);
      }
    });

    it('P曲線は階段状（垂直→水平の繰り返し）', () => {
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 2 },
        { correctCount: 1 },
      ];

      const result = computeCurves(sortedStudents, sortedProblems);

      for (let i = 1; i < result.pCurve.length; i++) {
        const prev = result.pCurve[i - 1];
        const curr = result.pCurve[i];

        const xSame = Math.abs(prev.x - curr.x) < 0.0001;
        const ySame = Math.abs(prev.y - curr.y) < 0.0001;

        expect(xSame || ySame).toBe(true);
      }
    });
  });

  describe('大規模データ', () => {
    it('100人×50問でもエラーなく計算できる', () => {
      const studentCount = 100;
      const problemCount = 50;

      const sortedStudents = Array.from({ length: studentCount }, () => ({
        totalScore: Math.floor(Math.random() * problemCount),
      }));
      const sortedProblems = Array.from({ length: problemCount }, () => ({
        correctCount: Math.floor(Math.random() * studentCount),
      }));

      const result = computeCurves(sortedStudents, sortedProblems);

      // S曲線: 開始点1 + 各生徒2点
      expect(result.sCurve.length).toBe(1 + studentCount * 2);

      // P曲線: 開始点1 + 各問題2点
      expect(result.pCurve.length).toBe(1 + problemCount * 2);

      // 全座標が0-1の範囲内
      result.sCurve.forEach(p => {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(1);
      });
    });
  });
});
