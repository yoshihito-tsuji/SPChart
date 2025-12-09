/**
 * S-P表 型定義
 */

/** CSV読込後の生データ */
export interface RawTestData {
  /** 生徒ID一覧（元の順序） */
  studentIds: string[];
  /** 問題ID一覧（元の順序） */
  problemIds: string[];
  /** 正答/誤答行列 [生徒インデックス][問題インデックス] = 0 or 1 */
  matrix: number[][];
}

/** 並べ替え後の生徒データ */
export interface SortedStudent {
  /** 生徒ID */
  id: string;
  /** 元のインデックス（安定ソート用） */
  originalIndex: number;
  /** 合計得点 */
  totalScore: number;
  /** 並べ替え後の回答パターン */
  responses: number[];
  /** 注意係数（CS）- 計算不可の場合はnull */
  cautionIndex: number | null;
}

/** 並べ替え後の問題データ */
export interface SortedProblem {
  /** 問題ID */
  id: string;
  /** 元のインデックス（安定ソート用） */
  originalIndex: number;
  /** 正答者数 */
  correctCount: number;
  /** 正答率（0-1） */
  correctRate: number;
  /** 注意係数（CP）- 計算不可の場合はnull */
  cautionIndex: number | null;
}

/** 曲線の座標点（0-1正規化） */
export interface CurvePoint {
  /** X座標（0-1） */
  x: number;
  /** Y座標（0-1） */
  y: number;
}

/** S曲線・P曲線のデータ */
export interface CurvesData {
  /** S曲線の座標配列 */
  sCurve: CurvePoint[];
  /** P曲線の座標配列 */
  pCurve: CurvePoint[];
}

/** S-P表分析結果 */
export interface SPTableResult {
  /** 並べ替え後の生徒一覧 */
  sortedStudents: SortedStudent[];
  /** 並べ替え後の問題一覧 */
  sortedProblems: SortedProblem[];
  /** 並べ替え後の行列 [生徒][問題] */
  sortedMatrix: number[][];
  /** S曲線・P曲線データ */
  curves: CurvesData;
  /** 差異係数（D*）*/
  disparityCoefficient: number;
  /** 統計サマリ */
  summary: SPTableSummary;
}

/** 統計サマリ */
export interface SPTableSummary {
  /** 生徒数 */
  studentCount: number;
  /** 問題数 */
  problemCount: number;
  /** 平均得点 */
  averageScore: number;
  /** 平均正答率 */
  averageCorrectRate: number;
  /** 要注意生徒数（CS >= 0.5） */
  cautionStudentCount: number;
  /** 特に注意生徒数（CS >= 0.75） */
  highCautionStudentCount: number;
  /** 要注意問題数（CP >= 0.5） */
  cautionProblemCount: number;
  /** 特に注意問題数（CP >= 0.75） */
  highCautionProblemCount: number;
}

/** 注意係数の閾値 */
export const CAUTION_THRESHOLDS = {
  /** 要注意 */
  WARNING: 0.5,
  /** 特に注意 */
  CRITICAL: 0.75,
} as const;

/** 注意レベル */
export type CautionLevel = 'normal' | 'warning' | 'critical' | 'unknown';

/**
 * 注意係数から注意レベルを判定
 */
export function getCautionLevel(cautionIndex: number | null): CautionLevel {
  if (cautionIndex === null) return 'unknown';
  if (cautionIndex >= CAUTION_THRESHOLDS.CRITICAL) return 'critical';
  if (cautionIndex >= CAUTION_THRESHOLDS.WARNING) return 'warning';
  return 'normal';
}
