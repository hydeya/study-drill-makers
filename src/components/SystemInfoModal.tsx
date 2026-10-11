import React, { useState } from 'react';
import {
  Cpu,
  X,
  BookOpen,
  Smartphone,
  CheckCircle2,
  Download,
  Volume2,
  Flame,
  Star,
  Sprout,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'guide' | 'install';
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'guide',
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'install'>(defaultTab);
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const ok = await install();
    if (ok) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-[#0b1329] to-[#070b14] border border-cyan-500/40 p-4 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 背景の光彩 */}
        <div className="absolute top-0 right-10 w-72 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* ヘッダー */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-cyan-500/20 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-black text-cyan-300 tracking-wider">
                  【StudyDRILLMakers】使い方＆方針・仕様ガイド
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                学習方針・AI自己監査仕様 ＆ アプリ操作・ホーム画面追加
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ切り替え */}
        <div className="flex items-center gap-2 pt-3 pb-2 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>📖 使い方 ＆ 学習方針・AI自己監査仕様</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
              activeTab === 'install'
                ? 'bg-gradient-to-r from-indigo-600/40 to-cyan-600/40 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>📲 ホーム画面追加方法</span>
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 pt-2 text-xs sm:text-sm leading-relaxed text-slate-300 relative z-10">
          {/* TAB 1: アプリの使い方 */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* 概要 */}
              <div className="rounded-xl bg-slate-900/90 border border-cyan-500/30 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>文部科学省中学学習指導要領準拠 ドリルマスター</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  本アプリは、中学校全7教科（国語・数学・英語・理科・地理・歴史・公民）の定期テスト〜高校入試突破を目的とした自学自習用演習システムです。一問一答形式で重要語句と本質的な理解を最短ルートで定着させます。
                </p>
              </div>

              {/* 学習の流れ 4ステップ */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
                  ■ 学習の基本ステップ
                </h4>

                {/* Step 1 */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-cyan-900/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono font-black text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-100 text-xs">教科・学年・単元の選択</p>
                    <p className="text-slate-400 text-[11px] leading-normal">
                      学びたい教科（7教科メタリックカラー）と学年を選び、学校の教科書進度や定期テスト範囲に合わせて単元を選択します。
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-cyan-900/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono font-black text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-100 text-xs">目的別の3段階難易度</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                      <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px]">
                        <span className="font-bold text-emerald-300 flex items-center gap-1">
                          <Sprout className="w-3 h-3" /> 基礎（4択+記述）
                        </span>
                        <span className="text-slate-400 block mt-0.5">用語の確認・導入学習</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[10px]">
                        <span className="font-bold text-cyan-300 flex items-center gap-1">
                          <Star className="w-3 h-3" /> 標準（記述メイン）
                        </span>
                        <span className="text-slate-400 block mt-0.5">定期テスト対策・本番形式</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px]">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> 応用（発展全問記述）
                        </span>
                        <span className="text-slate-400 block mt-0.5">高校入試・実力練成</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-cyan-900/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono font-black text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-100 text-xs">回答入力 ＆ 即時自動採点</p>
                    <p className="text-slate-400 text-[11px] leading-normal">
                      画面上のスマートキーボードまたは端末のキーボードで解答を入力。漢字・ひらがな・重要語句の表記ゆれにも対応したAI自己監査システムが即座に正誤を判定します。
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-cyan-900/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono font-black text-xs shrink-0">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-100 text-xs">解説精読 ＆ 音声読み上げによる定着</p>
                    <p className="text-slate-400 text-[11px] leading-normal">
                      間違えた問題はなぜその答えになるのか、指導要領に即した要点解説をしっかり確認。問題文横および解説欄のスピーカーボタン（🔊）を押せば、ブラウザ音声合成により問題文や解説を耳から聴いて復習できます。
                    </p>
                  </div>
                </div>
              </div>

              {/* プリント保管アプリ PRINT ARCHIVE 連携案内 */}
              <div className="rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border border-amber-500/40 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                    <span className="text-base">🗂️</span>
                    <span>プリント問題集（PRINT ARCHIVE）連携</span>
                  </div>
                  <a
                    href="https://hidenii-print-archive.hyde-ya11-28-isso.workers.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[10px] font-bold flex items-center gap-1 transition"
                  >
                    <span>開く</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  右上の【🗂️PRINT ARCHIVE】をタップするとプリント問題集アプリに移動します。教科・学年別に作成・保管された自作学習プリント（PDF）を一覧・閲覧できます。
                </p>
              </div>

              {/* 学習のコツ */}
              <div className="rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900/80 border border-amber-500/30 p-3 space-y-1.5 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  💡 テスからの学習アドバイス
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1回解いて終わりにせず、スコアが100%になるまで繰り返し演習しましょう。間違えた問題だけを再挑戦する「ミス問題復習」を活用すると、短時間で得点力が大幅に向上します！
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ホーム画面追加方法 */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* ワンタップインストール可能端末向け */}
              {isInstallable && (
                <div className="rounded-xl bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-indigo-950/80 border border-cyan-400 p-3.5 space-y-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-cyan-400 animate-bounce" />
                      <div>
                        <p className="font-bold text-white text-xs sm:text-sm">
                          この端末にアプリを直接追加できます
                        </p>
                        <p className="text-[11px] text-cyan-300">
                          ワンタップでホーム画面・アプリ一覧に登録されます
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs tracking-wider shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>ホーム画面にインストールする</span>
                  </button>
                </div>
              )}

              {installSuccess && (
                <div className="flex items-center gap-2 bg-emerald-600/90 text-white p-3 rounded-xl text-xs font-bold border border-emerald-400 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>インストールが完了しました！ホーム画面から開けます。</span>
                </div>
              )}

              {/* iPhone / iPad */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-xs sm:text-sm">
                    <span className="text-base">🍏</span>
                    <span>iPhone / iPad（Safari）の手順</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    Safari専用
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[11px] sm:text-xs text-slate-300 pl-1">
                  <li>
                    共有URLを<strong>必ず標準ブラウザ「Safari」</strong>で開きます。
                    <span className="block text-[10px] text-amber-300/90 ml-4 mt-0.5">
                      ※LINEやメール内ブラウザではなく、Safariで開く必要があります。
                    </span>
                  </li>
                  <li>
                    画面下部中央（iPadは上部）にある<strong>「共有アイコン（四角から上矢印が出ているマーク）」</strong>をタップします。
                  </li>
                  <li>
                    メニューを下にスクロールし、<strong>「ホーム画面に追加」</strong>をタップします。
                  </li>
                  <li>
                    右上の<strong>「追加」</strong>を押すと、ホーム画面にアイコンが作成され、全画面アプリとして起動できるようになります。
                  </li>
                </ol>
              </div>

              {/* Android */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-xs sm:text-sm">
                    <span className="text-base">🤖</span>
                    <span>Android（Google Chrome）の手順</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    Chrome推奨
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-[11px] sm:text-xs text-slate-300 pl-1">
                  <li>
                    Google Chromeで共有URLを開きます。
                  </li>
                  <li>
                    画面右上にある<strong>「︙」（縦の3点リーダー）</strong>をタップします。
                  </li>
                  <li>
                    メニュー内の<strong>「アプリをインストール」</strong>または<strong>「ホーム画面に追加」</strong>をタップします。
                  </li>
                  <li>
                    表示される確認ダイアログで<strong>「インストール」</strong>を押すと完了です。
                  </li>
                </ol>
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-200 leading-normal">
                  💡 <strong>うまく追加できない場合：</strong>Chromeの「︙」メニューで「PC版サイト」のチェックが外れているか確認してください。
                </div>
              </div>

              {/* PC Chrome / Edge */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-xs sm:text-sm">
                    <span className="text-base">💻</span>
                    <span>パソコン（Chrome / Edge）の手順</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    デスクトップ版
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  アドレスバー（URL欄）の右端に表示される<strong>「インストール（下矢印付きのモニターアイコン）」</strong>をクリックするだけで、独立ウィンドウで動作するデスクトップアプリとして登録されます。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="pt-3 sm:pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
          <span className="text-[10px] font-mono text-slate-500">
            Study DRILL Makers Ver5.5
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
