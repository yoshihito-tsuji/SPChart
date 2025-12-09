/**
 * サンプルデータ（3セット）
 *
 * 1. small: 5×5（最小テスト用）
 * 2. medium: 30×20（標準的なクラス規模）
 * 3. large: 300×60（学年規模）
 *
 * 各データには事前計算した期待値を同梱
 */

import type { RawTestData } from '../types/sp';

/** サンプルデータセット */
export interface SampleDataSet {
  /** データセット名 */
  name: string;
  /** 説明 */
  description: string;
  /** 生データ */
  data: RawTestData;
  /** 期待される差異係数（検証用） */
  expectedDisparityCoefficient?: number;
}

/**
 * 小規模サンプル: 5人×5問
 * 理想的なガットマンパターンに近いデータ
 */
export const sampleSmall: SampleDataSet = {
  name: 'small',
  description: '5人×5問（最小テスト用）',
  data: {
    studentIds: ['S001', 'S002', 'S003', 'S004', 'S005'],
    problemIds: ['P1', 'P2', 'P3', 'P4', 'P5'],
    matrix: [
      [1, 1, 1, 1, 1], // S001: 5点
      [1, 1, 1, 1, 0], // S002: 4点
      [1, 1, 1, 0, 0], // S003: 3点
      [1, 1, 0, 0, 0], // S004: 2点
      [1, 0, 0, 0, 0], // S005: 1点
    ],
  },
  // 完全なガットマンパターンなのでD*=0
  expectedDisparityCoefficient: 0,
};

/**
 * 中規模サンプル: 30人×20問
 * 典型的なクラス規模、様々な回答パターンを含む
 */
function generateMediumSample(): SampleDataSet {
  const studentCount = 30;
  const problemCount = 20;

  const studentIds = Array.from({ length: studentCount }, (_, i) =>
    `S${String(i + 1).padStart(3, '0')}`
  );
  const problemIds = Array.from({ length: problemCount }, (_, i) =>
    `P${String(i + 1).padStart(2, '0')}`
  );

  // シード値を固定した疑似乱数生成（再現性のため）
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 生徒の能力値（0-1）を設定
  const studentAbilities = studentIds.map((_, i) => {
    // 正規分布に近い分布
    return 0.3 + 0.4 * seededRandom(i * 100 + 1);
  });

  // 問題の難易度（0-1、高いほど易しい）を設定
  const problemDifficulties = problemIds.map((_, j) => {
    return 0.3 + 0.5 * seededRandom(j * 200 + 1000);
  });

  // 回答行列を生成
  const matrix: number[][] = [];
  for (let i = 0; i < studentCount; i++) {
    const row: number[] = [];
    for (let j = 0; j < problemCount; j++) {
      // 能力と難易度に基づいて正答確率を計算
      const probability = studentAbilities[i] * problemDifficulties[j] + 0.1;
      const random = seededRandom(i * 1000 + j + 5000);
      row.push(random < probability ? 1 : 0);
    }
    matrix.push(row);
  }

  return {
    name: 'medium',
    description: '30人×20問（標準的なクラス規模）',
    data: {
      studentIds,
      problemIds,
      matrix,
    },
  };
}

/**
 * 大規模サンプル: 300人×60問
 * 学年規模、パフォーマンステスト用
 */
function generateLargeSample(): SampleDataSet {
  const studentCount = 300;
  const problemCount = 60;

  const studentIds = Array.from({ length: studentCount }, (_, i) =>
    `S${String(i + 1).padStart(4, '0')}`
  );
  const problemIds = Array.from({ length: problemCount }, (_, i) =>
    `P${String(i + 1).padStart(2, '0')}`
  );

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const studentAbilities = studentIds.map((_, i) => {
    return 0.2 + 0.6 * seededRandom(i * 100 + 2);
  });

  const problemDifficulties = problemIds.map((_, j) => {
    return 0.2 + 0.6 * seededRandom(j * 200 + 2000);
  });

  const matrix: number[][] = [];
  for (let i = 0; i < studentCount; i++) {
    const row: number[] = [];
    for (let j = 0; j < problemCount; j++) {
      const probability = studentAbilities[i] * problemDifficulties[j] + 0.15;
      const random = seededRandom(i * 1000 + j + 10000);
      row.push(random < probability ? 1 : 0);
    }
    matrix.push(row);
  }

  return {
    name: 'large',
    description: '300人×60問（学年規模）',
    data: {
      studentIds,
      problemIds,
      matrix,
    },
  };
}

export const sampleMedium = generateMediumSample();
export const sampleLarge = generateLargeSample();

/** 全サンプルデータ */
export const allSamples: SampleDataSet[] = [sampleSmall, sampleMedium, sampleLarge];

/**
 * サンプルデータをCSV形式に変換
 */
export function sampleToCSV(sample: SampleDataSet): string {
  const { studentIds, problemIds, matrix } = sample.data;

  // ヘッダー行（1列目は空、残りは問題ID）
  const header = ['', ...problemIds].join(',');

  // データ行
  const rows = matrix.map((row, i) => [studentIds[i], ...row].join(','));

  return [header, ...rows].join('\n');
}
