/**
 * 多言語対応の翻訳リソース
 */

export type Language = 'ja' | 'en';

export interface Translations {
  // ヘッダー
  appTitle: string;
  reset: string;
  help: string;

  // データ入力
  uploadCSV: string;
  selectSample: string;
  manualInput: string;
  dragDropHint: string;

  // サンプルデータ
  sampleSmall: string;
  sampleMedium: string;
  sampleLarge: string;

  // 手入力フォーム
  formTitle: string;
  studentCount: string;
  problemCount: string;
  startInput: string;
  cancel: string;
  analyze: string;
  clickToToggle: string;

  // ローディング・状態
  loadData: string;
  loadDataHint: string;
  analyzing: string;
  csvFormat: string;
  maxSize: string;

  // エラー
  error: string;
  tryOtherFile: string;

  // 結果表示
  export: string;
  exportPNG: string;
  exportPDF: string;
  exportCSV: string;
  exportJSON: string;
  print: string;

  // 統計サマリ
  statistics: string;
  studentCountLabel: string;
  problemCountLabel: string;
  averageScore: string;
  disparityCoefficient: string;
  legend: string;
  legendNormal: string;
  legendCaution: string;
  legendHighCaution: string;

  // S-P表
  spTable: string;
  score: string;
  correctCount: string;
  cs: string;
  cp: string;
  notCalculable: string;

  // グラフ
  spCurves: string;
  sCurve: string;
  pCurve: string;
  students: string;
  problems: string;

  // ヘルプダイアログ
  helpTitle: string;
  helpOverview: string;
  helpUsage: string;
  helpInterpretation: string;
  helpCsvFormat: string;
  close: string;

  // ヘルプ - 概要
  whatIsSPTable: string;
  spTableDescription: string;
  mainFeatures: string;
  featureSort: string;
  featureCurves: string;
  featureCaution: string;
  featureDisparity: string;
  featureExport: string;
  terminology: string;
  termSCurve: string;
  termSCurveDesc: string;
  termPCurve: string;
  termPCurveDesc: string;
  termCS: string;
  termCSDesc: string;
  termCP: string;
  termCPDesc: string;
  termDStar: string;
  termDStarDesc: string;

  // ヘルプ - 使い方
  howToLoadData: string;
  method1Title: string;
  method1Desc: string;
  method2Title: string;
  method2Desc: string;
  method3Title: string;
  method3Desc: string;
  howToReadResults: string;
  resultStatistics: string;
  resultCurves: string;
  resultGrid: string;
  exportSection: string;
  exportPngDesc: string;
  exportPdfDesc: string;
  exportCsvDesc: string;
  exportJsonDesc: string;

  // ヘルプ - 読み方
  cautionInterpretationTitle: string;
  valueColumn: string;
  judgmentColumn: string;
  highlightColumn: string;
  interpretationColumn: string;
  highCautionValue: string;
  highCautionJudgment: string;
  highCautionHighlight: string;
  highCautionInterpretation: string;
  cautionValue: string;
  cautionJudgment: string;
  cautionHighlight: string;
  cautionInterpretation: string;
  normalValue: string;
  normalJudgment: string;
  normalHighlight: string;
  normalInterpretation: string;
  studentResponse: string;
  studentResponseItems: string[];
  problemResponse: string;
  problemResponseItems: string[];
  dStarInterpretation: string;
  dStarDescription: string;
  dStarItems: string[];

  // ヘルプ - CSV形式
  csvSpecification: string;
  csvSpecDescription: string;
  basicRules: string;
  csvRuleEncoding: string;
  csvRuleDelimiter: string;
  csvRuleHeader: string;
  csvRuleData: string;
  csvRuleValue: string;
  fileExample: string;
  csvNote: string;
  limitations: string;
  limitMaxStudents: string;
  limitMaxProblems: string;
  limitValidValues: string;
  limitEmptyCell: string;
  errorCases: string;
  errorDifferentColumns: string;
  errorInvalidValue: string;
  errorTooFewRows: string;

  // フッター
  footerTheory: string;
  footerLab: string;
}

export const translations: Record<Language, Translations> = {
  ja: {
    // ヘッダー
    appTitle: 'SPChart - S-P表分析ツール',
    reset: 'リセット',
    help: 'ヘルプ',

    // データ入力
    uploadCSV: 'CSVファイルを選択',
    selectSample: 'サンプルデータ',
    manualInput: '手入力',
    dragDropHint: 'またはドラッグ&ドロップ',

    // サンプルデータ
    sampleSmall: '5人×5問（最小テスト）',
    sampleMedium: '30人×20問（標準クラス）',
    sampleLarge: '300人×60問（学年規模）',

    // 手入力フォーム
    formTitle: 'データ入力',
    studentCount: '生徒数',
    problemCount: '問題数',
    startInput: '入力開始',
    cancel: 'キャンセル',
    analyze: '分析',
    clickToToggle: 'セルをクリックで 0/1 切替',

    // ローディング・状態
    loadData: 'データを読み込んでください',
    loadDataHint: 'CSVファイルをアップロード、サンプルデータを選択、または手入力で開始できます',
    analyzing: 'S-P表を分析中...',
    csvFormat: 'CSV形式（0/1値）',
    maxSize: '最大300人×60問',

    // エラー
    error: 'エラー',
    tryOtherFile: '別のファイルを選択するか、サンプルデータをお試しください。',

    // 結果表示
    export: 'エクスポート',
    exportPNG: 'PNG',
    exportPDF: 'PDF',
    exportCSV: 'CSV',
    exportJSON: 'JSON',
    print: '印刷',

    // 統計サマリ
    statistics: '統計サマリ',
    studentCountLabel: '生徒数',
    problemCountLabel: '問題数',
    averageScore: '平均点',
    disparityCoefficient: '差異係数 (D*)',
    legend: '凡例',
    legendNormal: '正常（CS/CP < 0.5）',
    legendCaution: '要注意（0.5 ≤ CS/CP < 0.75）',
    legendHighCaution: '特に注意（CS/CP ≥ 0.75）',

    // S-P表
    spTable: 'S-P表',
    score: '得点',
    correctCount: '正答者数',
    cs: 'CS',
    cp: 'CP',
    notCalculable: '計算不可',

    // グラフ
    spCurves: 'S-P曲線',
    sCurve: 'S曲線（生徒）',
    pCurve: 'P曲線（問題）',
    students: '生徒',
    problems: '問題',

    // ヘルプダイアログ
    helpTitle: 'ヘルプ',
    helpOverview: '概要',
    helpUsage: '使い方',
    helpInterpretation: '読み方',
    helpCsvFormat: 'CSV形式',
    close: '閉じる',

    // ヘルプ - 概要
    whatIsSPTable: 'S-P表とは',
    spTableDescription: 'S-P表（Student-Problem表）は、佐藤隆博によって1969年に提唱された教育測定理論です。テスト結果の正誤データを視覚的・統計的に分析することで、生徒の学習課題や問題の適切性を把握できます。',
    mainFeatures: '主な機能',
    featureSort: '正誤データの自動並べ替え（生徒: 得点順、問題: 正答率順）',
    featureCurves: 'S曲線・P曲線の描画',
    featureCaution: '注意係数（CS/CP）の計算と可視化',
    featureDisparity: '差異係数（D*）の計算',
    featureExport: 'CSV/JSON/PDF/PNG形式でのエクスポート',
    terminology: '用語説明',
    termSCurve: 'S曲線（Student曲線）',
    termSCurveDesc: '各生徒の得点に基づく累積曲線。生徒の解答パターンを示します。',
    termPCurve: 'P曲線（Problem曲線）',
    termPCurveDesc: '各問題の正答者数に基づく累積曲線。問題の難易度パターンを示します。',
    termCS: 'CS（生徒注意係数）',
    termCSDesc: 'S曲線からの逸脱度。0.5以上で要注意、0.75以上で特に注意。',
    termCP: 'CP（問題注意係数）',
    termCPDesc: 'P曲線からの逸脱度。0.5以上で要注意、0.75以上で特に注意。',
    termDStar: 'D*（差異係数）',
    termDStarDesc: 'S曲線とP曲線の乖離度。テスト全体の特性を示す指標。',

    // ヘルプ - 使い方
    howToLoadData: 'データの読み込み方法',
    method1Title: '1. CSVファイルをアップロード',
    method1Desc: 'CSVファイルを選択またはドラッグ&ドロップでアップロードします。形式については「CSV形式」タブを参照してください。',
    method2Title: '2. サンプルデータを使用',
    method2Desc: 'まずは試してみたい場合、用意されたサンプルデータ（5人×5問、30人×20問、300人×60問）を選択できます。',
    method3Title: '3. 手入力',
    method3Desc: '「手入力」ボタンから、生徒数と問題数を指定して直接データを入力できます。セルをクリックすると0と1が切り替わります。',
    howToReadResults: '結果の見方',
    resultStatistics: '統計サマリ: 生徒数、問題数、平均点、D*などの概要',
    resultCurves: 'S-P曲線グラフ: S曲線とP曲線の交差パターン',
    resultGrid: 'S-P表グリッド: 個別の正誤データと注意セルのハイライト',
    exportSection: 'エクスポート',
    exportPngDesc: 'PNG: S-P曲線グラフを画像として保存',
    exportPdfDesc: 'PDF: 統計サマリ、グラフ、表をA4形式で出力',
    exportCsvDesc: 'CSV: 並べ替え済みデータをCSV形式で保存',
    exportJsonDesc: 'JSON: 全ての分析結果をJSON形式で保存',

    // ヘルプ - 読み方
    cautionInterpretationTitle: '注意係数（CS/CP）の解釈',
    valueColumn: '値',
    judgmentColumn: '判定',
    highlightColumn: 'ハイライト',
    interpretationColumn: '解釈',
    highCautionValue: '0.75以上',
    highCautionJudgment: '特に注意',
    highCautionHighlight: '赤色',
    highCautionInterpretation: '予想外の解答パターン。詳細な確認が必要',
    cautionValue: '0.5〜0.75',
    cautionJudgment: '要注意',
    cautionHighlight: '黄色',
    cautionInterpretation: 'やや異常な解答パターン。注視が必要',
    normalValue: '0.5未満',
    normalJudgment: '正常',
    normalHighlight: 'なし',
    normalInterpretation: '予想通りの解答パターン',
    studentResponse: '生徒への対応（CSが高い場合）',
    studentResponseItems: [
      '基礎的な問題で誤答が多い場合 → 基礎学力の再確認',
      '難しい問題で正答が多い場合 → 偶然正解の可能性、理解度の確認',
      '全体的に逸脱している場合 → 個別の学習課題の把握',
    ],
    problemResponse: '問題への対応（CPが高い場合）',
    problemResponseItems: [
      '高得点者が間違えやすい場合 → 問題文の曖昧さ、誤字脱字の確認',
      '低得点者が正解しやすい場合 → 推測しやすい選択肢の確認',
      '全体的に逸脱している場合 → 問題の妥当性の再検討',
    ],
    dStarInterpretation: '差異係数（D*）の解釈',
    dStarDescription: 'D*はS曲線とP曲線の乖離度を示します。値が大きいほど、テスト全体として予想外の解答パターンが多いことを意味します。',
    dStarItems: [
      'D* ≦ 0.5: 標準的なテスト結果',
      '0.5 < D* ≦ 1.0: やや注意が必要',
      'D* > 1.0: テスト設計の見直しを検討',
    ],

    // ヘルプ - CSV形式
    csvSpecification: 'CSV形式の仕様',
    csvSpecDescription: '以下の形式のCSVファイルを読み込むことができます。',
    basicRules: '基本ルール',
    csvRuleEncoding: '文字コード: UTF-8（BOM付きも可）またはShift_JIS',
    csvRuleDelimiter: '区切り文字: カンマ（,）',
    csvRuleHeader: '1行目: ヘッダー行（問題ID）',
    csvRuleData: '2行目以降: 生徒データ',
    csvRuleValue: 'セル値: 正答=1（または○）、誤答=0（または×）',
    fileExample: 'ファイル例',
    csvNote: '※ 1行目の最初のセルは空欄または任意の文字列（無視されます）',
    limitations: '制限事項',
    limitMaxStudents: '最大生徒数: 300人',
    limitMaxProblems: '最大問題数: 60問',
    limitValidValues: 'セル値は 0, 1, ○, × のみ有効',
    limitEmptyCell: '空白セルは 0 として扱われます',
    errorCases: 'エラーが発生する場合',
    errorDifferentColumns: '行ごとに列数が異なる場合',
    errorInvalidValue: '0, 1, ○, × 以外の値が含まれる場合',
    errorTooFewRows: 'データが2行未満の場合（ヘッダーのみ）',

    // フッター
    footerTheory: 'S-P表理論: 佐藤隆博 (1969)',
    footerLab: '公立はこだて未来大学 辻研究室',
  },

  en: {
    // Header
    appTitle: 'SPChart - S-P Table Analyzer',
    reset: 'Reset',
    help: 'Help',

    // Data Input
    uploadCSV: 'Select CSV File',
    selectSample: 'Sample Data',
    manualInput: 'Manual Input',
    dragDropHint: 'or drag & drop',

    // Sample Data
    sampleSmall: '5 students × 5 problems (minimal)',
    sampleMedium: '30 students × 20 problems (class)',
    sampleLarge: '300 students × 60 problems (grade)',

    // Manual Input Form
    formTitle: 'Data Input',
    studentCount: 'Students',
    problemCount: 'Problems',
    startInput: 'Start Input',
    cancel: 'Cancel',
    analyze: 'Analyze',
    clickToToggle: 'Click cells to toggle 0/1',

    // Loading & States
    loadData: 'Load your data',
    loadDataHint: 'Upload a CSV file, select sample data, or enter manually',
    analyzing: 'Analyzing S-P table...',
    csvFormat: 'CSV format (0/1 values)',
    maxSize: 'Max 300 students × 60 problems',

    // Error
    error: 'Error',
    tryOtherFile: 'Please try another file or use sample data.',

    // Results
    export: 'Export',
    exportPNG: 'PNG',
    exportPDF: 'PDF',
    exportCSV: 'CSV',
    exportJSON: 'JSON',
    print: 'Print',

    // Statistics Summary
    statistics: 'Statistics',
    studentCountLabel: 'Students',
    problemCountLabel: 'Problems',
    averageScore: 'Average Score',
    disparityCoefficient: 'Disparity Coefficient (D*)',
    legend: 'Legend',
    legendNormal: 'Normal (CS/CP < 0.5)',
    legendCaution: 'Caution (0.5 ≤ CS/CP < 0.75)',
    legendHighCaution: 'High Caution (CS/CP ≥ 0.75)',

    // S-P Table
    spTable: 'S-P Table',
    score: 'Score',
    correctCount: 'Correct',
    cs: 'CS',
    cp: 'CP',
    notCalculable: 'N/A',

    // Chart
    spCurves: 'S-P Curves',
    sCurve: 'S-Curve (Students)',
    pCurve: 'P-Curve (Problems)',
    students: 'Students',
    problems: 'Problems',

    // Help Dialog
    helpTitle: 'Help',
    helpOverview: 'Overview',
    helpUsage: 'Usage',
    helpInterpretation: 'Interpretation',
    helpCsvFormat: 'CSV Format',
    close: 'Close',

    // Help - Overview
    whatIsSPTable: 'What is S-P Table?',
    spTableDescription: 'The S-P Table (Student-Problem Table) is an educational measurement theory proposed by Takahiro Sato in 1969. It provides visual and statistical analysis of test results to understand student learning issues and problem appropriateness.',
    mainFeatures: 'Main Features',
    featureSort: 'Automatic sorting (students by score, problems by correct rate)',
    featureCurves: 'S-curve and P-curve visualization',
    featureCaution: 'Caution index (CS/CP) calculation and visualization',
    featureDisparity: 'Disparity coefficient (D*) calculation',
    featureExport: 'Export to CSV/JSON/PDF/PNG formats',
    terminology: 'Terminology',
    termSCurve: 'S-Curve (Student Curve)',
    termSCurveDesc: 'Cumulative curve based on student scores. Shows student response patterns.',
    termPCurve: 'P-Curve (Problem Curve)',
    termPCurveDesc: 'Cumulative curve based on correct answer counts. Shows problem difficulty patterns.',
    termCS: 'CS (Student Caution Index)',
    termCSDesc: 'Deviation from S-curve. ≥0.5 requires attention, ≥0.75 requires special attention.',
    termCP: 'CP (Problem Caution Index)',
    termCPDesc: 'Deviation from P-curve. ≥0.5 requires attention, ≥0.75 requires special attention.',
    termDStar: 'D* (Disparity Coefficient)',
    termDStarDesc: 'Divergence between S-curve and P-curve. Indicates overall test characteristics.',

    // Help - Usage
    howToLoadData: 'How to Load Data',
    method1Title: '1. Upload CSV File',
    method1Desc: 'Select or drag & drop a CSV file. See the "CSV Format" tab for format details.',
    method2Title: '2. Use Sample Data',
    method2Desc: 'Try the prepared sample data (5×5, 30×20, 300×60) to explore the features.',
    method3Title: '3. Manual Input',
    method3Desc: 'Click "Manual Input" to enter data directly. Click cells to toggle between 0 and 1.',
    howToReadResults: 'Understanding Results',
    resultStatistics: 'Statistics: Overview of student count, problem count, average, D*, etc.',
    resultCurves: 'S-P Curves Chart: Intersection patterns of S and P curves',
    resultGrid: 'S-P Table Grid: Individual correct/incorrect data with caution highlighting',
    exportSection: 'Export',
    exportPngDesc: 'PNG: Save the S-P curves chart as an image',
    exportPdfDesc: 'PDF: Export statistics, chart, and table in A4 format',
    exportCsvDesc: 'CSV: Save sorted data in CSV format',
    exportJsonDesc: 'JSON: Save all analysis results in JSON format',

    // Help - Interpretation
    cautionInterpretationTitle: 'Interpreting Caution Index (CS/CP)',
    valueColumn: 'Value',
    judgmentColumn: 'Judgment',
    highlightColumn: 'Highlight',
    interpretationColumn: 'Interpretation',
    highCautionValue: '≥ 0.75',
    highCautionJudgment: 'High Caution',
    highCautionHighlight: 'Red',
    highCautionInterpretation: 'Unexpected response pattern. Detailed review needed.',
    cautionValue: '0.5 - 0.75',
    cautionJudgment: 'Caution',
    cautionHighlight: 'Yellow',
    cautionInterpretation: 'Somewhat unusual pattern. Monitoring needed.',
    normalValue: '< 0.5',
    normalJudgment: 'Normal',
    normalHighlight: 'None',
    normalInterpretation: 'Expected response pattern.',
    studentResponse: 'Student Follow-up (High CS)',
    studentResponseItems: [
      'Many errors on basic problems → Review fundamental skills',
      'Correct answers on difficult problems → Check for guessing',
      'Overall deviation → Identify individual learning needs',
    ],
    problemResponse: 'Problem Review (High CP)',
    problemResponseItems: [
      'High scorers miss it → Check for ambiguous wording',
      'Low scorers get it right → Review answer choices',
      'Overall deviation → Reconsider problem validity',
    ],
    dStarInterpretation: 'Interpreting D* (Disparity Coefficient)',
    dStarDescription: 'D* indicates the divergence between S and P curves. Higher values mean more unexpected response patterns overall.',
    dStarItems: [
      'D* ≤ 0.5: Standard test results',
      '0.5 < D* ≤ 1.0: Some attention needed',
      'D* > 1.0: Consider test redesign',
    ],

    // Help - CSV Format
    csvSpecification: 'CSV Format Specification',
    csvSpecDescription: 'The following CSV format is supported:',
    basicRules: 'Basic Rules',
    csvRuleEncoding: 'Encoding: UTF-8 (with or without BOM) or Shift_JIS',
    csvRuleDelimiter: 'Delimiter: Comma (,)',
    csvRuleHeader: 'Row 1: Header row (problem IDs)',
    csvRuleData: 'Row 2+: Student data',
    csvRuleValue: 'Cell values: Correct=1 (or ○), Incorrect=0 (or ×)',
    fileExample: 'File Example',
    csvNote: '* The first cell in row 1 can be empty or any text (ignored)',
    limitations: 'Limitations',
    limitMaxStudents: 'Max students: 300',
    limitMaxProblems: 'Max problems: 60',
    limitValidValues: 'Valid cell values: 0, 1, ○, × only',
    limitEmptyCell: 'Empty cells are treated as 0',
    errorCases: 'Error Cases',
    errorDifferentColumns: 'Different column counts per row',
    errorInvalidValue: 'Values other than 0, 1, ○, ×',
    errorTooFewRows: 'Fewer than 2 rows (header only)',

    // Footer
    footerTheory: 'S-P Table Theory: Takahiro Sato (1969)',
    footerLab: 'Future University Hakodate, Tsuji Lab',
  },
};
