/**
 * sortTable.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import { sortTable } from './sortTable';
import type { RawTestData } from '../../types/sp';

describe('sortTable', () => {
  describe('空データ', () => {
    it('生徒0人・問題0問の場合、空の結果を返す', () => {
      const data: RawTestData = {
        studentIds: [],
        problemIds: [],
        matrix: [],
      };

      const result = sortTable(data);

      expect(result.sortedStudents).toHaveLength(0);
      expect(result.sortedProblems).toHaveLength(0);
      expect(result.sortedMatrix).toHaveLength(0);
    });
  });

  describe('1人1問', () => {
    it('1人1問で正答の場合', () => {
      const data: RawTestData = {
        studentIds: ['S1'],
        problemIds: ['Q1'],
        matrix: [[1]],
      };

      const result = sortTable(data);

      expect(result.sortedStudents).toHaveLength(1);
      expect(result.sortedStudents[0].id).toBe('S1');
      expect(result.sortedStudents[0].totalScore).toBe(1);
      expect(result.sortedStudents[0].originalIndex).toBe(0);

      expect(result.sortedProblems).toHaveLength(1);
      expect(result.sortedProblems[0].id).toBe('Q1');
      expect(result.sortedProblems[0].correctCount).toBe(1);
      expect(result.sortedProblems[0].correctRate).toBe(1);
    });

    it('1人1問で誤答の場合', () => {
      const data: RawTestData = {
        studentIds: ['S1'],
        problemIds: ['Q1'],
        matrix: [[0]],
      };

      const result = sortTable(data);

      expect(result.sortedStudents[0].totalScore).toBe(0);
      expect(result.sortedProblems[0].correctCount).toBe(0);
      expect(result.sortedProblems[0].correctRate).toBe(0);
    });
  });

  describe('全0/全1', () => {
    it('全員全問正答の場合', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2'],
        matrix: [
          [1, 1],
          [1, 1],
          [1, 1],
        ],
      };

      const result = sortTable(data);

      // 全員同点なので元の順序を維持
      expect(result.sortedStudents.map(s => s.id)).toEqual(['S1', 'S2', 'S3']);
      expect(result.sortedStudents.every(s => s.totalScore === 2)).toBe(true);

      // 全問題同正答数なので元の順序を維持
      expect(result.sortedProblems.map(p => p.id)).toEqual(['Q1', 'Q2']);
      expect(result.sortedProblems.every(p => p.correctCount === 3)).toBe(true);
    });

    it('全員全問誤答の場合', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2'],
        matrix: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      };

      const result = sortTable(data);

      expect(result.sortedStudents.every(s => s.totalScore === 0)).toBe(true);
      expect(result.sortedProblems.every(p => p.correctCount === 0)).toBe(true);
    });
  });

  describe('安定ソート', () => {
    it('得点が同じ生徒は元のインデックス昇順', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2'],
        matrix: [
          [1, 0], // S1: 1点
          [0, 1], // S2: 1点
          [1, 0], // S3: 1点
        ],
      };

      const result = sortTable(data);

      // 同点なので元のインデックス順を維持
      expect(result.sortedStudents.map(s => s.id)).toEqual(['S1', 'S2', 'S3']);
      expect(result.sortedStudents.map(s => s.originalIndex)).toEqual([0, 1, 2]);
    });

    it('正答者数が同じ問題は元のインデックス昇順', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2'],
        problemIds: ['Q1', 'Q2', 'Q3'],
        matrix: [
          [1, 0, 1], // Q1:1, Q2:0, Q3:1
          [0, 1, 0], // Q1:1, Q2:1, Q3:1
        ],
      };

      const result = sortTable(data);

      // Q1, Q2, Q3 すべて正答者数1なので元の順序維持
      expect(result.sortedProblems.map(p => p.id)).toEqual(['Q1', 'Q2', 'Q3']);
    });

    it('生徒は得点降順でソート', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2', 'Q3'],
        matrix: [
          [0, 0, 1], // S1: 1点
          [1, 1, 1], // S2: 3点
          [1, 1, 0], // S3: 2点
        ],
      };

      const result = sortTable(data);

      // 得点降順: S2(3) > S3(2) > S1(1)
      expect(result.sortedStudents.map(s => s.id)).toEqual(['S2', 'S3', 'S1']);
      expect(result.sortedStudents.map(s => s.totalScore)).toEqual([3, 2, 1]);
    });

    it('問題は正答者数降順でソート', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2', 'Q3'],
        matrix: [
          [0, 1, 1], // Q1:0, Q2:1, Q3:1
          [1, 1, 1], // Q1:1, Q2:2, Q3:2
          [1, 1, 0], // Q1:2, Q2:3, Q3:2
        ],
      };

      const result = sortTable(data);

      // 正答者数降順: Q2(3) > Q1(2), Q3(2)
      // Q1とQ3は同数なので元のインデックス順: Q1, Q3
      expect(result.sortedProblems.map(p => p.id)).toEqual(['Q2', 'Q1', 'Q3']);
      expect(result.sortedProblems.map(p => p.correctCount)).toEqual([3, 2, 2]);
    });
  });

  describe('originalIndex保持', () => {
    it('並べ替え後もoriginalIndexは元の位置を示す', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2', 'S3'],
        problemIds: ['Q1', 'Q2', 'Q3'],
        matrix: [
          [0, 0, 0], // S1: 0点
          [1, 1, 1], // S2: 3点
          [1, 0, 0], // S3: 1点
        ],
      };

      const result = sortTable(data);

      // S2が先頭に来るが、originalIndexは元の1のまま
      const s2 = result.sortedStudents.find(s => s.id === 'S2');
      expect(s2?.originalIndex).toBe(1);

      const s1 = result.sortedStudents.find(s => s.id === 'S1');
      expect(s1?.originalIndex).toBe(0);

      const s3 = result.sortedStudents.find(s => s.id === 'S3');
      expect(s3?.originalIndex).toBe(2);
    });
  });

  describe('行列の並べ替え', () => {
    it('sortedMatrixは生徒・問題の並べ替えを反映する', () => {
      const data: RawTestData = {
        studentIds: ['S1', 'S2'],
        problemIds: ['Q1', 'Q2'],
        matrix: [
          [0, 1], // S1: Q1=0, Q2=1
          [1, 1], // S2: Q1=1, Q2=1
        ],
      };

      const result = sortTable(data);

      // 生徒: S2(2点) > S1(1点)
      // 問題: Q2(2人) > Q1(1人)
      // 並べ替え後: [[S2,Q2], [S2,Q1]], [[S1,Q2], [S1,Q1]]
      expect(result.sortedMatrix).toEqual([
        [1, 1], // S2: Q2=1, Q1=1
        [1, 0], // S1: Q2=1, Q1=0
      ]);
    });
  });
});
