/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  HelpCircle, 
  Activity, 
  Layers, 
  Info, 
  Settings, 
  Flame, 
  ChevronRight, 
  Scale, 
  CornerDownRight, 
  ArrowRight,
  GitCommit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RulesExplanation() {
  const [subTab, setSubTab] = useState<'tp' | 'smart' | 'fixture'>('tp');

  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-md space-y-8 animate-in fade-in duration-300">
      
      {/* 頂部引言 */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          比對運算公式與治具篩選規則
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          本說明手冊彙整了雙效精密比對系統（壓棒比對系統 與 銅管比對系統）的核心運算邏輯、物理幾何匹配公式及治具 PD 分類篩選標準，供品保工程與工廠技術人員校準、稽核使用。
        </p>
      </div>

      {/* 內部分頁導覽 */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        <button
          onClick={() => setSubTab('tp')}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            subTab === 'tp'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          🚧 壓棒比對公式 (TP)
        </button>
        <button
          onClick={() => setSubTab('smart')}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            subTab === 'smart'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          🔥 銅管比對公式 (SMART MATCH)
        </button>
        <button
          onClick={() => setSubTab('fixture')}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            subTab === 'fixture'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          📋 治具 PD 分類與規則對照
        </button>
      </div>

      {/* 內容渲染 */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {subTab === 'tp' && (
            <motion.div
              key="tp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* 長頭型 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="text-base font-black text-slate-950">長頭型 (Long Head) 運算邏輯</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-6 rounded-3xl border border-slate-100">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">PD 分類匹配範圍</span>
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        主要篩選 PD 分類：
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-mono">F11</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-mono">F12</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-mono">F13</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-mono">F22</span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-mono">F23</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">物理尺寸幾何匹配公式</span>
                      <div className="bg-white border border-slate-200/60 p-4 rounded-2xl space-y-3 font-mono text-xs shadow-sm">
                        <div className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">1. 角度匹配：</span>
                          <span>表面倒角角度 == TP 角度 </span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">2. 直徑配合界限：</span>
                          <div className="space-y-1">
                            <div><span className="text-slate-400">下限值：</span>tMin = (TP 直徑 + TP 正公差) + GAP 最小值</div>
                            <div><span className="text-slate-400">上限值：</span>tMax = (TP 直徑 + TP 負公差) + GAP 最大值</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-blue-600 font-bold">3. 治具匹配判定：</span>
                          <span>
                            滿足管材匹配：<code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMin == (管材內徑 - 管材內徑負公差)</code> 且 <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMax == (管材內徑 + 管材內徑正公差)</code>
                            <br />
                            或 滿足一階內徑匹配：<code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMin == (第一階孔內徑 - 第一階孔內徑負公差)</code> 且 <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMax == (第一階孔內徑 + 第一階孔內徑正公差)</code> 且 <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">第一階孔深度 &gt; (TP 長度 + 0.1)</code>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">主直徑與深度限制輸出</span>
                    <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-medium">管材或一階內徑下限</span>
                        <span className="font-mono font-bold text-slate-900">TP直徑 + TP正公差 + GAP Min</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-medium">管材或一階內徑上限</span>
                        <span className="font-mono font-bold text-slate-900">TP直徑 + TP負公差 + GAP Max</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-medium">深度限制最小值</span>
                        <span className="font-mono font-bold text-slate-900">TP長度 + 0.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">深度限制最大值</span>
                        <span className="font-mono font-bold text-slate-900">∞ (無上限)</span>
                      </div>
                    </div>
                    <div className="mt-4 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-[11px] text-blue-700 leading-relaxed font-medium">
                      💡 <strong>注意：</strong> 當長頭型未在管材上匹配成功時，若一階孔深度達標即可使用一階內徑進行二次精密匹配。
                    </div>
                  </div>
                </div>
              </div>

              {/* 短頭型 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <h3 className="text-base font-black text-slate-950">短頭型 (Short Head) 運算邏輯</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-6 rounded-3xl border border-slate-100">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">PD 優先級與多階尋找邏輯</span>
                      <p className="text-xs font-bold text-slate-700 flex flex-col gap-1">
                        <span className="flex items-center gap-1.5">
                          ❶ 第一優先匹配分類：
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-mono">F1</span>
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-mono">F14</span>
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-mono">F2</span>
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-mono">F21</span>
                        </span>
                        <span className="flex items-center gap-1.5 mt-1">
                          ❷ 備用第二優先分類：
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-mono">F11</span>
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-mono">F13</span>
                          <span className="text-slate-400 text-[10px] font-normal">（僅當第一優先查無任何治具時觸發）</span>
                        </span>
                      </p>
                    </div>

                    {/* 按長度分支 */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">物理尺寸匹配分支規範</span>
                      
                      {/* 分支一 */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-1.5">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[9px]">分支 A</span>
                          <span>FLANGE 長度 &ge; 0.08 mm 規格</span>
                        </div>
                        <div className="space-y-1.5 font-mono text-[11px] text-slate-600 leading-relaxed pl-1">
                          <div><strong>第一步 (深度)：</strong> 0.02 &le; 第一階孔深度 &le; (FLANGE長度 - 0.02)</div>
                          <div><strong>第二步 (直徑)：</strong> 
                            <div className="pl-4 text-slate-500 text-[10px]">
                              tMin = (FLANGE直徑 + FLANGE正公差) + GAP 最小值 == 第一階孔內徑 - 第一階孔內徑負公差
                              <br />
                              tMax = (FLANGE直徑 + FLANGE負公差) + GAP 最大值 == 第一階孔內徑 + 第一階孔內徑正公差
                            </div>
                          </div>
                          <div><strong>第三步 (角度)：</strong>
                            <div className="pl-4 text-slate-500 text-[10px]">
                              當 TP 角度 &ge; 30° 時：表面倒角角度 == TP 角度
                              <br />
                              當 TP 角度 &lt; 30° 時：表面倒角角度必須在 30° 至 179° 區間
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 分支二 */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-1.5">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px]">分支 B</span>
                          <span>FLANGE 長度 &lt; 0.08 mm 規格</span>
                        </div>
                        <div className="space-y-1.5 font-mono text-[11px] text-slate-600 leading-relaxed pl-1">
                          <div><strong>第一步 (角度)：</strong> 
                            <div className="pl-4 text-slate-500 text-[10px]">
                              當 TP 角度 &ge; 30° 時：表面倒角角度 == TP 角度
                              <br />
                              當 TP 角度 &lt; 30° 時：表面倒角角度必須在 30° 至 179° 區間
                            </div>
                          </div>
                          <div><strong>第二步 (徑向限制)：</strong> 
                            <div className="pl-4 text-[10px] text-slate-700 font-sans leading-relaxed">
                              若第一階孔內徑 &gt; 0：<strong>小徑直徑 &le; 第一階孔內徑 &lt; FLANGE 直徑</strong>
                              <br />
                              若無第一階孔（內徑=0）：<strong>小徑直徑 &le; 管材內徑 &lt; FLANGE 直徑</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">主直徑與深度限制輸出</span>
                      
                      <div className="text-xs font-bold text-slate-800 mb-2">當 FLANGE 長度 &ge; 0.08：</div>
                      <div className="space-y-2 text-xs leading-relaxed text-slate-600 pl-2 mb-4">
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="font-medium">第一階孔內徑下限</span>
                          <span className="font-mono text-slate-900 font-bold">FLANGE直徑 + FLANGE正公差 + GAP Min</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="font-medium">第一階孔內徑上限</span>
                          <span className="font-mono text-slate-900 font-bold">FLANGE直徑 + FLANGE負公差 + GAP Max</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="font-medium">深度限制最小值</span>
                          <span className="font-mono text-slate-900 font-bold">0.020</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="font-medium">深度限制最大值</span>
                          <span className="font-mono text-slate-900 font-bold">FLANGE長度 - 0.02</span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-800 mb-2">當 FLANGE 長度 &lt; 0.08：</div>
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed">
                        ⚠️ 此情況下，第一階內徑與深度改為自適應（在主畫面輸出為0或自適應標記），直接依據<strong>「孔內徑/管材內徑必須在 [小徑直徑, FLANGE 直徑) 之間」</strong>物理限制以及表面倒角角度進行精準過濾。
                      </div>
                    </div>
                    <div className="mt-4 bg-slate-900 text-white p-3 rounded-xl text-[10px] leading-relaxed">
                      💡 <strong>系統公式演變備註：</strong>
                      <br />
                      孔內徑區間下限已更新為以 <strong><code>小徑直徑</code></strong> 為基準（小徑直徑 &le; 孔內徑/管材內徑 &lt; FLANGE 直徑）。
                    </div>
                  </div>
                </div>
              </div>

              {/* 鳳梨頭 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-black text-slate-950">鳳梨頭 (Pineapple Head) 運算邏輯</h3>
                </div>

                <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">物理尺寸匹配公式</span>
                    <div className="bg-white border border-slate-200/60 p-4 rounded-2xl space-y-2.5 font-mono text-xs">
                      <div className="flex items-start gap-1">
                        <span className="text-emerald-700 font-bold">1. 角度匹配：</span>
                        <span>第一階孔角度 == 180° (水平直切面)</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-emerald-700 font-bold">2. 直徑匹配配合限：</span>
                        <div className="space-y-1">
                          <div>tMin = (TP FLANGE直徑 + TP FLANGE正公差) + GAP 最小值</div>
                          <div>tMax = (TP FLANGE直徑 + TP FLANGE負公差) + GAP 最大值</div>
                          <div>滿足：<code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMin == 第一階孔內徑 - 第一階孔內徑負公差</code> 且 <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">tMax == 第一階孔內徑 + 第一階孔內徑正公差</code></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">主直徑與深度限制輸出</span>
                    <div className="space-y-2.5 text-xs text-slate-600 font-sans leading-relaxed">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>第一階孔內徑下限</span>
                        <span className="font-mono font-bold text-slate-900">fDia + fDiaPos + gapMin</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>第一階孔內徑上限</span>
                        <span className="font-mono font-bold text-slate-900">fDia + fDiaNeg + gapMax</span>
                      </div>
                      <div className="flex justify-between">
                        <span>第一階深度限制</span>
                        <span className="text-slate-400">無深度限制 (適配各種通孔或多階孔)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {subTab === 'smart' && (
            <motion.div
              key="smart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* PITCH與GAP對照表 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h3 className="text-base font-black text-slate-950">1. Pitch 規格類別與 GAP 安全上限限制</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">PITCH 0.2 ~ 0.35</span>
                    <div className="text-xs text-slate-500 mt-2 font-medium">GAP 限制區間：</div>
                    <div className="text-lg font-mono font-extrabold text-slate-900">0.010 mm ~ 0.030 mm</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">PITCH 0.4 ~ 0.5</span>
                    <div className="text-xs text-slate-500 mt-2 font-medium">GAP 限制區間：</div>
                    <div className="text-lg font-mono font-extrabold text-slate-900">0.020 mm ~ 0.045 mm</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">PITCH 0.6 ~ 1.0</span>
                    <div className="text-xs text-slate-500 mt-2 font-medium">GAP 限制區間：</div>
                    <div className="text-lg font-mono font-extrabold text-slate-900">0.030 mm ~ 0.050 mm</div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl text-xs text-amber-900 leading-relaxed flex gap-2.5 items-start">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>注意：</strong> 若設定參數中勾選了 <strong>「是否有 FLANGE」</strong>（即為有凸緣工藝的銅管比對），無論 PITCH 的規格如何，系統一律會自動強制將 GAP 限制區間下限改為 <strong>0.010 mm 至 0.030 mm</strong>。
                  </div>
                </div>
              </div>

              {/* F1 與 深度計算公式 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <h3 className="text-base font-black text-slate-950">2. 第一階孔內徑 F1 及孔深度範圍匹配公式</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/70 p-6 rounded-3xl border border-slate-100">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">第一階孔內徑 (F1) 精密配合算法</span>
                      
                      <div className="space-y-2">
                        {/* 有FLANGE */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs font-mono">
                          <div className="text-slate-900 font-extrabold font-sans">是否有 FLANGE ＝「是」時：</div>
                          <div>f1Lower = (FLANGE直徑 + |FLANGE正公差|) + GAP 最小值</div>
                          <div>f1Upper = (FLANGE直徑 + FLANGE負公差) + GAP 最大值</div>
                        </div>

                        {/* 無FLANGE */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs font-mono">
                          <div className="text-slate-900 font-extrabold font-sans">是否有 FLANGE ＝「否」時：</div>
                          <div>f1Lower = (BA外徑直徑 + |BA外徑正公差|) + GAP 最小值</div>
                          <div>f1Upper = (BA外徑直徑 + BA外徑負公差) + GAP 最大值</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">第一階孔深度 (Depth) 計算基底</span>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs space-y-2">
                        <div className="font-mono text-xs">
                          <strong>深度基準值 Base：</strong> depthBase = (BA總長度 - 打點距離 - 0.44 mm)
                        </div>
                        <div className="text-[11px] text-slate-500 leading-relaxed font-sans pl-1.5 border-l-2 border-blue-500">
                          若 depthBase &gt; 0：孔深度下限為 <code className="bg-slate-50 px-1 rounded font-mono text-slate-900">depthBase - 0.4</code>；孔深度上限為 <code className="bg-slate-50 px-1 rounded font-mono text-slate-900">depthBase + 0.2</code>
                          <br />
                          若 depthBase &le; 0：孔深度下限及上限皆自動歸零為 <code className="bg-slate-50 px-1 rounded font-mono text-slate-900">0.000</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">系統匹配篩選標準</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        治具數據必須同時通過 <strong>F1 內徑公差匹配</strong> 與 <strong>第一階孔深度範圍</strong> 雙重篩選：
                      </p>
                      <div className="mt-3 space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>1. (第一階孔內徑 - |孔負公差|) == f1Lower</div>
                        <div>2. (第一階孔內徑 + |孔正公差|) == f1Upper</div>
                        <div>3. 孔深度下限 &le; 治具第一階孔深度 &le; 孔深度上限</div>
                      </div>
                    </div>

                    <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                      📌 <strong>PD分類過濾：</strong>
                      <br />
                      銅管比對系統僅在資料庫中的 <strong>F3、F31、F4、F41</strong> 這四種精密加工 PD 分類中搜尋匹配治具。
                    </div>
                  </div>
                </div>
              </div>

              {/* 第二階孔與管材比對(二次篩選) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-black text-slate-950">3. 二級防卡死配合：第二階孔 (F2) 與管材內徑 (Tube ID) 匹配規則</h3>
                </div>

                <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    當基本 F1 內徑與深度皆匹配後，系統將依據是否有 FLANGE 以及自動退回機制進行第二階段防卡死配合判定：
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                      <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 font-sans flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        3.1 選擇有 FLANGE 時
                      </div>
                      <div className="text-slate-600 space-y-2 pl-1">
                        <div>
                          <strong className="text-slate-800">1. 首選匹配（第二階孔內徑比對）：</strong>
                          <div className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded mt-1 font-mono">
                            baMax &le; secID &lt; flangeBPCheckLeft
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-800">2. 備用匹配（若首選無治具改比對管材內徑）：</strong>
                          <div className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded mt-1 font-mono">
                            baMax &le; tubeID &lt; flangeBPCheckLeft
                          </div>
                        </div>
                        <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 font-sans text-[11px] text-amber-900 leading-relaxed mt-2">
                          💡 <strong>退回機制：</strong> 若上述兩種 FLANGE 條件皆未找到任何治具，系統會自動改用備用防卡死公式（即 3.2 模式的首選與備用匹配）。
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                      <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 font-sans flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                        3.2 選擇無 FLANGE （或 FLANGE 模式沒找到治具時）
                      </div>
                      <div className="text-slate-600 space-y-2 pl-1">
                        <div>
                          <strong className="text-slate-800">1. 首選匹配（第二階孔內徑比對）：</strong>
                          <div className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded mt-1 font-mono">
                            bpMax &le; secID &lt; baMin
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-800">2. 備用匹配（若首選無治具改比對管材內徑）：</strong>
                          <div className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded mt-1 font-mono">
                            bpMax &le; tubeID &lt; baMin
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-3.5 rounded-xl border border-slate-100 font-sans space-y-1">
                    <div className="font-bold text-slate-900 mb-1">📌 公式與變數定義：</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                      <div>• secID = 第二階孔內徑 - |第二階孔內徑負公差|</div>
                      <div>• tubeID = 管材內徑 - |管材內徑負公差|</div>
                      <div>• bpMax = BP直徑 + |BP正公差| + GAP 最小值</div>
                      <div>• baMin = BA外徑直徑 + BA外徑負公差</div>
                      <div>• baMax = BA外徑直徑 + BA外徑正公差</div>
                      <div>• flangeBPCheckLeft = FLANGE直徑 + |FLANGE負公差| + GAP 最小值</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {subTab === 'fixture' && (
            <motion.div
              key="fixture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-base font-black text-slate-950">高精密加工治具 PD 分類與物理定義對照表</h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase font-black tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">PD 分類</th>
                      <th className="py-3 px-4">主適用系統</th>
                      <th className="py-3 px-4">物理幾何特徵說明</th>
                      <th className="py-3 px-4">典型加工製程用途</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F1</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">單一孔徑直切孔，無顯著倒角與肩部階梯，典型平頭式或極短Flange定位孔。</td>
                      <td className="py-3.5 px-4">一般短定位銷孔、簡易型頂出插銷治具配合孔。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F11</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">一階精密圓柱孔，入口處具有小於 30° 至 45° 的微型引導表面倒角。</td>
                      <td className="py-3.5 px-4">精密長定位銷引導孔、高速衝擊壓棒保護定位夾頭。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F12</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">一階孔入口倒角與主定位孔內徑過渡段經過精細圓弧平滑化（R角加工）。</td>
                      <td className="py-3.5 px-4">防止工件表面磨損的非接觸型、或低摩擦型配合引導套。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F13</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">一階孔具有特殊深度限制，通常帶有後端退刀槽或雙倒角角度防錯特徵。</td>
                      <td className="py-3.5 px-4">階梯軸承外圈配合孔、防拉脫精密壓棒滑套。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F14</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">極薄定位孔，配合極短肩部（FLANGE）進行小於 0.1mm 範疇的快速壓入定位。</td>
                      <td className="py-3.5 px-4">微型感測器探針、彈性頂針極短配合套筒。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F2 / F21</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">標準雙階梯孔（或二階孔徑），第一階與第二階具有顯著台階直徑差。</td>
                      <td className="py-3.5 px-4">雙肩導向定位銷、多階級進料精密壓棒座。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 bg-blue-50/10">F22 / F23</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">壓棒比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">多階複合孔，具有高達三階的內徑變化，且各階間帶有防干涉倒角或過渡面。</td>
                      <td className="py-3.5 px-4">高精密主軸多層防塵套、多行程複合氣動壓棒引導筒。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 bg-emerald-50/10">F3 / F31</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">銅管比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">單一高精密孔或單階梯孔，針對薄壁銅管打點與封口定位孔所設計。</td>
                      <td className="py-3.5 px-4">銅管製冷空調接頭打點封口治具、銅接頭精密沖壓定位孔。</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 bg-emerald-50/10">F4 / F41</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">銅管比對系統</td>
                      <td className="py-3.5 px-4 leading-relaxed">高深度多階複合定位孔，針對帶有外凸緣（Flange）或大深寬比銅管之特殊治具。</td>
                      <td className="py-3.5 px-4">車用熱交換器銅管束固定治具、冷凝器複合階梯引導孔。</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 text-xs text-slate-500 leading-relaxed">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong>系統篩選邏輯提醒：</strong> 比對系統在載入 Excel 後，會先過濾資料中的 <strong>「PD分類」</strong> 欄位。若該欄位的字串（自動去空白並轉大寫）與上述系統定義相符，才會被納入候選比對名單中，避免誤比對其他無關欄位的雜訊數據。
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
