/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FixtureRow, TpForm, HeadType } from '../types';
import { Search, FilterX, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TpComparisonProps {
  fixtures: FixtureRow[];
  headers: string[];
}

export default function TpComparison({ fixtures, headers }: TpComparisonProps) {
  const [form, setForm] = useState<TpForm>({
    headType: '長頭型',
    dia: '',
    diaPos: '',
    diaNeg: '',
    len: '',
    lenPos: '',
    lenNeg: '',
    fDia: '',
    fDiaPos: '',
    fDiaNeg: '',
    fLen: '',
    fLenPos: '',
    fLenNeg: '',
    tpAng: '',
    gapMin: '',
    gapMax: '',
  });

  const [matchedIdx, setMatchedIdx] = useState<number[]>([]);
  const [tab, setTab] = useState<'match' | 'all'>('all');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const round3 = (num: number) => Math.round(num * 1000) / 1000;

  const targetPreview = useMemo(() => {
    const valOfInput = (v: any) => (typeof v === 'number' ? v : parseFloat(v) || 0);

    const fDia = valOfInput(form.fDia);
    const fDiaPos = valOfInput(form.fDiaPos);
    const fDiaNeg = valOfInput(form.fDiaNeg);
    const fLen = valOfInput(form.fLen);
    const dia = valOfInput(form.dia);
    const diaPos = valOfInput(form.diaPos);
    const diaNeg = valOfInput(form.diaNeg);
    const len = valOfInput(form.len);
    const gapMin = valOfInput(form.gapMin);
    const gapMax = valOfInput(form.gapMax);

    let mainDiaMin = 0;
    let mainDiaMax = 0;
    let label = '';
    let hasDepthLimit = false;
    let depthMin = '';
    let depthMax = '';

    if (form.headType === '長頭型') {
      mainDiaMin = round3((dia + diaPos) + gapMin);
      mainDiaMax = round3((dia + diaNeg) + gapMax);
      label = '管材或一階內徑範圍';
      hasDepthLimit = true;
      const dMin = round3(len + 0.1);
      depthMin = dMin.toFixed(3);
      depthMax = '∞';
    } else if (form.headType === '短頭型') {
      if (fLen >= 0.08) {
        mainDiaMin = round3((fDia + fDiaPos) + gapMin);
        mainDiaMax = round3((fDia + fDiaNeg) + gapMax);
        label = '第一階孔內徑範圍';
        hasDepthLimit = true;
        depthMin = '0.020';
        depthMax = round3(fLen - 0.02).toFixed(3);
      } else {
        mainDiaMin = 0;
        mainDiaMax = 0;
        label = '由頭型角度或外部規格自適應';
        hasDepthLimit = false;
      }
    } else if (form.headType === '鳳梨頭') {
      mainDiaMin = round3((fDia + fDiaPos) + gapMin);
      mainDiaMax = round3((fDia + fDiaNeg) + gapMax);
      label = '第一階孔內徑範圍';
      hasDepthLimit = false;
    }

    return {
      mainDiaMin: mainDiaMin.toFixed(3),
      mainDiaMax: mainDiaMax.toFixed(3),
      label,
      hasDepthLimit,
      depthMin,
      depthMax,
    };
  }, [form]);

  const updateForm = (key: keyof TpForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setColumnFilters({});
  };

  const handleFilterChange = (header: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [header]: val }));
  };

  const performSearch = () => {
    if (!fixtures.length) {
      alert('請先載入或上傳治具資料！');
      return;
    }

    const isClose = (a: number, b: number) => Math.abs(a - b) < 0.001;

    // 解析數值 helper
    const valOf = (v: any) => (typeof v === 'number' ? v : parseFloat(v) || 0);

    const fDia = valOf(form.fDia);
    const fDiaPos = valOf(form.fDiaPos);
    const fDiaNeg = valOf(form.fDiaNeg);
    const fLen = valOf(form.fLen);
    const fLenPos = valOf(form.fLenPos);
    const fLenNeg = valOf(form.fLenNeg);
    const dia = valOf(form.dia);
    const diaPos = valOf(form.diaPos);
    const diaNeg = valOf(form.diaNeg);
    const len = valOf(form.len);
    const lenPos = valOf(form.lenPos);
    const lenNeg = valOf(form.lenNeg);
    const tpAng = valOf(form.tpAng);
    const gapMin = valOf(form.gapMin);
    const gapMax = valOf(form.gapMax);

    const checkRowMatch = (row: any, allowedPds: string[]) => {
      const pd = String(row['PD分類'] || '').trim().toUpperCase();
      // 若圖面有填寫 PD分類，則判斷是否符合當前允許的 PD 種類；若圖面未帶 PD分類（如自訂上傳 Excel），則依幾何尺寸進行彈性比對
      if (pd && allowedPds.length > 0 && !allowedPds.includes(pd)) return false;

      const getVal = (primary: string, secondary: string) => {
        if (row[primary] !== undefined) return valOf(row[primary]);
        if (row[secondary] !== undefined) return valOf(row[secondary]);
        return 0;
      };

      const dbTube = valOf(row['管材內徑']);
      const dbTubeP = getVal('管材內徑正公差', '管材內徑公差(+)');
      const dbTubeN = getVal('管材內徑負公差', '管材內徑公差(-)');
      const dbID1 = valOf(row['第一階孔內徑']);
      const dbID1P = getVal('第一階孔內徑正公差', '第一階孔內徑公差(+)');
      const dbID1N = getVal('第一階孔內徑負公差', '第一階孔內徑公差(-)');
      const dbDepth1 = valOf(row['第一階孔深度']);
      const dbAngSurf = valOf(row['表面倒角角度']);
      const dbAng1 = valOf(row['第一階孔角度']);

      let ok = true;

      if (form.headType === '長頭型') {
        if (dbAngSurf > 0 && !isClose(dbAngSurf, tpAng)) ok = false;
        const tMin = (dia + diaPos) + gapMin;
        const tMax = (dia + diaNeg) + gapMax;
        const tubeMatch = isClose(tMin, dbTube - dbTubeN) && isClose(tMax, dbTube + dbTubeP);
        const idMatch = isClose(tMin, dbID1 - dbID1N) && isClose(tMax, dbID1 + dbID1P);
        if (!(tubeMatch || (idMatch && dbDepth1 > (len + 0.1)))) ok = false;
      } else if (form.headType === '短頭型') {
        if (fLen >= 0.08) {
          // 第一步：尋找 0.02 <= 第一階孔深度 <= (FLANGE長度 - 0.02)
          if (dbDepth1 < 0.02 || dbDepth1 > round3(fLen - 0.02)) ok = false;

          // 第二步：執行 (TP FLANGE直徑數值+正公差)+GAP最小值 = 第一階孔內徑+第一階孔負公差 
          // 與 (TP FLANGE直徑數值+負公差)+GAP最大值 = 第一階孔內徑+第一階孔正公差
          const tMin = (fDia + fDiaPos) + gapMin;
          const tMax = (fDia + fDiaNeg) + gapMax;
          if (!isClose(tMin, dbID1 - dbID1N) || !isClose(tMax, dbID1 + dbID1P)) ok = false;

          // 第三步：當 TP 角度 ≥ 30° 時：表面倒角角度 = TP 角度；當 TP 角度 < 30° 時：表面倒角角度必須在 30° 至 179° 區間
          if (dbAngSurf > 0) {
            if (tpAng >= 30) {
              if (!isClose(dbAngSurf, tpAng)) ok = false;
            } else {
              if (!(dbAngSurf >= 30 && dbAngSurf <= 179)) ok = false;
            }
          }
        } else {
          // 第一步：若有填寫表面倒角角度，確認表面倒角角度 = TP角度（若TP角度 < 30度則允許30~179度）
          if (dbAngSurf > 0) {
            if (tpAng >= 30) {
              if (!isClose(dbAngSurf, tpAng)) ok = false;
            } else {
              if (!(dbAngSurf >= 30 && dbAngSurf <= 179)) ok = false;
            }
          }

          // 第二步：確認 小徑直徑 <= 第一階孔內徑 < FLANGE直徑，若無 (即第一階孔內徑＝0) 則再確認 小徑直徑 <= 管材內徑 < FLANGE直徑
          let step2Ok = false;
          const lowerBound = round3(dia);
          const upperBound = fDia;

          if (dbID1 > 0) {
            if (round3(dbID1) >= lowerBound && round3(dbID1) < upperBound) {
              step2Ok = true;
            }
          } else {
            if (round3(dbTube) >= lowerBound && round3(dbTube) < upperBound) {
              step2Ok = true;
            }
          }
          if (!step2Ok) ok = false;
        }
      } else if (form.headType === '鳳梨頭') {
        if (dbAng1 > 0 && !isClose(dbAng1, 180)) ok = false;
        const tMin = (fDia + fDiaPos) + gapMin;
        const tMax = (fDia + fDiaNeg) + gapMax;
        if (!isClose(tMin, dbID1 - dbID1N) || !isClose(tMax, dbID1 + dbID1P)) ok = false;
      }

      return ok;
    };

    let res: number[] = [];
    if (form.headType === '長頭型') {
      fixtures.forEach((row) => {
        if (checkRowMatch(row, ['F11', 'F12', 'F13', 'F22', 'F23'])) {
          res.push(row._idx);
        }
      });
    } else if (form.headType === '短頭型') {
      // 1. 優先比對 F1、F14、F2、F21
      fixtures.forEach((row) => {
        if (checkRowMatch(row, ['F1', 'F14', 'F2', 'F21'])) {
          res.push(row._idx);
        }
      });
      // 2. 如沒有合適則再尋找 F11、F13
      if (res.length === 0) {
        fixtures.forEach((row) => {
          if (checkRowMatch(row, ['F11', 'F13'])) {
            res.push(row._idx);
          }
        });
      }
    } else if (form.headType === '鳳梨頭') {
      fixtures.forEach((row) => {
        if (checkRowMatch(row, ['F1', 'F14', 'F2', 'F21'])) {
          res.push(row._idx);
        }
      });
    }

    setMatchedIdx(res);
    setHasSearched(true);
    setTab(res.length > 0 ? 'match' : 'all');
    if (res.length === 0) {
      alert('比對完成：在目前設定下未找到符合的壓棒治具！');
    }
  };

  const filteredDisplayData = useMemo(() => {
    let baseData = fixtures;
    if (tab === 'match') {
      baseData = fixtures.filter((f) => matchedIdx.includes(f._idx));
    }
    return baseData.filter((row) => {
      return headers.every((h) => {
        const filterVal = (columnFilters[h] || '').toLowerCase();
        if (!filterVal) return true;
        return String(row[h] ?? '').toLowerCase().includes(filterVal);
      });
    });
  }, [fixtures, headers, tab, matchedIdx, columnFilters]);

  return (
    <div className="space-y-6">
      {/* 參數設定區卡片 */}
      <section className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-md">
        <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              壓棒參數設定區
            </h2>
            <p className="text-xs text-slate-500 mt-1">請填入壓棒頭型與各階徑長厚度規格</p>
          </div>
          <button
            onClick={() => {
              setForm({
                headType: '長頭型',
                dia: '', diaPos: '', diaNeg: '',
                len: '', lenPos: '', lenNeg: '',
                fDia: '', fDiaPos: '', fDiaNeg: '',
                fLen: '', fLenPos: '', fLenNeg: '',
                tpAng: '', gapMin: '', gapMax: '',
              });
              setMatchedIdx([]);
              setHasSearched(false);
            }}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase cursor-pointer"
          >
            重置所有輸入 ↺
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* 左側：基本設定 */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-wider">
                頭型規格選擇
              </label>
              <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
                {(['長頭型', '短頭型', '鳳梨頭'] as HeadType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateForm('headType', t)}
                    className={`py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                      form.headType === t
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-wider">
                  TP 角度 (°)
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.tpAng}
                  onChange={(e) => updateForm('tpAng', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="角度 (度)"
                  className="w-full h-11 px-3 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-wider">
                  GAP 設定
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="any"
                    value={form.gapMin}
                    onChange={(e) => updateForm('gapMin', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="最小"
                    className="w-full h-11 px-1 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.gapMax}
                    onChange={(e) => updateForm('gapMax', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="最大"
                    className="w-full h-11 px-1 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右側：精密數值 */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:border-l lg:pl-8 border-slate-100">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-blue-600 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  小徑直徑 (基準 / + / -)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="any"
                    value={form.dia}
                    onChange={(e) => updateForm('dia', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="基準"
                    className="h-11 text-center border-2 border-blue-100 bg-blue-50/20 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.diaPos}
                    onChange={(e) => updateForm('diaPos', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="+"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-emerald-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.diaNeg}
                    onChange={(e) => updateForm('diaNeg', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-rose-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-blue-600 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  小徑長度 (基準 / + / -)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="any"
                    value={form.len}
                    onChange={(e) => updateForm('len', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="基準"
                    className="h-11 text-center border-2 border-blue-100 bg-blue-50/20 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.lenPos}
                    onChange={(e) => updateForm('lenPos', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="+"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-emerald-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.lenNeg}
                    onChange={(e) => updateForm('lenNeg', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-rose-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-600 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  FLANGE 直徑 (基準 / + / -)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="any"
                    value={form.fDia}
                    onChange={(e) => updateForm('fDia', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="基準"
                    className="h-11 text-center border-2 border-slate-200 bg-slate-50 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.fDiaPos}
                    onChange={(e) => updateForm('fDiaPos', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="+"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-emerald-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.fDiaNeg}
                    onChange={(e) => updateForm('fDiaNeg', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-rose-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 mb-2 block uppercase tracking-wider flex items-center gap-1">
                  FLANGE 長度 (基準 / + / -)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="any"
                    value={form.fLen}
                    onChange={(e) => updateForm('fLen', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="基準"
                    className="h-11 text-center border-2 border-slate-200 bg-slate-50 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.fLenPos}
                    onChange={(e) => updateForm('fLenPos', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="+"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-emerald-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="number"
                    step="any"
                    value={form.fLenNeg}
                    onChange={(e) => updateForm('fLenNeg', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-"
                    className="h-11 text-center border-2 border-slate-200 rounded-xl text-rose-600 font-mono focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TARGET ANALYSIS (目標物理分析結果) */}
          <div className="col-span-12 pt-6 border-t border-slate-100">
            <span className="text-xs font-black text-slate-400 block uppercase tracking-wider mb-2.5 flex items-center gap-1.5 justify-between">
              <span>TARGET ANALYSIS (目標物理分析結果)</span>
              {hasSearched && (
                <span className="text-[10px] text-emerald-500 font-bold normal-case tracking-normal">已套用比對邏輯</span>
              )}
            </span>
            <div
              className={`bg-slate-900 rounded-2xl p-5 text-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-lg border border-slate-800 ${
                targetPreview.hasDepthLimit ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
              }`}
            >
              <div className="space-y-1 border-l-2 border-blue-500 pl-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  壓棒頭型與角度規格
                </span>
                <div className="text-lg font-black font-mono text-white">
                  {form.headType} <span className="text-slate-500 text-xs font-normal">({form.tpAng || '0'}°)</span>
                </div>
              </div>

              <div className="space-y-1 border-l-2 border-indigo-400 pl-4 bg-indigo-500/5 rounded-r-xl">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
                  {targetPreview.label || '比對目標規格'}
                </span>
                <div className="text-lg font-black font-mono text-indigo-300">
                  {parseFloat(targetPreview.mainDiaMin) > 0 || parseFloat(targetPreview.mainDiaMax) > 0 ? (
                    <>
                      {targetPreview.mainDiaMin} <span className="text-indigo-500 text-xs text-center mx-0.5">~</span> {targetPreview.mainDiaMax}
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs font-semibold">自適應角度無特定口徑限制</span>
                  )}
                </div>
              </div>

              {targetPreview.hasDepthLimit && (
                <div className="space-y-1 border-l-2 border-emerald-500 pl-4 bg-emerald-500/5 rounded-r-xl">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block">
                    判定深度限制範圍
                  </span>
                  <div className="text-lg font-black font-mono text-emerald-400">
                    {targetPreview.depthMin} <span className="text-emerald-600 text-xs text-center mx-0.5">~</span> {targetPreview.depthMax}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 執行比對按鈕 */}
          <div className="col-span-12">
            <button
              onClick={performSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              執行精密壓棒比對
            </button>
          </div>
        </div>
      </section>

      {/* 資料比對結果 */}
      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-md p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-lg">比對結果數據表</h3>
            {hasSearched && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${matchedIdx.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {matchedIdx.length > 0 ? `🎯 匹配: ${matchedIdx.length} 筆` : '無符合結果'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-0.5 rounded-lg flex">
              <button
                onClick={() => setTab('match')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  tab === 'match'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🎯 符合比對 ({matchedIdx.length})
              </button>
              <button
                onClick={() => setTab('all')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  tab === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📋 全部資料 ({fixtures.length})
              </button>
            </div>
            <button
              onClick={resetFilters}
              title="清除列表內所有篩選"
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <FilterX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 骨架表格或核心表格 */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-bold text-slate-700 sticky top-0 left-0 bg-slate-50 z-30 min-w-[70px] text-center border-r border-slate-200">
                  狀態
                </th>
                {headers.map((h) => (
                  <th key={h} className="p-3 font-bold text-slate-700 border-r border-slate-100 min-w-[130px] align-top sticky top-0 bg-slate-50 z-20">
                    <div className="flex flex-col gap-2">
                      <span className="whitespace-nowrap select-none">{h}</span>
                      <input
                        type="text"
                        value={columnFilters[h] || ''}
                        onChange={(e) => handleFilterChange(h, e.target.value)}
                        placeholder="搜尋..."
                        className="w-full text-[11px] font-normal px-2 py-1 bg-white border border-slate-200 rounded-md focus:border-blue-400 focus:outline-none text-slate-800"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisplayData.map((f) => {
                const isMatched = matchedIdx.includes(f._idx);
                return (
                  <tr
                    key={f._idx}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      isMatched ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="p-3 sticky left-0 bg-white z-10 text-center border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.01)] font-bold">
                      {isMatched ? (
                        <span className="inline-flex bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-black italic tracking-wide">
                          MATCH
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    {headers.map((h) => (
                      <td key={h} className="p-3 whitespace-nowrap text-slate-600 font-medium border-r border-slate-100">
                        {f[h] === '' || f[h] === undefined ? '-' : String(f[h])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDisplayData.length === 0 && (
            <div className="p-16 text-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-400 text-sm">查無符合選取條件或篩選字詞的治具數據</p>
              <p className="text-xs text-slate-400 mt-1">請嘗試放寬頂部的搜尋過濾規格或重置篩選</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
