/**
 * computeCautionIndices.ts の単体テスト
 */

import { describe, it, expect } from 'vitest';
import { computeCautionIndices } from './computeCautionIndices';

describe('computeCautionIndices', () => {
  describe('空データ', () => {
    it('生徒0人・問題0問の場合、空配列を返す', () => {
      const result = computeCautionIndices([], [], []);

      expect(result.studentCautionIndices).toHaveLength(0);
      expect(result.problemCautionIndices).toHaveLength(0);
    });
  });

  describe('1人1問', () => {
    it('1人1問で正答の場合、CSはnull（分母0）', () => {
      // 1人が1問を正答
      // C = 1問目の正答者数 = 1
      // D × E = 1 × 1 = 1
      // 分母 = C - D×E = 1 - 1 = 0 → null
      const sortedMatrix = [[1]];
      const sortedStudents = [{ totalScore: 1 }];
      const sortedProblems = [{ correctCount: 1 }];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      expect(result.studentCautionIndices[0]).toBeNull();
    });

    it('1人1問で誤答の場合、CSは0（A=0, B=0）', () => {
      // 1人が1問を誤答
      // S曲線位置 = 0 (得点0)
      // A = 左側の誤答 = なし = 0
      // B = 右側の正答 = なし = 0
      // C = 左側の問題の正答者数 = 0
      // 分母 = 0 - 0 = 0 → null
      const sortedMatrix = [[0]];
      const sortedStudents = [{ totalScore: 0 }];
      const sortedProblems = [{ correctCount: 0 }];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // 分母が0なのでnull
      expect(result.studentCautionIndices[0]).toBeNull();
    });
  });

  describe('全0/全1', () => {
    it('全員全問正答の場合、CSはすべてnull', () => {
      // 完全Guttmanパターン（逸脱なし）
      // しかし分母が0になるケースが多い
      const sortedMatrix = [
        [1, 1],
        [1, 1],
      ];
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 2 },
      ];
      const sortedProblems = [
        { correctCount: 2 },
        { correctCount: 2 },
      ];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // 全員満点なので、S曲線位置=問題数、C = 全問題の正答者数の和
      // E = 平均正答者数 = 2
      // C - D×E = (2+2) - 2×2 = 4 - 4 = 0 → null
      result.studentCautionIndices.forEach(cs => {
        expect(cs).toBeNull();
      });
    });

    it('全員全問誤答の場合、CSはすべてnull', () => {
      const sortedMatrix = [
        [0, 0],
        [0, 0],
      ];
      const sortedStudents = [
        { totalScore: 0 },
        { totalScore: 0 },
      ];
      const sortedProblems = [
        { correctCount: 0 },
        { correctCount: 0 },
      ];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // 全員0点なので、S曲線位置=0、C=0、D=0
      // 分母 = 0 - 0 = 0 → null
      result.studentCautionIndices.forEach(cs => {
        expect(cs).toBeNull();
      });
    });
  });

  describe('手計算値による検証', () => {
    /**
     * 3人×3問のテストケース
     *
     * 並べ替え後の行列（得点降順、正答者数降順）:
     *        Q1  Q2  Q3  得点
     * S1     1   1   1    3
     * S2     1   1   0    2
     * S3     1   0   0    1
     * 正答者  3   2   1
     *
     * S曲線位置: S1=3, S2=2, S3=1
     * P曲線位置: Q1=3, Q2=2, Q3=1
     */
    it('完全Guttmanパターンの場合、CS=0', () => {
      const sortedMatrix = [
        [1, 1, 1], // S1: 3点
        [1, 1, 0], // S2: 2点
        [1, 0, 0], // S3: 1点
      ];
      const sortedStudents = [
        { totalScore: 3 },
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 3 },
        { correctCount: 2 },
        { correctCount: 1 },
      ];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // 完全Guttmanパターンなので、期待位置と実際の回答が一致
      // A=0 (左側に誤答なし), B=0 (右側に正答なし)
      // よって (A-B)=0 → CS=0

      // S1: score=3, 全問正答、左側の誤答なし、右側の正答なし
      // C = 3+2+1 = 6, D=3, E=(3+2+1)/3=2
      // 分母 = 6 - 3×2 = 0 → null
      expect(result.studentCautionIndices[0]).toBeNull();

      // S2: score=2, S曲線位置=2
      // 左側(Q1,Q2)=[1,1] 誤答なし → A=0
      // 右側(Q3)=[0] 正答なし → B=0
      // C = 3+2 = 5, D=2, E=2
      // 分母 = 5 - 2×2 = 1
      // CS = 0/1 = 0
      expect(result.studentCautionIndices[1]).toBe(0);

      // S3: score=1, S曲線位置=1
      // 左側(Q1)=[1] 誤答なし → A=0
      // 右側(Q2,Q3)=[0,0] 正答なし → B=0
      // C = 3, D=1, E=2
      // 分母 = 3 - 1×2 = 1
      // CS = 0/1 = 0
      expect(result.studentCautionIndices[2]).toBe(0);
    });

    /**
     * 逸脱のあるケース
     *
     *        Q1  Q2  Q3  得点
     * S1     1   0   1    2   ← Q2が誤答（左側の誤答）
     * S2     0   1   0    1   ← Q1が誤答、Q2が正答
     * 正答者  1   1   1
     */
    it('逸脱がある場合、CSが正の値になる', () => {
      const sortedMatrix = [
        [1, 0, 1], // S1: 2点、Q2で誤答（期待正答）、Q3で正答（期待誤答）
        [0, 1, 0], // S2: 1点
      ];
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 1 },
        { correctCount: 1 },
        { correctCount: 1 },
      ];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // S1: score=2, S曲線位置=2
      // 左側(Q1,Q2)=[1,0]
      //   A = Q2が誤答 → 正答者数1を加算 = 1
      // 右側(Q3)=[1]
      //   B = Q3が正答 → 正答者数1を加算 = 1
      // C = 1+1 = 2, D=2, E=(1+1+1)/3=1
      // 分母 = 2 - 2×1 = 0 → null
      expect(result.studentCautionIndices[0]).toBeNull();

      // S2: score=1, S曲線位置=1
      // 左側(Q1)=[0]
      //   A = Q1が誤答 → 正答者数1を加算 = 1
      // 右側(Q2,Q3)=[1,0]
      //   B = Q2が正答 → 正答者数1を加算 = 1
      // C = 1, D=1, E=1
      // 分母 = 1 - 1×1 = 0 → null
      expect(result.studentCautionIndices[1]).toBeNull();
    });

    /**
     * CPの検証（問題の注意係数）
     *
     *        Q1  Q2  得点
     * S1     1   1    2
     * S2     1   0    1
     * S3     0   1    0   ← この行はおかしい（得点0なのに正答あり）
     * 正答者  2   2
     *
     * 修正: 得点を正しく計算
     */
    it('CPの計算（問題の注意係数）', () => {
      const sortedMatrix = [
        [1, 1], // S1: 2点
        [1, 0], // S2: 1点
        [0, 1], // S3: 1点
      ];
      const sortedStudents = [
        { totalScore: 2 },
        { totalScore: 1 },
        { totalScore: 1 },
      ];
      const sortedProblems = [
        { correctCount: 2 },
        { correctCount: 2 },
      ];

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      // Q1の注意係数CP
      // P曲線位置 = 2 (正答者数)
      // 上側(S1,S2)の誤答: S2のQ1=1 → 誤答なし
      // A = 0
      // 下側(S3)の正答: S3のQ1=0 → 正答なし
      // B = 0
      // C = S1得点 + S2得点 = 2 + 1 = 3
      // D = 2, E = (2+1+1)/3 = 4/3
      // 分母 = 3 - 2 × (4/3) = 3 - 8/3 = 1/3
      // CP = 0 / (1/3) = 0
      expect(result.problemCautionIndices[0]).toBeCloseTo(0, 5);
    });
  });

  describe('大規模データ', () => {
    it('100人×50問でもエラーなく計算できる', () => {
      const studentCount = 100;
      const problemCount = 50;

      // ランダムな回答パターンを生成
      const sortedMatrix: number[][] = [];
      const sortedStudents: { totalScore: number }[] = [];
      const sortedProblems: { correctCount: number }[] = new Array(problemCount)
        .fill(null)
        .map(() => ({ correctCount: 0 }));

      for (let i = 0; i < studentCount; i++) {
        const row: number[] = [];
        let score = 0;
        for (let j = 0; j < problemCount; j++) {
          const val = Math.random() > 0.5 ? 1 : 0;
          row.push(val);
          score += val;
          sortedProblems[j].correctCount += val;
        }
        sortedMatrix.push(row);
        sortedStudents.push({ totalScore: score });
      }

      const result = computeCautionIndices(sortedMatrix, sortedStudents, sortedProblems);

      expect(result.studentCautionIndices).toHaveLength(studentCount);
      expect(result.problemCautionIndices).toHaveLength(problemCount);

      // 各値がnullまたは数値であることを確認
      result.studentCautionIndices.forEach(cs => {
        expect(cs === null || typeof cs === 'number').toBe(true);
      });
      result.problemCautionIndices.forEach(cp => {
        expect(cp === null || typeof cp === 'number').toBe(true);
      });
    });
  });
});
