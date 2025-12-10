import { useState } from 'react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'overview' | 'usage' | 'interpretation' | 'csv';

interface TabContent {
  id: TabId;
  label: string;
}

const tabs: TabContent[] = [
  { id: 'overview', label: '概要' },
  { id: 'usage', label: '使い方' },
  { id: 'interpretation', label: '読み方' },
  { id: 'csv', label: 'CSV形式' },
];

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">ヘルプ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'usage' && <UsageContent />}
          {activeTab === 'interpretation' && <InterpretationContent />}
          {activeTab === 'csv' && <CsvContent />}
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            S-P表理論: 佐藤隆博 (1969)
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">S-P表とは</h3>
      <p className="text-gray-600">
        S-P表（Student-Problem表）は、佐藤隆博によって1969年に提唱された教育測定理論です。
        テスト結果の正誤データを視覚的・統計的に分析することで、生徒の学習課題や問題の適切性を把握できます。
      </p>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">主な機能</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>正誤データの自動並べ替え（生徒: 得点順、問題: 正答率順）</li>
        <li>S曲線・P曲線の描画</li>
        <li>注意係数（CS/CP）の計算と可視化</li>
        <li>差異係数（D*）の計算</li>
        <li>CSV/JSON/PDF/PNG形式でのエクスポート</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">用語説明</h3>
      <dl className="space-y-3">
        <div>
          <dt className="font-medium text-gray-700">S曲線（Student曲線）</dt>
          <dd className="text-gray-600 text-sm ml-4">
            各生徒の得点に基づく累積曲線。生徒の解答パターンを示します。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">P曲線（Problem曲線）</dt>
          <dd className="text-gray-600 text-sm ml-4">
            各問題の正答者数に基づく累積曲線。問題の難易度パターンを示します。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">CS（生徒注意係数）</dt>
          <dd className="text-gray-600 text-sm ml-4">
            S曲線からの逸脱度。0.5以上で要注意、0.75以上で特に注意。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">CP（問題注意係数）</dt>
          <dd className="text-gray-600 text-sm ml-4">
            P曲線からの逸脱度。0.5以上で要注意、0.75以上で特に注意。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">D*（差異係数）</dt>
          <dd className="text-gray-600 text-sm ml-4">
            S曲線とP曲線の乖離度。テスト全体の特性を示す指標。
          </dd>
        </div>
      </dl>
    </div>
  );
}

function UsageContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">データの読み込み方法</h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">1. CSVファイルをアップロード</h4>
          <p className="text-blue-700 text-sm">
            CSVファイルを選択またはドラッグ&ドロップでアップロードします。
            形式については「CSV形式」タブを参照してください。
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">2. サンプルデータを使用</h4>
          <p className="text-green-700 text-sm">
            まずは試してみたい場合、用意されたサンプルデータ（5人×5問、30人×20問、300人×60問）を選択できます。
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">3. 手入力</h4>
          <p className="text-purple-700 text-sm">
            「手入力」ボタンから、生徒数と問題数を指定して直接データを入力できます。
            セルをクリックすると0と1が切り替わります。
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">結果の見方</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li><strong>統計サマリ:</strong> 生徒数、問題数、平均点、D*などの概要</li>
        <li><strong>S-P曲線グラフ:</strong> S曲線とP曲線の交差パターン</li>
        <li><strong>S-P表グリッド:</strong> 個別の正誤データと注意セルのハイライト</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">エクスポート</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li><strong>PNG:</strong> S-P曲線グラフを画像として保存</li>
        <li><strong>PDF:</strong> 統計サマリ、グラフ、表をA4形式で出力</li>
        <li><strong>CSV:</strong> 並べ替え済みデータをCSV形式で保存</li>
        <li><strong>JSON:</strong> 全ての分析結果をJSON形式で保存</li>
      </ul>
    </div>
  );
}

function InterpretationContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">注意係数（CS/CP）の解釈</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">値</th>
              <th className="border px-4 py-2 text-left">判定</th>
              <th className="border px-4 py-2 text-left">ハイライト</th>
              <th className="border px-4 py-2 text-left">解釈</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">0.75以上</td>
              <td className="border px-4 py-2 font-medium text-red-600">特に注意</td>
              <td className="border px-4 py-2"><span className="px-2 py-1 bg-red-200 rounded">赤色</span></td>
              <td className="border px-4 py-2 text-sm">予想外の解答パターン。詳細な確認が必要</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">0.5〜0.75</td>
              <td className="border px-4 py-2 font-medium text-yellow-600">要注意</td>
              <td className="border px-4 py-2"><span className="px-2 py-1 bg-yellow-200 rounded">黄色</span></td>
              <td className="border px-4 py-2 text-sm">やや異常な解答パターン。注視が必要</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">0.5未満</td>
              <td className="border px-4 py-2 font-medium text-green-600">正常</td>
              <td className="border px-4 py-2"><span className="px-2 py-1 bg-white border rounded">なし</span></td>
              <td className="border px-4 py-2 text-sm">予想通りの解答パターン</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">生徒への対応（CSが高い場合）</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>基礎的な問題で誤答が多い場合 → 基礎学力の再確認</li>
        <li>難しい問題で正答が多い場合 → 偶然正解の可能性、理解度の確認</li>
        <li>全体的に逸脱している場合 → 個別の学習課題の把握</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">問題への対応（CPが高い場合）</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>高得点者が間違えやすい場合 → 問題文の曖昧さ、誤字脱字の確認</li>
        <li>低得点者が正解しやすい場合 → 推測しやすい選択肢の確認</li>
        <li>全体的に逸脱している場合 → 問題の妥当性の再検討</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800 mt-6">差異係数（D*）の解釈</h3>
      <p className="text-gray-600">
        D*はS曲線とP曲線の乖離度を示します。値が大きいほど、
        テスト全体として予想外の解答パターンが多いことを意味します。
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
        <li><strong>D* ≦ 0.5:</strong> 標準的なテスト結果</li>
        <li><strong>0.5 &lt; D* ≦ 1.0:</strong> やや注意が必要</li>
        <li><strong>D* &gt; 1.0:</strong> テスト設計の見直しを検討</li>
      </ul>
    </div>
  );
}

function CsvContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">CSV形式の仕様</h3>
      <p className="text-gray-600">
        以下の形式のCSVファイルを読み込むことができます。
      </p>

      <h4 className="font-medium text-gray-700 mt-4">基本ルール</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>文字コード: UTF-8（BOM付きも可）またはShift_JIS</li>
        <li>区切り文字: カンマ（,）</li>
        <li>1行目: ヘッダー行（問題ID）</li>
        <li>2行目以降: 生徒データ</li>
        <li>セル値: 正答=1、誤答=0</li>
      </ul>

      <h4 className="font-medium text-gray-700 mt-4">ファイル例</h4>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{`,Q1,Q2,Q3,Q4,Q5
S1,1,1,1,0,0
S2,1,1,0,1,0
S3,1,0,1,0,0
S4,0,1,0,0,1
S5,0,0,0,0,0`}</pre>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        ※ 1行目の最初のセルは空欄または任意の文字列（無視されます）
      </p>

      <h4 className="font-medium text-gray-700 mt-4">制限事項</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>最大生徒数: 300人</li>
        <li>最大問題数: 60問</li>
        <li>セル値は 0 または 1 のみ有効</li>
        <li>空白セルは 0 として扱われます</li>
      </ul>

      <h4 className="font-medium text-gray-700 mt-4">エラーが発生する場合</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>行ごとに列数が異なる場合</li>
        <li>0, 1 以外の値が含まれる場合</li>
        <li>データが2行未満の場合（ヘッダーのみ）</li>
      </ul>
    </div>
  );
}
