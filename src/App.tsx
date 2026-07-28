/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FixtureRow } from './types';
import { SAMPLE_FIXTURES } from './data/sampleFixtures';
import TpComparison from './components/TpComparison';
import SmartMatch from './components/SmartMatch';
import RulesExplanation from './components/RulesExplanation';
import { FileSpreadsheet, Layers, Flame, FileCode, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [fileName, setFileName] = useState<string>('');
  const [fixtures, setFixtures] = useState<FixtureRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [activeSegment, setActiveSegment] = useState<'tp' | 'smart' | 'rules'>('tp');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Excel 檔案解析
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        if (!ev.target?.result) return;
        const bstr = ev.target.result;
        const workbook = XLSX.read(new Uint8Array(bstr as ArrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rawData.length > 0) {
          const keys = Object.keys(rawData[0] as any);
          setHeaders(keys);
          const mapped: FixtureRow[] = rawData.map((item: any, idx: number) => ({
            ...item,
            _idx: idx,
          }));
          setFixtures(mapped);
        } else {
          alert('Excel 檔案內不包含有效的數據列。');
        }
      } catch (err) {
        console.error(err);
        alert('解析 Excel 檔案失敗，請確認格式。');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 載入預設模擬資料
  const loadDefaultMockData = () => {
    setFileName('🏆 內建工業精密治具測試資料.xlsx');
    // 解析出 headers
    const keys = Object.keys(SAMPLE_FIXTURES[0]);
    setHeaders(keys);
    setFixtures(SAMPLE_FIXTURES);
  };

  // 確定清除資料
  const confirmClearData = () => {
    setFileName('');
    setFixtures([]);
    setHeaders([]);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 md:p-8 font-sans antialiased text-slate-800">
      <div className="max-w-[1500px] mx-auto space-y-6">
        
        {/* 頂部 Header & 數據匯入管理區 */}
        <header className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                TP / SMART MATCH
                <span className="bg-slate-900 text-white text-[10px] px-2.5 py-0.5 rounded-md font-black tracking-widest uppercase">
                  雙效精密比對系統
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">智慧校準。壓棒比對系統 與 銅管比對系統 二合一精密整合版</p>
            </div>
          </div>

          {/* 數據狀態與按鈕 */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
            {fileName ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  已載入 {fixtures.length} 筆精密治具資料
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  title="移除此資料"
                  className="p-2.5 text-rose-500 hover:bg-rose-50/70 rounded-xl border border-rose-100 hover:border-rose-200 transition-all cursor-pointer animate-in fade-in"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <label className="bg-slate-950 hover:bg-black text-white px-5 py-2.5 rounded-xl cursor-pointer text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  📥 匯入治具 EXCEL
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
                </label>
              </div>
            )}
          </div>
        </header>

        {/* 系統功能切換分頁 (系統級控制 Tabs) */}
        <div className="grid grid-cols-3 bg-white/80 backdrop-blur border border-slate-100 p-1.5 rounded-2xl max-w-2xl mx-auto shadow-sm">
          <button
            onClick={() => setActiveSegment('tp')}
            className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeSegment === 'tp'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            🚧
            壓棒精密比對
          </button>
          <button
            onClick={() => setActiveSegment('smart')}
            className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeSegment === 'smart'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            🔥
            銅管精密比對
          </button>
          <button
            onClick={() => setActiveSegment('rules')}
            className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              activeSegment === 'rules'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            📋
            公式與規則說明
          </button>
        </div>

        {/* 主要應用內容 */}
        {activeSegment === 'rules' ? (
          <RulesExplanation />
        ) : fixtures.length > 0 ? (
          <div>
            {activeSegment === 'tp' ? (
              <TpComparison fixtures={fixtures} headers={headers} />
            ) : (
              <SmartMatch fixtures={fixtures} headers={headers} />
            )}
          </div>
        ) : (
          /* Awaiting Data 空白提示 */
          <div className="py-24 text-center bg-white rounded-[2.5rem] border-3 border-dashed border-slate-100 shadow-sm max-w-4xl mx-auto flex flex-col items-center justify-center p-6 gap-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shadow-inner mb-2 animate-pulse">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-wider">等待規格治具數據庫</h2>
            <p className="text-slate-500 text-xs max-w-md leading-relaxed">
              請從右上方選擇 <strong>[📥 匯入治具 EXCEL]</strong> 來載入您在工廠的高精密規格治具清單檔，系統即可以展開所有精密配對與高精細維度規格篩選功能。
            </p>
          </div>
        )}

      </div>

      {/* 獨立刪除確認 Modal，避開 iframe 限制 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl border-t-[8px] border-rose-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-rose-50 p-2.5 rounded-2xl text-rose-600">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950">確認要清空治具資料嗎？</h3>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                這項操作將會把您目前上傳、載入的這份 <strong>{fileName || '資料'}</strong> 的比對規格庫從系統記憶體中完全卸載。卸載後將無法進行比對，您必須重新上傳 Excel 或重新載入測試資料。
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer"
                >
                  取消返回
                </button>
                <button
                  onClick={confirmClearData}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-black text-xs shadow-lg shadow-rose-100 transition-all cursor-pointer"
                >
                  確認清空資料
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
