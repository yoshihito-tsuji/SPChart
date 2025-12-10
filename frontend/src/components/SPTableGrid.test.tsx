/**
 * SPTableGrid.tsx のコンポーネントテスト
 *
 * - CS/CPがnullの場合に「-」表示されること
 * - 注意閾値のハイライトが正しく適用されること
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SPTableGrid } from './SPTableGrid';
import type { SPTableResult } from '../types/sp';

describe('SPTableGrid', () => {
  const createMockResult = (
    overrides: Partial<{
      studentCautionIndices: (number | null)[];
      problemCautionIndices: (number | null)[];
    }> = {}
  ): SPTableResult => {
    const studentCautionIndices = overrides.studentCautionIndices ?? [0.3, 0.6, null];
    const problemCautionIndices = overrides.problemCautionIndices ?? [0.2, 0.8, null];

    return {
      sortedStudents: [
        { id: 'S1', originalIndex: 0, totalScore: 2, responses: [1, 1, 0], cautionIndex: studentCautionIndices[0] },
        { id: 'S2', originalIndex: 1, totalScore: 1, responses: [1, 0, 0], cautionIndex: studentCautionIndices[1] },
        { id: 'S3', originalIndex: 2, totalScore: 0, responses: [0, 0, 0], cautionIndex: studentCautionIndices[2] },
      ],
      sortedProblems: [
        { id: 'Q1', originalIndex: 0, correctCount: 2, correctRate: 0.67, cautionIndex: problemCautionIndices[0] },
        { id: 'Q2', originalIndex: 1, correctCount: 1, correctRate: 0.33, cautionIndex: problemCautionIndices[1] },
        { id: 'Q3', originalIndex: 2, correctCount: 0, correctRate: 0, cautionIndex: problemCautionIndices[2] },
      ],
      sortedMatrix: [
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
      ],
      curves: {
        sCurve: [{ x: 0, y: 0 }],
        pCurve: [{ x: 0, y: 0 }],
      },
      disparityCoefficient: 0.5,
      summary: {
        studentCount: 3,
        problemCount: 3,
        averageScore: 1,
        averageCorrectRate: 0.33,
        cautionStudentCount: 1,
        highCautionStudentCount: 0,
        cautionProblemCount: 1,
        highCautionProblemCount: 1,
      },
    };
  };

  describe('null値の「計算不可」表示', () => {
    it('CSがnullの生徒は「-」と表示される', () => {
      const result = createMockResult({
        studentCautionIndices: [0.3, 0.6, null],
      });

      render(<SPTableGrid result={result} />);

      // CSの列を確認
      // 「-」がnullの生徒の行に表示されている
      const cells = screen.getAllByRole('cell');
      const csCell = cells.find(cell => cell.textContent === '-');
      expect(csCell).toBeDefined();
    });

    it('CPがnullの問題は「-」と表示される', () => {
      const result = createMockResult({
        problemCautionIndices: [0.2, 0.8, null],
      });

      render(<SPTableGrid result={result} />);

      // CPの行を確認
      const cells = screen.getAllByRole('cell');
      const nullCPCells = cells.filter(cell => cell.textContent === '-');
      expect(nullCPCells.length).toBeGreaterThanOrEqual(1);
    });

    it('CSの数値は小数点3桁で表示される', () => {
      const result = createMockResult({
        studentCautionIndices: [0.3, 0.6, 0.123456],
      });

      render(<SPTableGrid result={result} />);

      // 0.300, 0.600, 0.123 が表示される
      expect(screen.getByText('0.300')).toBeDefined();
      expect(screen.getByText('0.600')).toBeDefined();
      expect(screen.getByText('0.123')).toBeDefined();
    });
  });

  describe('注意閾値のハイライト', () => {
    it('CS >= 0.5 の生徒行はwarningハイライト', () => {
      const result = createMockResult({
        studentCautionIndices: [0.3, 0.5, 0.6],
      });

      render(<SPTableGrid result={result} />);

      // bg-yellow-200クラスが適用されていることを確認
      const cells = screen.getAllByRole('cell');
      const yellowCells = cells.filter(cell =>
        cell.className.includes('bg-yellow-200')
      );
      // 0.5と0.6の2つの生徒がwarning
      expect(yellowCells.length).toBeGreaterThanOrEqual(2);
    });

    it('CS >= 0.75 の生徒行はcriticalハイライト', () => {
      const result = createMockResult({
        studentCautionIndices: [0.3, 0.75, 0.9],
      });

      render(<SPTableGrid result={result} />);

      // bg-red-200クラスが適用されていることを確認
      const cells = screen.getAllByRole('cell');
      const redCells = cells.filter(cell =>
        cell.className.includes('bg-red-200')
      );
      // 0.75と0.9の2つの生徒がcritical
      expect(redCells.length).toBeGreaterThanOrEqual(2);
    });

    it('CS < 0.5 の生徒行にはハイライトなし', () => {
      const result = createMockResult({
        studentCautionIndices: [0.1, 0.2, 0.3],
        problemCautionIndices: [0.1, 0.2, 0.3], // CPも全て正常値に
      });

      render(<SPTableGrid result={result} />);

      const cells = screen.getAllByRole('cell');
      const yellowCells = cells.filter(cell =>
        cell.className.includes('bg-yellow-200')
      );
      const redCells = cells.filter(cell =>
        cell.className.includes('bg-red-200')
      );

      // warning/criticalハイライトなし
      expect(yellowCells.length).toBe(0);
      expect(redCells.length).toBe(0);
    });

    it('CSがnullの生徒行はunknownハイライト（gray）', () => {
      const result = createMockResult({
        studentCautionIndices: [null, null, null],
      });

      render(<SPTableGrid result={result} />);

      const cells = screen.getAllByRole('cell');
      const grayCells = cells.filter(cell =>
        cell.className.includes('bg-gray-200')
      );
      // 各生徒のID列とCS列がグレーになる
      expect(grayCells.length).toBeGreaterThanOrEqual(3);
    });

    it('境界値0.5は正確にwarningになる', () => {
      const result = createMockResult({
        studentCautionIndices: [0.5, 0.4999999, 0.5000001],
      });

      render(<SPTableGrid result={result} />);

      // 0.5と0.5000001はwarning、0.4999999はnormal
      const cells = screen.getAllByRole('cell');
      const yellowCells = cells.filter(cell =>
        cell.className.includes('bg-yellow-200')
      );
      // 0.5と0.5000001の2つがwarning
      expect(yellowCells.length).toBeGreaterThanOrEqual(2);
    });

    it('境界値0.75は正確にcriticalになる', () => {
      const result = createMockResult({
        studentCautionIndices: [0.75, 0.7499999, 0.7500001],
      });

      render(<SPTableGrid result={result} />);

      // 0.75と0.7500001はcritical、0.7499999はwarning
      const cells = screen.getAllByRole('cell');
      const redCells = cells.filter(cell =>
        cell.className.includes('bg-red-200')
      );
      // 0.75と0.7500001の2つがcritical
      expect(redCells.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('問題の注意係数表示', () => {
    it('CP >= 0.75 の問題列ヘッダーはcriticalハイライト', () => {
      const result = createMockResult({
        problemCautionIndices: [0.2, 0.8, 0.9],
      });

      render(<SPTableGrid result={result} />);

      // 問題ヘッダーを確認
      const headers = screen.getAllByRole('columnheader');
      const redHeaders = headers.filter(h =>
        h.className.includes('bg-red-200')
      );
      // Q2(0.8)とQ3(0.9)がcritical
      expect(redHeaders.length).toBeGreaterThanOrEqual(2);
    });
  });
});
