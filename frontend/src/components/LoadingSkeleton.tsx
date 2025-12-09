/**
 * ローディングスケルトンコンポーネント
 */

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* 統計サマリのスケルトン */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-3">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* グラフのスケルトン */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <div className="h-[400px] bg-gray-100 rounded flex items-center justify-center">
          <div className="text-gray-400">計算中...</div>
        </div>
      </div>

      {/* テーブルのスケルトン */}
      <div className="bg-white rounded-lg border border-gray-300 p-4">
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
