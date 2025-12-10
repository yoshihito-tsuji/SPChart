/**
 * PDF出力ユーティリティ
 *
 * A4レイアウトでS-P表分析結果をPDF出力
 * 白黒印刷でも識別可能な配色
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { SPTableResult } from '../types/sp';

// A4サイズ（mm）
const A4_WIDTH = 210;
const A4_HEIGHT = 297;

// マージン（mm）
const MARGIN = 15;
const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;

/**
 * PDF出力用の配色（白黒印刷対応）
 * パターンで区別できるよう設計
 */
export const PDF_COLORS = {
  // テキスト
  text: '#000000',
  textSecondary: '#4a4a4a',

  // 背景
  headerBg: '#e5e5e5',
  normalBg: '#ffffff',
  warningBg: '#d9d9d9', // グレー（0.5-0.75）
  criticalBg: '#a6a6a6', // ダークグレー（0.75以上）

  // 曲線
  sCurve: '#000000', // 黒実線
  pCurve: '#666666', // グレー破線
};

interface GeneratePDFOptions {
  result: SPTableResult;
  chartElement?: HTMLElement | null;
  gridElement?: HTMLElement | null;
}

/**
 * PDFを生成してダウンロード
 */
export async function generatePDF(options: GeneratePDFOptions): Promise<void> {
  const { result, chartElement, gridElement } = options;
  const { summary, disparityCoefficient, sortedStudents, sortedProblems } = result;

  // PDFインスタンス作成（A4縦向き）
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPos = MARGIN;

  // タイトル
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('S-P表分析レポート', A4_WIDTH / 2, yPos, { align: 'center' });
  yPos += 10;

  // 日時
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleString('ja-JP');
  pdf.text(`出力日時: ${dateStr}`, A4_WIDTH / 2, yPos, { align: 'center' });
  yPos += 15;

  // サマリセクション
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('統計サマリ', MARGIN, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const summaryItems = [
    [`差異係数 (D*)`, disparityCoefficient.toFixed(4)],
    [`生徒数`, `${summary.studentCount}名`],
    [`問題数`, `${summary.problemCount}問`],
    [`平均得点`, `${summary.averageScore.toFixed(2)}点`],
    [`平均正答率`, `${(summary.averageCorrectRate * 100).toFixed(1)}%`],
    [`要注意生徒 (CS >= 0.5)`, `${summary.cautionStudentCount}名`],
    [`特に注意生徒 (CS >= 0.75)`, `${summary.highCautionStudentCount}名`],
    [`要注意問題 (CP >= 0.5)`, `${summary.cautionProblemCount}問`],
    [`特に注意問題 (CP >= 0.75)`, `${summary.highCautionProblemCount}問`],
  ];

  // 2列レイアウト
  const colWidth = CONTENT_WIDTH / 2;
  summaryItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = MARGIN + col * colWidth;
    const y = yPos + row * 5;

    pdf.text(`${item[0]}: ${item[1]}`, x, y);
  });

  yPos += Math.ceil(summaryItems.length / 2) * 5 + 10;

  // 凡例
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('凡例', MARGIN, yPos);
  yPos += 6;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  // 凡例の色サンプル
  const legendItems = [
    { label: '正常 (CS/CP < 0.5)', color: PDF_COLORS.normalBg },
    { label: '要注意 (0.5 <= CS/CP < 0.75)', color: PDF_COLORS.warningBg },
    { label: '特に注意 (CS/CP >= 0.75)', color: PDF_COLORS.criticalBg },
  ];

  legendItems.forEach((item, index) => {
    const x = MARGIN + index * 60;
    // 色サンプル矩形
    pdf.setFillColor(item.color);
    pdf.rect(x, yPos - 3, 4, 4, 'F');
    pdf.setDrawColor('#000000');
    pdf.rect(x, yPos - 3, 4, 4, 'S');
    // ラベル
    pdf.text(item.label, x + 6, yPos);
  });

  yPos += 12;

  // S-P曲線グラフ（画像として埋め込み）
  if (chartElement) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('S-P曲線', MARGIN, yPos);
    yPos += 5;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');

      // アスペクト比を維持しつつ幅に合わせる
      const imgWidth = CONTENT_WIDTH;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      // ページ境界チェック
      if (yPos + imgHeight > A4_HEIGHT - MARGIN) {
        pdf.addPage();
        yPos = MARGIN;
      }

      pdf.addImage(imgData, 'PNG', MARGIN, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10;
    } catch (e) {
      console.error('Chart capture failed:', e);
      pdf.text('(グラフの取得に失敗しました)', MARGIN, yPos);
      yPos += 10;
    }
  }

  // S-P表グリッド（サムネイル）
  if (gridElement) {
    // 新しいページに
    pdf.addPage();
    yPos = MARGIN;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('S-P表', MARGIN, yPos);
    yPos += 5;

    try {
      const canvas = await html2canvas(gridElement, {
        backgroundColor: '#ffffff',
        scale: 1.5,
      });
      const imgData = canvas.toDataURL('image/png');

      // 幅に合わせてスケール
      const imgWidth = CONTENT_WIDTH;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      // 高さが大きすぎる場合は縮小
      const maxHeight = A4_HEIGHT - yPos - MARGIN - 20;
      const finalHeight = Math.min(imgHeight, maxHeight);
      const finalWidth = (finalHeight / imgHeight) * imgWidth;

      pdf.addImage(imgData, 'PNG', MARGIN, yPos, finalWidth, finalHeight);
      yPos += finalHeight + 10;
    } catch (e) {
      console.error('Grid capture failed:', e);
      pdf.text('(表の取得に失敗しました)', MARGIN, yPos);
    }
  }

  // 要注意生徒リスト（CS >= 0.5）
  const cautionStudents = sortedStudents.filter(
    s => s.cautionIndex !== null && s.cautionIndex >= 0.5
  );

  if (cautionStudents.length > 0) {
    // 新しいページに
    pdf.addPage();
    yPos = MARGIN;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`要注意生徒一覧（${cautionStudents.length}名）`, MARGIN, yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    // ヘッダー
    pdf.text('ID', MARGIN, yPos);
    pdf.text('得点', MARGIN + 40, yPos);
    pdf.text('CS', MARGIN + 70, yPos);
    pdf.text('レベル', MARGIN + 100, yPos);
    yPos += 5;

    // 区切り線
    pdf.setDrawColor('#000000');
    pdf.line(MARGIN, yPos, A4_WIDTH - MARGIN, yPos);
    yPos += 3;

    cautionStudents.forEach(student => {
      if (yPos > A4_HEIGHT - MARGIN - 10) {
        pdf.addPage();
        yPos = MARGIN;
      }

      const level = student.cautionIndex! >= 0.75 ? '特に注意' : '要注意';

      pdf.text(student.id, MARGIN, yPos);
      pdf.text(String(student.totalScore), MARGIN + 40, yPos);
      pdf.text(student.cautionIndex!.toFixed(3), MARGIN + 70, yPos);
      pdf.text(level, MARGIN + 100, yPos);
      yPos += 5;
    });
  }

  // 要注意問題リスト（CP >= 0.5）
  const cautionProblems = sortedProblems.filter(
    p => p.cautionIndex !== null && p.cautionIndex >= 0.5
  );

  if (cautionProblems.length > 0) {
    yPos += 10;

    if (yPos > A4_HEIGHT - MARGIN - 30) {
      pdf.addPage();
      yPos = MARGIN;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`要注意問題一覧（${cautionProblems.length}問）`, MARGIN, yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    // ヘッダー
    pdf.text('ID', MARGIN, yPos);
    pdf.text('正答者数', MARGIN + 40, yPos);
    pdf.text('正答率', MARGIN + 70, yPos);
    pdf.text('CP', MARGIN + 100, yPos);
    pdf.text('レベル', MARGIN + 130, yPos);
    yPos += 5;

    pdf.line(MARGIN, yPos, A4_WIDTH - MARGIN, yPos);
    yPos += 3;

    cautionProblems.forEach(problem => {
      if (yPos > A4_HEIGHT - MARGIN - 10) {
        pdf.addPage();
        yPos = MARGIN;
      }

      const level = problem.cautionIndex! >= 0.75 ? '特に注意' : '要注意';

      pdf.text(problem.id, MARGIN, yPos);
      pdf.text(String(problem.correctCount), MARGIN + 40, yPos);
      pdf.text(`${(problem.correctRate * 100).toFixed(1)}%`, MARGIN + 70, yPos);
      pdf.text(problem.cautionIndex!.toFixed(3), MARGIN + 100, yPos);
      pdf.text(level, MARGIN + 130, yPos);
      yPos += 5;
    });
  }

  // フッター（全ページに）
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `SPChart - S-P表分析ツール | ページ ${i}/${pageCount}`,
      A4_WIDTH / 2,
      A4_HEIGHT - 8,
      { align: 'center' }
    );
  }

  // ダウンロード
  const timestamp = new Date().toISOString().slice(0, 10);
  pdf.save(`sp-report-${timestamp}.pdf`);
}
