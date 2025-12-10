/**
 * フォーム入力UIコンポーネント
 *
 * 中規模データ（〜300×60）の手入力をサポート
 * CSV仕様準拠: 1行目=問題ID, 1列目=生徒ID, 値は0/1
 */

import { useState, useCallback, useMemo } from 'react';
import type { RawTestData } from '../types/sp';

interface DataInputFormProps {
  onDataLoaded: (data: RawTestData) => void;
  onCancel: () => void;
}

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 5;
const MAX_ROWS = 300;
const MAX_COLS = 60;

export function DataInputForm({ onDataLoaded, onCancel }: DataInputFormProps) {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [studentIds, setStudentIds] = useState<string[]>(() =>
    Array.from({ length: DEFAULT_ROWS }, (_, i) => `S${i + 1}`)
  );
  const [problemIds, setProblemIds] = useState<string[]>(() =>
    Array.from({ length: DEFAULT_COLS }, (_, i) => `Q${i + 1}`)
  );
  const [matrix, setMatrix] = useState<number[][]>(() =>
    Array.from({ length: DEFAULT_ROWS }, () =>
      Array.from({ length: DEFAULT_COLS }, () => 0)
    )
  );
  const [error, setError] = useState<string | null>(null);

  // 行数変更
  const handleRowsChange = useCallback((newRows: number) => {
    const clampedRows = Math.max(1, Math.min(MAX_ROWS, newRows));
    setRows(clampedRows);

    setStudentIds(prev => {
      if (clampedRows > prev.length) {
        return [
          ...prev,
          ...Array.from(
            { length: clampedRows - prev.length },
            (_, i) => `S${prev.length + i + 1}`
          ),
        ];
      }
      return prev.slice(0, clampedRows);
    });

    setMatrix(prev => {
      if (clampedRows > prev.length) {
        const currentCols = prev[0]?.length || cols;
        return [
          ...prev,
          ...Array.from({ length: clampedRows - prev.length }, () =>
            Array.from({ length: currentCols }, () => 0)
          ),
        ];
      }
      return prev.slice(0, clampedRows);
    });
  }, [cols]);

  // 列数変更
  const handleColsChange = useCallback((newCols: number) => {
    const clampedCols = Math.max(1, Math.min(MAX_COLS, newCols));
    setCols(clampedCols);

    setProblemIds(prev => {
      if (clampedCols > prev.length) {
        return [
          ...prev,
          ...Array.from(
            { length: clampedCols - prev.length },
            (_, i) => `Q${prev.length + i + 1}`
          ),
        ];
      }
      return prev.slice(0, clampedCols);
    });

    setMatrix(prev =>
      prev.map(row => {
        if (clampedCols > row.length) {
          return [...row, ...Array.from({ length: clampedCols - row.length }, () => 0)];
        }
        return row.slice(0, clampedCols);
      })
    );
  }, []);

  // 生徒ID変更
  const handleStudentIdChange = useCallback((index: number, value: string) => {
    setStudentIds(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  // 問題ID変更
  const handleProblemIdChange = useCallback((index: number, value: string) => {
    setProblemIds(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  // セルをトグル
  const handleCellToggle = useCallback((rowIndex: number, colIndex: number) => {
    setMatrix(prev => {
      const next = prev.map(row => [...row]);
      next[rowIndex][colIndex] = next[rowIndex][colIndex] === 1 ? 0 : 1;
      return next;
    });
  }, []);

  // バリデーション
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    // 重複チェック
    const uniqueStudentIds = new Set(studentIds);
    if (uniqueStudentIds.size !== studentIds.length) {
      errors.push('生徒IDに重複があります');
    }

    const uniqueProblemIds = new Set(problemIds);
    if (uniqueProblemIds.size !== problemIds.length) {
      errors.push('問題IDに重複があります');
    }

    // 空チェック
    if (studentIds.some(id => !id.trim())) {
      errors.push('空の生徒IDがあります');
    }

    if (problemIds.some(id => !id.trim())) {
      errors.push('空の問題IDがあります');
    }

    // 値チェック（0/1のみ）
    const hasInvalidValue = matrix.some(row =>
      row.some(val => val !== 0 && val !== 1)
    );
    if (hasInvalidValue) {
      errors.push('セルの値は0または1のみです');
    }

    return errors;
  }, [studentIds, problemIds, matrix]);

  // 送信
  const handleSubmit = useCallback(() => {
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      return;
    }

    const data: RawTestData = {
      studentIds: studentIds.map(id => id.trim()),
      problemIds: problemIds.map(id => id.trim()),
      matrix,
    };

    onDataLoaded(data);
  }, [studentIds, problemIds, matrix, validationErrors, onDataLoaded]);

  // 全て正答にする
  const handleFillAll = useCallback((value: number) => {
    setMatrix(
      Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => value)
      )
    );
  }, [rows, cols]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">データ入力フォーム</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* サイズ設定 */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">生徒数:</label>
          <input
            type="number"
            min={1}
            max={MAX_ROWS}
            value={rows}
            onChange={e => handleRowsChange(parseInt(e.target.value, 10) || 1)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-xs text-gray-400">(最大{MAX_ROWS})</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">問題数:</label>
          <input
            type="number"
            min={1}
            max={MAX_COLS}
            value={cols}
            onChange={e => handleColsChange(parseInt(e.target.value, 10) || 1)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-xs text-gray-400">(最大{MAX_COLS})</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleFillAll(1)}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"
          >
            全て正答
          </button>
          <button
            onClick={() => handleFillAll(0)}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded"
          >
            全て誤答
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {(error || validationErrors.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm text-red-600">
          {error || validationErrors.join('、')}
        </div>
      )}

      {/* 入力テーブル */}
      <div className="overflow-auto max-h-[400px] border border-gray-200 rounded mb-4">
        <table className="border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="border border-gray-300 p-1 bg-gray-100 sticky left-0 z-20 min-w-[80px]">
                生徒＼問題
              </th>
              {problemIds.map((id, j) => (
                <th key={j} className="border border-gray-300 p-0 min-w-[60px]">
                  <input
                    type="text"
                    value={id}
                    onChange={e => handleProblemIdChange(j, e.target.value)}
                    className="w-full px-1 py-1 text-center text-xs border-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`Q${j + 1}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentIds.map((studentId, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-0 sticky left-0 bg-white z-10">
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => handleStudentIdChange(i, e.target.value)}
                    className="w-full px-1 py-1 text-xs border-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`S${i + 1}`}
                  />
                </td>
                {matrix[i].map((value, j) => (
                  <td
                    key={j}
                    className={`
                      border border-gray-300 p-0 text-center cursor-pointer
                      ${value === 1 ? 'bg-blue-100' : 'bg-gray-50'}
                      hover:bg-blue-200
                    `}
                    onClick={() => handleCellToggle(i, j)}
                  >
                    <span className="block px-2 py-1 text-xs select-none">
                      {value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 操作説明 */}
      <p className="text-xs text-gray-500 mb-4">
        セルをクリックすると0/1を切り替えます。生徒ID・問題IDは直接編集可能です。
      </p>

      {/* アクションボタン */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          disabled={validationErrors.length > 0}
          className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          分析を開始
        </button>
      </div>
    </div>
  );
}
