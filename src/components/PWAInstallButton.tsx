import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        {isInstallable ? (
          <button
            onClick={handleInstallClick}
            type="button"
            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all active:scale-95 cursor-pointer border border-cyan-400/30"
            title="ワンタップでホーム画面・端末にインストール"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span>ホーム画面に追加</span>
          </button>
        ) : (
          <button
            onClick={() => setShowGuide(true)}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-[11px] font-medium transition cursor-pointer"
            title="ホーム画面への追加手順を確認"
          >
            <Smartphone className="w-3 h-3 text-cyan-400" />
            <span>ホーム追加手順</span>
            <HelpCircle className="w-3 h-3 opacity-60 ml-0.5" />
          </button>
        )}
      </div>

      {installSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>インストール完了！ホーム画面に追加されました</span>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-5 shadow-[0_0_35px_rgba(6,182,212,0.25)] text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-cyan-300">
                  ホーム画面への追加・インストール方法
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-3 text-xs leading-relaxed text-slate-300">
              {/* Android Chrome 特化ガイド */}
              <div className="rounded-xl bg-slate-900/90 border border-cyan-500/20 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[13px]">
                  <span>🤖 Android (Google Chrome) の場合</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>
                    Chromeの右上にある<strong>「︙」（メニュー）</strong>をタップ
                  </li>
                  <li>
                    メニュー一覧の<strong>「アプリをインストール」</strong>または<strong>「ホーム画面に追加」</strong>をタップ
                  </li>
                  <li>
                    確認画面で<strong>「インストール」</strong>または<strong>「追加」</strong>を押すと完了！
                  </li>
                </ol>
                <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 rounded-lg p-2 leading-normal">
                  💡 <strong>エラーが出る場合の対処法：</strong>
                  <br />
                  ・AI Studioの開発プレビュー枠内ではなく、<strong>独立したChromeタブ（URLバーが見える画面）</strong>で開いてください。
                  <br />
                  ・上記の手順でエラーになる場合は、Chromeの「︙」メニューで<strong>「PC版サイト」のチェックを外して</strong>再度お試しください。
                </div>
              </div>

              {/* iPhone Safari ガイド */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[13px]">
                  <span>🍏 iPhone / iPad (Safari) の場合</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>Safari下部（または上部）の<strong>共有ボタン（四角から上矢印）</strong>をタップ</li>
                  <li>メニューをスクロールして<strong>「ホーム画面に追加」</strong>をタップ</li>
                  <li>右上の<strong>「追加」</strong>をタップするとホーム画面に登録されます</li>
                </ol>
              </div>

              {/* PC Chrome / Edge ガイド */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[13px]">
                  <span>💻 パソコン (Chrome / Edge) の場合</span>
                </div>
                <p className="text-slate-300">
                  アドレスバー右端に表示される<strong>「インストール（パソコンに下矢印）」アイコン</strong>をクリックすると、独立アプリとして即座にインストールされます。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
