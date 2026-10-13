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
} from 'lucide-react';
import {
  getGasConfig,
  saveGasConfig,
  testGasConnection,
  getPendingQueue,
} from '../services/gasSync';

interface GasSyncSettingsAccordionProps {
  onConfigSaved?: () => void;
}

export const GasSyncSettingsAccordion: React.FC<GasSyncSettingsAccordionProps> = ({
  onConfigSaved,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
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
    setPendingCount(getPendingQueue().length);
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveGasConfig(url, token);
    setIsSaved(true);
    setTestResult(null);
    setTimeout(() => setIsSaved(false), 2500);
    if (onConfigSaved) onConfigSaved();
  };

  const handleTestConnection = async () => {
    // 保存してからテスト
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-base text-white tracking-wide">
                成績自動連携（スプレッドシート・GAS）
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isConfigured
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isConfigured ? '✓ 連携有効' : '未設定（端末内保存のみ）'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {isConfigured
                ? '演習完了時にスプレッドシートへ自動送信中'
                : 'URLと合言葉を設定すると、演習結果をシートへ自動送信できます'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center justify-center group-hover:border-emerald-500/50 transition">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <form onSubmit={handleSave} className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-3.5">
          <div className="text-xs text-slate-300 leading-relaxed space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>クラちゃん仕様・端末内完全独立連携</span>
            </div>
            <p className="text-[11px] text-slate-400">
              入力したURLと合言葉はこのスマホ端末内（localStorage）にのみ保存されます。未入力時は従来通り端末内完結で動作し、エラーも出ません。
            </p>
          </div>

          {/* 1. 成績の送り先URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-emerald-400" />
              <span>成績の送り先URL (GAS WebアプリURL)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition"
              autoComplete="off"
            />
          </div>

          {/* 2. 合言葉 (Token) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>合言葉 (Token)</span>
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="例: test1234"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
              autoComplete="off"
            />
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 border leading-relaxed ${
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
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition cursor-pointer active:scale-98"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>保存完了！</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>設定を保存</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !url.trim() || !token.trim()}
              className="py-2.5 px-3.5 rounded-xl border border-emerald-500/50 bg-emerald-950/50 hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="スプレッドシートへテスト行を送信して疎通確認"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>送信中...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>接続テスト</span>
                </>
              )}
            </button>
          </div>

          {/* Pending Queue Info */}
          {pendingCount > 0 && (
            <div className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg flex items-center justify-between">
              <span>オフライン未送信データ: {pendingCount}件</span>
              <span className="text-[10px] text-slate-400">次回オンライン時に自動再送</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
