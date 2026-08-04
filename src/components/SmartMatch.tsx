/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { FixtureRow, BaForm, GapForm, PitchType } from '../types';
import { Search, FilterX, AlertCircle, HelpCircle, Eye, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartMatchProps {
  fixtures: FixtureRow[];
  headers: string[];
}

export default function SmartMatch({ fixtures, headers }: SmartMatchProps) {
  const [ba, setBa] = useState<BaForm>({
    pitch: '0.6~1.0',
    hasFlange: false,
    dia: '',
    diaUpper: '',
    diaLower: '',
    flangeDia: '',
    flangeDiaUpper: '',
    flangeDiaLower: '',
    flangeDistToBP: '',
    bpDia: '',
    bpDiaUpper: '',
    bpDiaLower: '',
    totalLength: '',
    dotDist: '',
  });

  const [gap, setGap] = useState<GapForm>({ min: '', max: '' });
  const [activeTab, setActiveTab] = useState<'matched' | 'inventory'>('inventory');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const updateBa = (key: keyof BaForm, value: any) => {
    setBa((prev) => ({ ...prev, [key]: value }));
  };

  const updateGap = (key: keyof GapForm, value: any) => {
    setGap((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (header: string, val: string) => {
    setFilters((prev) => ({ ...prev, [header]: val }));
  };

  const round3 = (num: number) => Math.round(num * 1000) / 1000;

  // 動態顯示與限制
  const currentLimits = useMemo(() => {
    if (ba.hasFlange) return { min: 0.010, max: 0.030 };
    if (ba.pitch === '0.2~0.35') return { min: 0.010, max: 0.030 };
    if (ba.pitch === '0.4~0.5') return { min: 0.020, max: 0.045 };
    return { min: 0.030, max: 0.050 };
  }, [ba.pitch, ba.hasFlange]);

  // 單獨處理 input 四捨五入
  const valOf = (v: any) => (typeof v === 'number' ? v : parseFloat(v) || 0);

  const targetPreview = useMemo(() => {
    const gMin = valOf(gap.min);
    const gMax = valOf(gap.max);
    const bLen = valOf(ba.totalLength);
    const bDot = valOf(ba.dotDist);
    const bDia = valOf(ba.dia);
    const bUpper = valOf(ba.diaUpper);
    const bLower = valOf(ba.diaLower);
    const baMax = round3(bDia + Math.abs(bUpper));
    const baMin = round3(bDia + bLower);
    const bpMax = round3(valOf(ba.bpDia) + Math.abs(valOf(ba.bpDiaUpper)) + gMin);
    const flangeLowerMargin = valOf(ba.flangeDiaLower) <= 0 ? valOf(ba.flangeDiaLower) : -valOf(ba.flangeDiaLower);
    const flangeBPCheckLeft = round3(valOf(ba.flangeDia) + flangeLowerMargin + gMin);

    let f1L = 0;
    let f1U = 0;

    if (ba.hasFlange) {
      const fDia = valOf(ba.flangeDia);
      const fUpper = valOf(ba.flangeDiaUpper);
      const fLower = valOf(ba.flangeDiaLower);
      f1L = round3(fDia + Math.abs(fUpper) + gMin);
      f1U = round3(fDia + fLower + gMax);
    } else {
      f1L = round3(bDia + Math.abs(bUpper) + gMin);
      f1U = round3(bDia + bLower + gMax);
    }

    const showF2 = ba.hasFlange && valOf(ba.flangeDistToBP) > 0.8;
    const f2L = showF2 ? baMax : bpMax;
    const f2U = showF2 ? flangeBPCheckLeft : baMin;

    const depthBase = bLen > 0 ? round3(bLen - bDot - 0.44) : 0;

    return {
      f1Lower: f1L.toFixed(3),
      f1Upper: f1U.toFixed(3),
      showF2,
      f2Lower: f2L.toFixed(3),
      f2Upper: f2U.toFixed(3),
      tubeLower: (showF2 ? baMax : bpMax).toFixed(3),
      tubeUpper: (showF2 ? flangeBPCheckLeft : baMin).toFixed(3),
      depthMin: depthBase > 0 ? Math.max(0, round3(depthBase - 0.4)).toFixed(3) : "0.000",
      depthMax: depthBase > 0 ? round3(depthBase + 0.2).toFixed(3) : "0.000"
    };
  }, [ba, gap]);

  const performSearch = () => {
    if (!fixtures.length) {
      alert('請先載入或上傳治具清單！');
      return;
    }

    const gapMinNum = valOf(gap.min);
    const gapMaxNum = valOf(gap.max);

    if (gapMinNum > currentLimits.min || gapMaxNum > currentLimits.max) {
      alert(`⚠️ GAP 數值超出限制！\n目前限制為：Min ≤ ${currentLimits.min} / Max ≤ ${currentLimits.max}`);
      return;
    }

    const tMin = parseFloat(targetPreview.f1Lower);
    const tMax = parseFloat(targetPreview.f1Upper);
    const dMin = parseFloat(targetPreview.depthMin);
    const dMax = parseFloat(targetPreview.depthMax);

    const gMin = gapMinNum;
    const baMax = round3(valOf(ba.dia) + Math.abs(valOf(ba.diaUpper)));
    const baMin = round3(valOf(ba.dia) + valOf(ba.diaLower));
    const bpMax = round3(valOf(ba.bpDia) + Math.abs(valOf(ba.bpDiaUpper)) + gMin);
    const flangeLowerMargin = valOf(ba.flangeDiaLower) <= 0 ? valOf(ba.flangeDiaLower) : -valOf(ba.flangeDiaLower);
    const flangeBPCheckLeft = round3(valOf(ba.flangeDia) + flangeLowerMargin + gMin);

    const getVal = (row: any, primary: string, secondary: string) => {
      if (row[primary] !== undefined) return valOf(row[primary]);
      if (row[secondary] !== undefined) return valOf(row[secondary]);
      return 0;
    };

    const candidateMatches = fixtures.filter((row) => {
      const pd = String(row['PD分類'] || '').trim().toUpperCase();
      if (!['F3', 'F31', 'F4', 'F41'].includes(pd)) return false;

      const idNominal = valOf(row['第一階孔內徑']);
      const idPlus = Math.abs(getVal(row, '第一階孔內徑正公差', '第一階孔內徑公差(+)'));
      const idMinus = Math.abs(getVal(row, '第一階孔內徑負公差', '第一階孔內徑公差(-)'));
      const excelLower = round3(idNominal - idMinus);
      const excelUpper = round3(idNominal + idPlus);

      if (excelLower !== tMin || excelUpper !== tMax) return false;

      const depth = valOf(row['第一階孔深度']);
      return !isNaN(depth) && depth >= dMin && depth <= dMax;
    });

    const finalResults = candidateMatches.filter((row) => {
      const secVal = valOf(row['第二階孔內徑']);
      const tubeVal = valOf(row['管材內徑']);

      let valToCheck = 0;
      let isSecID = false;

      // 1. 首選：第二階孔內徑 (secID)；備用（若無第二階孔）：管材內徑 (tubeID)
      if (secVal > 0) {
        const secIDN = Math.abs(getVal(row, '第二階孔內徑負公差', '第二階孔內徑公差(-)'));
        valToCheck = round3(secVal - secIDN);
        isSecID = true;
      } else if (tubeVal > 0) {
        const tubeIDN = Math.abs(getVal(row, '管材內徑負公差', '管材內徑公差(-)'));
        valToCheck = round3(tubeVal - tubeIDN);
        isSecID = false;
      } else {
        return false;
      }

      // 2. 防卡死區段比對
      if (ba.hasFlange) {
        // FLANGE 模式首選/備用區段：baMax ≤ valToCheck < flangeBPCheckLeft
        if (valToCheck >= baMax && valToCheck < flangeBPCheckLeft) {
          return true;
        }
        // 若 FLANGE 區段未滿足，自動降級退回 BP~BA 區段比對：bpMax ≤ valToCheck < baMin
        if (valToCheck >= bpMax && valToCheck < baMin) {
          return true;
        }
        return false;
      } else {
        // 無 FLANGE 模式：bpMax ≤ valToCheck < baMin
        return valToCheck >= bpMax && valToCheck < baMin;
      }
    });

    const matchedIndices = finalResults.map((f) => f._idx);
    setSearchResults(matchedIndices);
    setHasSearched(true);

    if (matchedIndices.length === 0) {
      setShowDiagnosis(true);
    } else {
      setActiveTab('matched');
    }
  };

  const isMatched = (idx: number) => searchResults.includes(idx);

  const filteredData = useMemo(() => {
    return fixtures.filter((f) => {
      const isMatchTab = activeTab === 'matched' ? searchResults.includes(f._idx) : true;
      if (!isMatchTab) return false;

      return Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        return String(f[key] ?? '').toLowerCase().includes(String(val).toLowerCase());
      });
    });
  }, [fixtures, activeTab, searchResults, filters]);

  const clearInputs = () => {
    setBa({
      pitch: '0.6~1.0',
      hasFlange: false,
      dia: '', diaUpper: '', diaLower: '',
      flangeDia: '', flangeDiaUpper: '', flangeDiaLower: '', flangeDistToBP: '',
      bpDia: '', bpDiaUpper: '', bpDiaLower: '',
      totalLength: '', dotDist: '',
    });
    setGap({ min: '', max: '' });
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      {/* 參數設定面板 */}
      <section className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-md">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              銅管規格參數設定
            </h2>
            <p className="text-xs text-slate-500 mt-1">設定 BA 直徑、打點深度以及 GAP 最佳配合範圍</p>
          </div>
          <button
            onClick={clearInputs}
            className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase cursor-pointer"
          >
            清除所有輸入 ↺
          </button>
        </div>

        <div className="space-y-8 animate-in fade-in duration-300">
          {/* PITCH 規格 */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
              PITCH 規格類別選擇
            </span>
            <div className="grid grid-cols-3 md:flex max-w-6xl w-full bg-slate-100 p-1 rounded-xl">
              {(['0.2~0.35', '0.4~0.5', '0.6~1.0'] as PitchType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => updateBa('pitch', p)}
                  className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                    ba.pitch === p
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* BA 外徑 */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
              BA 外徑與公差填選
            </span>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-1 block mb-1">BA 直徑</label>
                <input
                  type="number"
                  step="any"
                  value={ba.dia}
                  onChange={(e) => updateBa('dia', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-500 ml-1 block mb-1">正公差 (+)</label>
                <input
                  type="number"
                  step="any"
                  value={ba.diaUpper}
                  onChange={(e) => updateBa('diaUpper', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-emerald-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-red-500 ml-1 block mb-1">負公差 (-)</label>
                <input
                  type="number"
                  step="any"
                  value={ba.diaLower}
                  onChange={(e) => updateBa('diaLower', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-rose-600"
                />
              </div>
            </div>
          </div>

          {/* FLANGE */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
              FLANGE 結構選項
            </span>
            <div
              className={`p-5 rounded-2xl border-2 border-dashed transition-all ${
                ba.hasFlange
                  ? 'bg-blue-50/20 border-blue-200 shadow-inner'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ba.hasFlange}
                  onChange={(e) => updateBa('hasFlange', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700">具備 FLANGE 結構</span>
              </label>

              <AnimatePresence>
                {ba.hasFlange && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-blue-100">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1">FL 直徑</label>
                        <input
                          type="number"
                          step="any"
                          value={ba.flangeDia}
                          onChange={(e) =>
                            updateBa('flangeDia', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full h-11 text-center border-2 border-slate-200 bg-white rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-blue-500 block mb-1">FL 正公差</label>
                        <input
                          type="number"
                          step="any"
                          value={ba.flangeDiaUpper}
                          onChange={(e) =>
                            updateBa('flangeDiaUpper', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full h-11 text-center border-2 border-slate-200 bg-white rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-red-500 block mb-1">FL 負公差</label>
                        <input
                          type="number"
                          step="any"
                          value={ba.flangeDiaLower}
                          onChange={(e) =>
                            updateBa('flangeDiaLower', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full h-11 text-center border-2 border-slate-200 bg-white rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-rose-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1">FL 距離 BP</label>
                        <input
                          type="number"
                          step="any"
                          value={ba.flangeDistToBP}
                          onChange={(e) =>
                            updateBa('flangeDistToBP', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full h-11 text-center border-2 border-slate-200 bg-white rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* BP 外徑 */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
              BP 外徑與公差填選
            </span>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-[10px] font-black text-slate-400 ml-1 block mb-1">BP 直徑</label>
                <input
                  type="number"
                  step="any"
                  value={ba.bpDia}
                  onChange={(e) => updateBa('bpDia', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-500 ml-1 block mb-1">正公差 (+)</label>
                <input
                  type="number"
                  step="any"
                  value={ba.bpDiaUpper}
                  onChange={(e) => updateBa('bpDiaUpper', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-emerald-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-red-500 ml-1 block mb-1">負公差 (-)</label>
                <input
                  type="number"
                  step="any"
                  value={ba.bpDiaLower}
                  onChange={(e) => updateBa('bpDiaLower', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all text-rose-600"
                />
              </div>
            </div>
          </div>

          {/* BA 總長與打點 */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">
              BA 總長、打點深入與 GAP 設定
            </span>
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-6 md:col-span-3">
                <label className="text-[10px] font-black text-slate-400 ml-1 block mb-1">BA 總長</label>
                <input
                  type="number"
                  step="any"
                  value={ba.totalLength}
                  onChange={(e) => updateBa('totalLength', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="text-[10px] font-black text-slate-400 ml-1 block mb-1">打點深度</label>
                <input
                  type="number"
                  step="any"
                  value={ba.dotDist}
                  onChange={(e) => updateBa('dotDist', e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-11 text-center border-2 border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* GAP 區間與安全值 */}
              <div className="col-span-12 md:col-span-3 bg-blue-50/30 p-2.5 rounded-2xl border border-blue-100 flex flex-col gap-1 justify-center">
                <span className="text-[9px] font-black text-blue-600 text-center uppercase tracking-wider block">
                  GAP Range Limit
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <span className="text-[8px] text-slate-400 block p-0.5">Min (≤{currentLimits.min})</span>
                    <input
                      type="number"
                      step="any"
                      value={gap.min}
                      onChange={(e) => updateGap('min', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-full h-9 p-1 font-mono text-xs text-center bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none ${
                        gap.min !== '' && gap.min > currentLimits.min ? 'border-red-500 bg-red-50/50 text-red-600 font-extrabold' : ''
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-slate-400 block p-0.5">Max (≤{currentLimits.max})</span>
                    <input
                      type="number"
                      step="any"
                      value={gap.max}
                      onChange={(e) => updateGap('max', e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-full h-9 p-1 font-mono text-xs text-center bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none ${
                        gap.max !== '' && gap.max > currentLimits.max ? 'border-red-500 bg-red-50/50 text-red-600 font-extrabold' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 執行比對按鈕 */}
              <div className="col-span-12 md:col-span-3">
                <button
                  onClick={performSearch}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white h-11 rounded-xl font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4" />
                  執行規格比對
                </button>
              </div>
            </div>
          </div>

          {/* Target Analysis */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-black text-slate-400 block uppercase tracking-wider mb-3">
              TARGET ANALYSIS (目標物理分析結果)
            </span>
            <div
              className={`bg-slate-900 rounded-2xl p-5 text-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-lg border border-slate-800 ${
                targetPreview.showF2 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              }`}
            >
              <div className="space-y-1 border-l-2 border-blue-500/20 pl-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  一階內徑範圍
                </span>
                <div className="text-xl font-black font-mono text-white">
                  {targetPreview.f1Lower} <span className="text-slate-500 text-xs text-center mx-1">~</span>{' '}
                  {targetPreview.f1Upper}
                </div>
              </div>

              {targetPreview.showF2 && (
                <div className="space-y-1 border-l-2 border-indigo-400 pl-4 bg-indigo-500/5 rounded-r-xl">
                  <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
                    二階內徑範圍 (FL)
                  </span>
                  <div className="text-xl font-black font-mono text-indigo-300">
                    {targetPreview.f2Lower} <span className="text-indigo-900 text-xs text-center mx-1">~</span>{' '}
                    {targetPreview.f2Upper}
                  </div>
                </div>
              )}

              <div className="space-y-1 border-l-2 border-blue-500/20 pl-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  管材內徑範圍
                </span>
                <div className="text-xl font-black font-mono text-white">
                  {targetPreview.tubeLower} <span className="text-slate-500 text-xs text-center mx-1">~</span>{' '}
                  {targetPreview.tubeUpper}
                </div>
              </div>

              <div className="space-y-1 border-l-2 border-emerald-500 pl-4">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest block">
                  預期深度範圍 (±0.4)
                </span>
                <div className="text-xl font-black font-mono text-emerald-400">
                  {targetPreview.depthMin} <span className="text-emerald-900 text-xs text-center mx-1">~</span>{' '}
                  {targetPreview.depthMax}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 庫存與篩選清單 */}
      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-md p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-lg">比對結果數據表</h3>
            {hasSearched && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${searchResults.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {searchResults.length > 0 ? `🎯 匹配: ${searchResults.length} 筆` : '無符合結果'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-0.5 rounded-lg flex">
              <button
                onClick={() => setActiveTab('matched')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'matched'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🎯 符合比對 ({searchResults.length})
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📋 全部資料 ({fixtures.length})
              </button>
            </div>
            <button
              onClick={() => setFilters({})}
              title="清除列表內所有篩選"
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <FilterX className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-bold text-slate-700 sticky top-0 left-0 bg-slate-50 z-30 min-w-[70px] text-center border-r border-slate-200">
                  狀態
                </th>
                {headers.map((header) => (
                  <th
                    key={'th-' + header}
                    className="p-3 font-bold text-slate-700 border-r border-slate-100 min-w-[130px] align-top sticky top-0 bg-slate-50 z-20"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="whitespace-nowrap select-none">{header}</span>
                      <input
                        type="text"
                        value={filters[header] || ''}
                        onChange={(e) => handleFilterChange(header, e.target.value)}
                        placeholder="搜尋..."
                        className="w-full text-[11px] font-normal px-2 py-1 bg-white border border-slate-200 rounded-md focus:border-blue-400 focus:outline-none text-slate-800"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((f) => {
                const isMatch = isMatched(f._idx);
                return (
                  <tr
                    key={f._origIdx || f._idx}
                    className={`hover:bg-blue-50/30 transition-colors ${
                      isMatch ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="p-3 sticky left-0 bg-white z-10 text-center border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.01)] font-bold">
                      {isMatch ? (
                        <span className="inline-flex bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-black italic tracking-wide">
                          MATCH
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    {headers.map((header) => (
                      <td
                        key={'td-' + header}
                        className="p-3 whitespace-nowrap text-slate-600 font-medium border-r border-slate-100"
                      >
                        {f[header] === '' || f[header] === undefined ? '-' : String(f[header])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-16 text-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-400 text-sm">查無符合選取條件或篩選字詞的治具數據</p>
              <p className="text-xs text-slate-400 mt-1">請嘗試放寬頂部的搜尋過濾規格或重置篩選</p>
            </div>
          )}
        </div>
      </section>

      {/* 彈出診斷 Modal */}
      <AnimatePresence>
        {showDiagnosis && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-sm w-full shadow-2xl border-b-[8px] border-red-500 text-center relative"
            >
              <div className="text-5xl mb-5 text-center">⚙️</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">未找到任何符合治具</h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed font-medium">
                当前設定的實體管材、打點物理計算下沒能滿足匹配的治具物件。
                建議確認 PITCH 規格或適度微調放寬 GAP 配合公差。
              </p>
              <button
                onClick={() => setShowDiagnosis(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-extrabold text-sm transition-all focus:outline-none cursor-pointer"
              >
                重新調整參數
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
