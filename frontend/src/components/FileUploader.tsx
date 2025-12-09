/**
 * CSVファイルアップロードコンポーネント
 */

import { useCallback } from 'react';
import type { RawTestData } from '../types/sp';
import { parseCSVFile } from '../core/parseCSV';

interface FileUploaderProps {
  onDataLoaded: (data: RawTestData) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function FileUploader({ onDataLoaded, onError, disabled }: FileUploaderProps) {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const result = await parseCSVFile(file);
      if (result.success && result.data) {
        onDataLoaded(result.data);
      } else {
        onError(result.error || '不明なエラー');
      }

      // ファイル選択をリセット（同じファイルを再選択可能にする）
      e.target.value = '';
    },
    [onDataLoaded, onError]
  );

  return (
    <div className="flex items-center gap-4">
      <label
        className={`
          px-4 py-2 rounded-lg font-medium cursor-pointer
          transition-colors duration-200
          ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        CSVファイルを選択
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
      <span className="text-sm text-gray-600">
        形式: 1行目=問題ID、1列目=生徒ID、値は0/1
      </span>
    </div>
  );
}
