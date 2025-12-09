/**
 * CSVパーサー
 *
 * 形式:
 * - 1行目: 空セル, 問題ID1, 問題ID2, ...
 * - 2行目以降: 生徒ID, 0/1, 0/1, ...
 */

import type { RawTestData } from '../types/sp';

export interface ParseResult {
  success: boolean;
  data?: RawTestData;
  error?: string;
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

    // ヘッダー行をパース
    const headerCells = parseCSVLine(lines[0]);
    if (headerCells.length < 2) {
      return {
        success: false,
        error: 'ヘッダー行には少なくとも1つの問題IDが必要です',
      };
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
        const value = cells[j].trim();
        if (value === '1') {
          row.push(1);
        } else if (value === '0' || value === '') {
          row.push(0);
        } else {
          return {
            success: false,
            error: `${i + 1}行目${j + 1}列目: 値は0または1である必要があります（現在: "${value}"）`,
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
    };
  } catch (e) {
    return {
      success: false,
      error: `パースエラー: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
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
