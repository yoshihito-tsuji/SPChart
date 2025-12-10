/**
 * sp.ts の型定義と関数のテスト
 */

import { describe, it, expect } from 'vitest';
import { getCautionLevel, CAUTION_THRESHOLDS } from './sp';

describe('getCautionLevel', () => {
  describe('null値', () => {
    it('nullの場合は"unknown"を返す', () => {
      expect(getCautionLevel(null)).toBe('unknown');
    });
  });

  describe('正常範囲 (< 0.5)', () => {
    it('0の場合は"normal"を返す', () => {
      expect(getCautionLevel(0)).toBe('normal');
    });

    it('0.499の場合は"normal"を返す', () => {
      expect(getCautionLevel(0.499)).toBe('normal');
    });

    it('0.4999999の場合は"normal"を返す', () => {
      expect(getCautionLevel(0.4999999)).toBe('normal');
    });

    it('負の値の場合は"normal"を返す', () => {
      expect(getCautionLevel(-0.1)).toBe('normal');
      expect(getCautionLevel(-1)).toBe('normal');
    });
  });

  describe('要注意範囲 (0.5 ≤ x < 0.75)', () => {
    it('0.5（境界値）の場合は"warning"を返す', () => {
      expect(getCautionLevel(0.5)).toBe('warning');
    });

    it('0.5000001の場合は"warning"を返す', () => {
      expect(getCautionLevel(0.5000001)).toBe('warning');
    });

    it('0.6の場合は"warning"を返す', () => {
      expect(getCautionLevel(0.6)).toBe('warning');
    });

    it('0.749の場合は"warning"を返す', () => {
      expect(getCautionLevel(0.749)).toBe('warning');
    });

    it('0.7499999の場合は"warning"を返す', () => {
      expect(getCautionLevel(0.7499999)).toBe('warning');
    });
  });

  describe('特に注意範囲 (≥ 0.75)', () => {
    it('0.75（境界値）の場合は"critical"を返す', () => {
      expect(getCautionLevel(0.75)).toBe('critical');
    });

    it('0.7500001の場合は"critical"を返す', () => {
      expect(getCautionLevel(0.7500001)).toBe('critical');
    });

    it('0.8の場合は"critical"を返す', () => {
      expect(getCautionLevel(0.8)).toBe('critical');
    });

    it('1.0の場合は"critical"を返す', () => {
      expect(getCautionLevel(1.0)).toBe('critical');
    });

    it('1.0を超える値の場合も"critical"を返す', () => {
      expect(getCautionLevel(1.5)).toBe('critical');
      expect(getCautionLevel(2.0)).toBe('critical');
    });
  });

  describe('閾値定数の確認', () => {
    it('WARNING閾値は0.5', () => {
      expect(CAUTION_THRESHOLDS.WARNING).toBe(0.5);
    });

    it('CRITICAL閾値は0.75', () => {
      expect(CAUTION_THRESHOLDS.CRITICAL).toBe(0.75);
    });
  });
});
