/**
 * CSVパーサー
 *
 * 対応形式:
 * 1. 標準形式:
 *    - 1行目: 空セル, 問題ID1, 問題ID2, ...
 *    - 2行目以降: 生徒ID, 0/1, 0/1, ...
 *
 * 2. 文科省形式（転置）:
 *    - 1行目: 空セル, 生徒ID1, 生徒ID2, ...
 *    - 2行目以降: 問題ID, 0/1, 0/1, ...
 *    （行と列が逆転した形式）
 *
 * 3. ○×形式:
 *    - 正答を○、誤答を×で表現
 */

import type { RawTestData } from '../types/sp';

export interface ParseResult {
  success: boolean;
  data?: RawTestData;
  error?: string;
  format?: 'standard' | 'transposed' | 'mext';
}

/**
 * CSVの形式を自動検出
 */
function detectFormat(lines: string[]): 'standard' | 'transposed' | 'mext' {
  // 2行目以降のデータパターンを解析
  if (lines.length < 2) return 'standard';

  const headerCells = parseCSVLine(lines[0]);

  // ○×形式の検出
  const hasMaruBatsu = lines.some(line =>
    line.includes('○') || line.includes('×') ||
    line.includes('◯') || line.includes('✕')
  );
  if (hasMaruBatsu) {
    return 'mext';
  }

  // 行数 > 列数の場合、通常は生徒が行（標準形式）
  // 行数 < 列数の場合、生徒が列の可能性（転置形式）
  const rowCount = lines.length - 1;
  const colCount = headerCells.length - 1;

  // 明らかに転置されている場合（問題数が非常に多く、生徒数が少ない）
  if (colCount > 100 && rowCount < 30) {
    return 'transposed';
  }

  return 'standard';
}

/**
 * ○×を0/1に変換
 */
function normalizeValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '○' || trimmed === '◯' || trimmed === 'O' || trimmed === 'o') {
    return '1';
  }
  if (trimmed === '×' || trimmed === '✕' || trimmed === 'X' || trimmed === 'x') {
    return '0';
  }
  return trimmed;
}

/**
 * CSVテキストをパース
 */
export function parseCSV(csvText: string): ParseResult {
  try {
    // 行に分割（空行を除去）
    const lines = csvText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length < 2) {
      return {
        success: false,
        error: 'CSVには少なくとも2行（ヘッダー + 1データ行）が必要です',
      };
    }

    // 形式を自動検出
    const format = detectFormat(lines);

    // ヘッダー行をパース
    const headerCells = parseCSVLine(lines[0]);
    if (headerCells.length < 2) {
      return {
        success: false,
        error: 'ヘッダー行には少なくとも1つのIDが必要です',
      };
    }

    // 転置形式の場合は行列を入れ替え
    if (format === 'transposed') {
      return parseTransposedCSV(lines, format);
    }

    // 問題ID（1列目は空またはラベルなので除外）
    const problemIds = headerCells.slice(1);

    // データ行をパース
    const studentIds: string[] = [];
    const matrix: number[][] = [];

    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i]);

      if (cells.length < 2) {
        return {
          success: false,
          error: `${i + 1}行目: データが不足しています`,
        };
      }

      // 生徒ID
      studentIds.push(cells[0]);

      // 回答データ
      const row: number[] = [];
      for (let j = 1; j < cells.length && j <= problemIds.length; j++) {
        const value = normalizeValue(cells[j]);
        if (value === '1') {
          row.push(1);
        } else if (value === '0' || value === '') {
          row.push(0);
        } else {
          return {
            success: false,
            error: `${i + 1}行目${j + 1}列目: 値は0, 1, ○, ×である必要があります（現在: "${cells[j].trim()}"）`,
          };
        }
      }

      // 列数が足りない場合は0で埋める
      while (row.length < problemIds.length) {
        row.push(0);
      }

      matrix.push(row);
    }

    return {
      success: true,
      data: {
        studentIds,
        problemIds,
        matrix,
      },
      format,
    };
  } catch (e) {
    return {
      success: false,
      error: `パースエラー: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/**
 * 転置形式のCSVをパース（問題が行、生徒が列）
 */
function parseTransposedCSV(lines: string[], format: 'standard' | 'transposed' | 'mext'): ParseResult {
  const headerCells = parseCSVLine(lines[0]);

  // 生徒ID（ヘッダーの2列目以降）
  const studentIds = headerCells.slice(1);

  // 問題IDとデータ行列を構築
  const problemIds: string[] = [];
  const transposedMatrix: number[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);

    if (cells.length < 2) {
      return {
        success: false,
        error: `${i + 1}行目: データが不足しています`,
      };
    }

    // 問題ID
    problemIds.push(cells[0]);

    // 回答データ（この行は1つの問題に対する全生徒の回答）
    const row: number[] = [];
    for (let j = 1; j < cells.length && j <= studentIds.length; j++) {
      const value = normalizeValue(cells[j]);
      if (value === '1') {
        row.push(1);
      } else if (value === '0' || value === '') {
        row.push(0);
      } else {
        return {
          success: false,
          error: `${i + 1}行目${j + 1}列目: 値は0, 1, ○, ×である必要があります`,
        };
      }
    }

    while (row.length < studentIds.length) {
      row.push(0);
    }

    transposedMatrix.push(row);
  }

  // 行列を転置（問題×生徒 → 生徒×問題）
  const matrix: number[][] = [];
  for (let s = 0; s < studentIds.length; s++) {
    const studentRow: number[] = [];
    for (let p = 0; p < problemIds.length; p++) {
      studentRow.push(transposedMatrix[p][s]);
    }
    matrix.push(studentRow);
  }

  return {
    success: true,
    data: {
      studentIds,
      problemIds,
      matrix,
    },
    format,
  };
}

/**
 * CSV行をセルに分割（カンマ区切り、クォート対応）
 */
function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        // 次の文字も"ならエスケープされた"
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  cells.push(current);
  return cells;
}

/**
 * ファイルからCSVを読み込んでパース
 */
export function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = e => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        resolve(parseCSV(text));
      } else {
        resolve({
          success: false,
          error: 'ファイルの読み込みに失敗しました',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'ファイルの読み込みに失敗しました',
      });
    };

    reader.readAsText(file);
  });
}
