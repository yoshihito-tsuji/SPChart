/**
 * サンプルデータ選択コンポーネント
 */

import type { RawTestData } from '../types/sp';
import { allSamples, type SampleDataSet } from '../data/sampleData';

interface SampleDataSelectorProps {
  onSelect: (data: RawTestData) => void;
  disabled?: boolean;
}

export function SampleDataSelector({ onSelect, disabled }: SampleDataSelectorProps) {
  const handleSelect = (sample: SampleDataSet) => {
    onSelect(sample.data);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">サンプルデータ:</span>
      {allSamples.map(sample => (
        <button
          key={sample.name}
          onClick={() => handleSelect(sample)}
          disabled={disabled}
          className={`
            px-3 py-1 text-sm rounded-md
            transition-colors duration-200
            ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {sample.description}
        </button>
      ))}
    </div>
  );
}
