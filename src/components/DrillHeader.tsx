import React from 'react';

export const DrillHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#070b14] border-b border-cyan-500/20 py-3 sm:py-4 px-3 sm:px-6 sticky top-0 z-30 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="max-w-4xl mx-auto">
        {/* サイバーカード枠 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 to-[#0b1329]/95 border border-cyan-500/30 p-3.5 sm:p-5 shadow-[0_0_25px_rgba(6,182,212,0.12)]">
          {/* 背景の光彩エフェクト */}
          <div className="absolute top-0 left-1/4 w-96 h-20 bg-cyan-500/10 blur-3xl pointer-events-none -translate-y-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-20 bg-indigo-500/10 blur-3xl pointer-events-none translate-y-10"></div>

          {/* 上段：左アーカイブ名 ＆ 右「🗂️PRINT ARCHIVE」ボタンのみ配置 */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              </span>
              <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-cyan-400 uppercase">
                HIDENII DRILL ARCHIVE
              </span>
            </div>

            {/* 右側アクション：🗂️PRINT ARCHIVE（プリント問題集・保管アプリへ移動）のみ配置 */}
            <div>
              <a
                href="https://hidenii-print-archive.hyde-ya11-28-isso.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 hover:from-amber-900 hover:to-orange-950 border border-amber-500/50 hover:border-amber-400 text-[11px] sm:text-xs font-mono font-bold text-amber-300 hover:text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all active:scale-95 cursor-pointer"
                title="息子向け学習プリント一覧・保管アプリ（PRINT ARCHIVE）を開く"
              >
                <span className="text-xs sm:text-sm select-none">🗂️</span>
                <span className="tracking-wider">PRINT ARCHIVE</span>
              </a>
            </div>
          </div>

          {/* 中段：メインタイトル（絵文字＋黄金グラデーション） */}
          <div className="py-2 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider flex items-center justify-center gap-2">
              <span className="text-xl sm:text-3xl select-none inline-block filter-none">📝</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 drop-shadow-[0_2px_14px_rgba(245,158,11,0.5)]">
                【Study DRILL Makers】
              </span>
              <span className="text-xl sm:text-3xl select-none inline-block filter-none">📝</span>
            </h3>
          </div>

          {/* 下段：サブタイトル */}
          <div className="pt-0.5 text-center">
            <p className="text-[11px] sm:text-[13px] text-slate-400 font-medium tracking-wide">
              文部科学省中学学習指導要領準拠/《神》Ver5.5&《匠》Ver4.4
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
