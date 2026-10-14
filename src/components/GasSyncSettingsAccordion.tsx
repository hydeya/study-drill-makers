/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Key,
  Link,
  ShieldCheck,
  ExternalLink,
  Settings,
} from 'lucide-react';
import {
  getGasConfig,
  saveGasConfig,
  testGasConnection,
  getPendingQueue,
  getSpreadsheetUrl,
  saveSpreadsheetUrl,
  DEFAULT_SPREADSHEET_URL,
} from '../services/gasSync';

interface GasSyncSettingsAccordionProps {
  onConfigSaved?: () => void;
}

export const GasSyncSettingsAccordion: React.FC<GasSyncSettingsAccordionProps> = ({
  onConfigSaved,
}) => {
  // 外側のアコーディオン（📊成績一覧&分析）
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // 内側のアコーディオン（cla_chan仕様 詳細設定）
  const [isInnerOpen, setIsInnerOpen] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_SPREADSHEET_URL);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // 初期ロード
  useEffect(() => {
    const config = getGasConfig();
    setUrl(config.url);
    setToken(config.token);
    setSheetUrl(getSpreadsheetUrl());
    setPendingCount(getPendingQueue().length);
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveGasConfig(url, token);
    saveSpreadsheetUrl(sheetUrl);
    setIsSaved(true);
    setTestResult(null);
    setTimeout(() => setIsSaved(false), 2500);
    if (onConfigSaved) onConfigSaved();
  };

  const handleTestConnection = async () => {
    saveGasConfig(url, token);
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGasConnection(url, token);
      setTestResult(res);
      setPendingCount(getPendingQueue().length);
    } finally {
      setIsTesting(false);
    }
  };

  const isConfigured = Boolean(url.trim() && token.trim());

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-3.5 sm:p-4 shadow-xl transition-all">
      {/* Accordion Header */}
      <div className="flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center gap-2.5 text-left cursor-pointer group min-w-0"
          aria-expanded={isOpen}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-base text-white tracking-wide">
                📊成績一覧&分析
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isConfigured
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isConfigured ? '✓ 連携有効' : '未設定'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              スプレッドシートで最新の成績推移・弱点・教科バランスを確認
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center justify-center hover:border-emerald-500/50 transition shrink-0 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 space-y-3">
          {/* メイン: スプレッドシートに飛ぶボタン（最上位） */}
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/50 transition cursor-pointer active:scale-98 border border-emerald-400/40"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-100 shrink-0" />
            <span className="tracking-wide">成績一覧&グラフ</span>
            <ExternalLink className="w-4 h-4 text-emerald-200 shrink-0" />
          </a>

          {/* アコーディオン内アコーディオン: cla_chan仕様 詳細設定 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsInnerOpen(!isInnerOpen)}
              className="w-full p-2.5 px-3 flex items-center justify-between text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>⚙️ cla_chan仕様 連携・合言葉の設定</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span>{isInnerOpen ? '閉じる' : '設定を開く'}</span>
                {isInnerOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {isInnerOpen && (
              <form onSubmit={handleSave} className="p-3 pt-2 border-t border-slate-800/80 space-y-3">
                <div className="text-xs text-slate-300 leading-relaxed space-y-1 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>cla_chan仕様・端末内完全独立連携</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    入力した送り先URLと合言葉（Token）はこのスマホ端末内（localStorage）にのみ保存されます。
                  </p>
                </div>

                {/* 1. 成績の送り先URL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-emerald-400" />
                    <span>成績の送り先URL (GAS WebアプリURL)</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400 transition"
                    autoComplete="off"
                  />
                </div>

                {/* 2. 合言葉 (Token) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>合言葉 (Token: 例: hide / haruto)</span>
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="合言葉を入力"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition"
                    autoComplete="off"
                  />
                </div>

                {/* 3. スプレッドシート閲覧URL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3 h-3 text-cyan-400" />
                    <span>スプレッドシート閲覧URL</span>
                  </label>
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder={DEFAULT_SPREADSHEET_URL}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition"
                    autoComplete="off"
                  />
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div
                    className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border leading-relaxed ${
                      testResult.success
                        ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/50'
                        : 'bg-rose-950/70 text-rose-200 border-rose-500/50'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 font-medium">{testResult.message}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>設定を保存しました</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>設定を保存</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !url.trim() || !token.trim()}
                    className="py-2 px-3 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    title="スプレッドシートへテスト行を送信して疎通確認"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>送信中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>接続テスト</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pending Queue Info */}
                {pendingCount > 0 && (
                  <div className="text-[10px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg flex items-center justify-between">
                    <span>オフライン未送信: {pendingCount}件</span>
                    <span className="text-slate-400">次回オンライン時に自動再送</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
