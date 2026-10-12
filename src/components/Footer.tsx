import React, { useState } from 'react';
import { ShieldCheck, X, Cpu, Layers, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ activeModel?: string }> = ({
  activeModel = 'gemini-3.8-flash',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="mt-auto border-t border-cyan-500/25 bg-[#060911]/95 backdrop-blur-md py-3.5 px-4 text-xs shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2 font-mono">
          {/* 上段：横一列固定・計器ステータス */}
          <div className="flex items-center justify-center flex-nowrap gap-3 whitespace-nowrap text-[11px] sm:text-xs">
            {/* TESS & PEAK ONLINE（緑点滅） */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              </span>
              <span className="font-bold text-slate-200 tracking-wider">
                TESS & PEAK CORE ONLINE
              </span>
            </div>

            {/* 区切り線 */}
            <span className="text-slate-600 select-none shrink-0">|</span>

            {/* AUDIT ACTIVE（黄色点滅・クリック可能） */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 shrink-0 group cursor-pointer hover:opacity-90 transition-all rounded px-1.5 py-0.5 hover:bg-slate-800/60"
              title="クリックして稼働中モデルと自己監査ステータスを表示"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"
                  style={{ animationDuration: '1.2s' }}
                ></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
              </span>
              <span className="font-bold text-slate-200 tracking-wider group-hover:text-amber-300 transition-colors">
                AUDIT ACTIVE
              </span>
            </button>
          </div>

          {/* 下段：黄金プロデューサー表記 */}
          <div className="text-center pt-0.5">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent font-bold tracking-[0.2em] text-xs sm:text-sm drop-shadow-[0_1px_10px_rgba(245,158,11,0.7)]">
              Produced by HIDENII
            </span>
          </div>
        </div>
      </footer>

      {/* 隠しHUDモーダル（AUDIT ACTIVE クリック時） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#090f1d] border border-cyan-500/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.3)] text-slate-200 font-mono space-y-3.5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-bold tracking-wider">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
                <span>SYSTEM AUDIT & ENGINE STATUS</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* 現在稼働中モデル（息子さん向け・明快な稼働ステータス表示） */}
              {(() => {
                const isPrimary = activeModel.includes('3.8-flash');
                const isFailover =
                  activeModel.includes('3.7-flash') ||
                  activeModel.includes('3.6-flash') ||
                  activeModel.includes('3.5-flash');
                const isBank = !isPrimary && !isFailover;

                const badgeBg = isPrimary
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : isFailover
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                  : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300';

                const badgeText = isPrimary
                  ? '【メイン】最高品質稼働中'
                  : isFailover
                  ? '【フルスペック予備】自動フェイルオーバー中'
                  : '【オフライン救済】精選バンク';

                const descText = isPrimary
                  ? '文科省指導要領100%準拠・高精度記述ルーブリック採点'
                  : isFailover
                  ? '混雑時自動切替・フルスペックFlashにより品質低下ゼロで学習継続中'
                  : '東京書籍・開隆堂・啓林館 教科書シラバス準拠データベース';

                return (
                  <div className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                    isPrimary
                      ? 'bg-[#0e172a] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : isFailover
                      ? 'bg-[#091522] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-[#100e24] border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  }`}>
                    <div className="text-slate-400 font-sans text-[11px] font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Cpu className={`w-3.5 h-3.5 ${isPrimary ? 'text-emerald-400' : isFailover ? 'text-cyan-400' : 'text-indigo-400'}`} />
                        <span>現在稼働中モデル</span>
                      </span>
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-sans font-bold ${badgeBg}`}>
                        {badgeText}
                      </span>
                    </div>
                    <div className={`pt-0.5 font-bold text-base tracking-wider font-mono ${
                      isPrimary ? 'text-emerald-300' : isFailover ? 'text-cyan-300' : 'text-indigo-300'
                    }`}>
                      {activeModel}
                    </div>
                    <p className="text-[10px] text-slate-300 font-sans">
                      {descText}
                    </p>
                  </div>
                );
              })()}

              {/* モデル優先順位（多段フェイルオーバー仕様：Lite完全排除のフルスペックプール） */}
              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-700/80 space-y-2">
                <div className="text-slate-300 font-sans text-[11px] font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>モデル稼働アーキテクチャ</span>
                  </span>
                  <span className="text-[9px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded font-sans">
                    Lite完全排除・フルスペックプール
                  </span>
                </div>
                <div className="space-y-1.5 pt-0.5 text-[11px] font-mono">
                  {/* ① メインモデル */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
                    activeModel.includes('3.8-flash')
                      ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">① gemini-3.8-flash</span>
                        {activeModel.includes('3.8-flash') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-400">稼働中</span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                        最上位メイン・品質最優先（2回自動リトライ機構）
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 shrink-0 font-sans">第1優先</span>
                  </div>

                  {/* ② フルスペック第1予備 */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
                    activeModel.includes('3.7-flash')
                      ? 'bg-cyan-500/20 border-cyan-400/70 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">② gemini-3.7-flash</span>
                        {activeModel.includes('3.7-flash') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400">稼働中</span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                        フルスペック第1予備（3.8過負荷時の自動バトンタッチ）
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 shrink-0 font-sans">第2優先</span>
                  </div>

                  {/* ③ フルスペック第2予備 */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
                    activeModel.includes('3.6-flash')
                      ? 'bg-cyan-500/20 border-cyan-400/70 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">③ gemini-3.6-flash</span>
                        {activeModel.includes('3.6-flash') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400">稼働中</span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                        フルスペック第2予備（連続障害時の高品質バックアップ）
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 shrink-0 font-sans">第3優先</span>
                  </div>

                  {/* ④ フルスペック第3予備 */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
                    activeModel.includes('3.5-flash')
                      ? 'bg-cyan-500/20 border-cyan-400/70 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">④ gemini-3.5-flash</span>
                        {activeModel.includes('3.5-flash') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400">稼働中</span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                        フルスペック第3予備（広域障害時の最終AI防壁）
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 shrink-0 font-sans">第4優先</span>
                  </div>

                  {/* ⑤ オフライン救済バンク */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
                    !activeModel.includes('flash')
                      ? 'bg-indigo-500/15 border-indigo-400/60 text-indigo-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">⑤ 文科省指導要領精選バンク</span>
                        {!activeModel.includes('flash') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-400">稼働中</span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                        完全オフライン救済（通信断線時の絶対的セーフティネット）
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-400 shrink-0 font-sans">救済バンク</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0e172a] p-3 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="text-slate-300 font-sans text-[11px] font-semibold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>事前自己監査エンジン（3大監査）</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside font-sans pt-0.5">
                  <li>教科純度：他教科用語の混入を完全遮断</li>
                  <li>問数厳格：指定問数への完全合致（不整合即破棄）</li>
                  <li>指導要領：文部科学省指導要領100%準拠</li>
                  <li>柔軟採点：模範解答と意味が同じなら正解判定</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800">
              <span className="text-emerald-400 font-sans font-bold">ALL SYSTEMS NOMINAL 🟢</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans transition-colors cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
