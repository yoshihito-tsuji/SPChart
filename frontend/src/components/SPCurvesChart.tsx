/**
 * S曲線・P曲線グラフコンポーネント（ECharts使用）
 */

import ReactECharts from 'echarts-for-react';
import type { SPTableResult } from '../types/sp';

interface SPCurvesChartProps {
  result: SPTableResult;
}

export function SPCurvesChart({ result }: SPCurvesChartProps) {
  const { curves, summary } = result;

  // S曲線のデータ（0-1正規化を問題数・生徒数にスケール）
  const sCurveData = curves.sCurve.map(point => [
    point.x * summary.problemCount,
    point.y * summary.studentCount,
  ]);

  // P曲線のデータ
  const pCurveData = curves.pCurve.map(point => [
    point.x * summary.problemCount,
    point.y * summary.studentCount,
  ]);

  const option = {
    title: {
      text: 'S-P曲線',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['S曲線', 'P曲線'],
      bottom: 10,
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
    },
    xAxis: {
      type: 'value',
      name: '問題（易→難）',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
      max: summary.problemCount,
    },
    yAxis: {
      type: 'value',
      name: '生徒（高→低得点）',
      nameLocation: 'middle',
      nameGap: 40,
      min: 0,
      max: summary.studentCount,
      inverse: true, // 上から下へ
    },
    series: [
      {
        name: 'S曲線',
        type: 'line',
        data: sCurveData,
        smooth: false,
        step: 'end',
        lineStyle: {
          color: '#3b82f6', // blue-500
          width: 2,
        },
        itemStyle: {
          color: '#3b82f6',
        },
        showSymbol: false,
      },
      {
        name: 'P曲線',
        type: 'line',
        data: pCurveData,
        smooth: false,
        step: 'end',
        lineStyle: {
          color: '#ef4444', // red-500
          width: 2,
        },
        itemStyle: {
          color: '#ef4444',
        },
        showSymbol: false,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4">
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
}
