import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Study DRILL Makers:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('study_drill_makers_scores');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-100">
              画面の表示中にエラーが発生しました
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              一時的な読み込み不整合またはデータ競合が発生しました。下のボタンを押して再読み込みしてください。
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-300">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>再読み込み</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>データ初期化して戻る</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
