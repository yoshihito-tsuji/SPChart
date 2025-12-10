/**
 * CSVパーサーのテスト
 */

import { describe, it, expect } from 'vitest';
import { parseCSV } from './parseCSV';

describe('parseCSV', () => {
  describe('標準形式', () => {
    it('基本的なCSVをパースできる', () => {
      const csv = `,Q1,Q2,Q3
S1,1,1,0
S2,1,0,1
S3,0,0,0`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.studentIds).toEqual(['S1', 'S2', 'S3']);
      expect(result.data?.problemIds).toEqual(['Q1', 'Q2', 'Q3']);
      expect(result.data?.matrix).toEqual([
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ]);
    });

    it('空白セルを0として扱う', () => {
      const csv = `,Q1,Q2
S1,1,
S2,,1`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.matrix).toEqual([
        [1, 0],
        [0, 1],
      ]);
    });

    it('列数が足りない行を0で埋める', () => {
      const csv = `,Q1,Q2,Q3
S1,1,1,1
S2,1,0`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.matrix[1]).toEqual([1, 0, 0]);
    });
  });

  describe('○×形式', () => {
    it('○を1、×を0としてパースする', () => {
      const csv = `,Q1,Q2,Q3
S1,○,○,×
S2,○,×,○
S3,×,×,×`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.matrix).toEqual([
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
      ]);
      expect(result.format).toBe('mext');
    });

    it('全角・半角の○×を処理できる', () => {
      const csv = `,Q1,Q2,Q3,Q4
S1,○,◯,O,o
S2,×,✕,X,x`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.matrix).toEqual([
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ]);
    });
  });

  describe('エラーケース', () => {
    it('行数が足りない場合エラー', () => {
      const csv = `,Q1,Q2,Q3`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.error).toContain('少なくとも2行');
    });

    it('無効な値がある場合エラー', () => {
      const csv = `,Q1,Q2
S1,1,2`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.error).toContain('0, 1, ○, ×');
    });

    it('空のCSVはエラー', () => {
      const csv = '';

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
    });
  });

  describe('クォート対応', () => {
    it('クォートで囲まれた値を処理できる', () => {
      const csv = `,"問題1","問題2"
"生徒1",1,0
"生徒2",0,1`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.problemIds).toEqual(['問題1', '問題2']);
      expect(result.data?.studentIds).toEqual(['生徒1', '生徒2']);
    });

    it('クォート内のカンマを処理できる', () => {
      const csv = `,"Q1, Part A","Q2"
"Student, A",1,0`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.problemIds).toEqual(['Q1, Part A', 'Q2']);
      expect(result.data?.studentIds).toEqual(['Student, A']);
    });
  });

  describe('改行コード', () => {
    it('CRLFを処理できる', () => {
      const csv = `,Q1,Q2\r\nS1,1,0\r\nS2,0,1`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.studentIds).toEqual(['S1', 'S2']);
    });

    it('LFのみを処理できる', () => {
      const csv = `,Q1,Q2\nS1,1,0\nS2,0,1`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.data?.studentIds).toEqual(['S1', 'S2']);
    });
  });
});
