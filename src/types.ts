/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FixtureRow {
  _idx: number;
  _origIdx?: number;
  'PD分類'?: string;
  '管材內徑'?: string | number;
  '管材內徑正公差'?: string | number;
  '管材內徑負公差'?: string | number;
  '第一階孔內徑'?: string | number;
  '第一階孔內徑正公差'?: string | number;
  '第一階孔內徑負公差'?: string | number;
  '第一階孔深度'?: string | number;
  '表面倒角角度'?: string | number;
  '第一階孔角度'?: string | number;
  '第二階孔內徑'?: string | number;
  '第二階孔內徑正公差'?: string | number;
  '第二階孔內徑負公差'?: string | number;
  [key: string]: any;
}

export type HeadType = '長頭型' | '短頭型' | '鳳梨頭';
export type PitchType = '0.2~0.35' | '0.4~0.5' | '0.6~1.0';

export interface TpForm {
  headType: HeadType;
  dia: number | '';
  diaPos: number | '';
  diaNeg: number | '';
  len: number | '';
  lenPos: number | '';
  lenNeg: number | '';
  fDia: number | '';
  fDiaPos: number | '';
  fDiaNeg: number | '';
  fLen: number | '';
  fLenPos: number | '';
  fLenNeg: number | '';
  tpAng: number | '';
  gapMin: number | '';
  gapMax: number | '';
}

export interface BaForm {
  pitch: PitchType;
  hasFlange: boolean;
  dia: number | '';
  diaUpper: number | '';
  diaLower: number | '';
  flangeDia: number | '';
  flangeDiaUpper: number | '';
  flangeDiaLower: number | '';
  flangeDistToBP: number | '';
  bpDia: number | '';
  bpDiaUpper: number | '';
  bpDiaLower: number | '';
  totalLength: number | '';
  dotDist: number | '';
}

export interface GapForm {
  min: number | '';
  max: number | '';
}
