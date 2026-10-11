import React, { useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Trash2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SUBJECT_CONFIGS, ALL_UNITS_MASTER } from '../data/units';
import { ScoreStore, SubjectId, UnitMaster, UnitScoreRecord } from '../types';

interface SubjectHistoryAccordionProps {
  scores: ScoreStore;
  onResetRequest: () => void;
  onSelectSubject?: (subjectId: SubjectId) => void;
}

interface PracticedUnitDetail {
  unit: UnitMaster;
  record: UnitScoreRecord;
}

interface SubjectStatItem {
  id: SubjectId;
  name: string;
  emoji: string;
  themeColor: string;
  allowedYears: (1 | 2 | 3)[];
  drillsCount: number;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number | null;
  practicedUnits: PracticedUnitDetail[];
}

// 7教科固有の枠線・シャドウ定義（ライトサイバー／プラチナシルバーシート用）
const SUBJECT_THEME_BORDER_MAP: Record<
  SubjectId,
  {
    border: string;
    shadow: string;
    badgeBorder: string;
  }
> = {
  japanese: {
    border: 'border-[#800020]',
    shadow: 'shadow-[0_2px_10px_rgba(128,0,32,0.10)]',
    badgeBorder: 'border-[#800020]',
  },
  math: {
    border: 'border-[#007BFF]',
    shadow: 'shadow-[0_2px_10px_rgba(0,123,255,0.10)]',
    badgeBorder: 'border-[#007BFF]',
  },
  english: {
    border: 'border-[#FF8C00]',
    shadow: 'shadow-[0_2px_10px_rgba(255,140,0,0.10)]',
    badgeBorder: 'border-[#FF8C00]',
  },
  science: {
    border: 'border-[#16a34a]',
    shadow: 'shadow-[0_2px_10px_rgba(22,163,74,0.10)]',
    badgeBorder: 'border-[#16a34a]',
  },
  geography: {
    border: 'border-[#8B4513]',
    shadow: 'shadow-[0_2px_10px_rgba(139,69,19,0.10)]',
    badgeBorder: 'border-[#8B4513]',
  },
  history: {
    border: 'border-[#6a0dad]',
    shadow: 'shadow-[0_2px_10px_rgba(106,13,173,0.10)]',
    badgeBorder: 'border-[#6a0dad]',
  },
  civics: {
    border: 'border-[#db2777]',
    shadow: 'shadow-[0_2px_10px_rgba(219,39,119,0.10)]',
    badgeBorder: 'border-[#db2777]',
  },
};

export const SubjectHistoryAccordion: React.FC<SubjectHistoryAccordionProps> = ({
  scores,
  onResetRequest,
  onSelectSubject,
}) => {
  // Main accordion state: open or closed
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Track which individual subject's unit breakdown is expanded
  const [expandedSubject, setExpandedSubject] = useState<SubjectId | null>(null);

  // Compute aggregate stats per subject
  const subjectStats: SubjectStatItem[] = SUBJECT_CONFIGS.map((subj) => {
    const units = ALL_UNITS_MASTER.filter((u) => u.subjectId === subj.id);
    let drillsCount = 0;
    let totalQuestions = 0;
    let correctQuestions = 0;
    const practicedUnits: PracticedUnitDetail[] = [];

    for (const u of units) {
      const rec = scores[u.id];
      if (rec && rec.drillsCount > 0) {
        drillsCount += rec.drillsCount;
        totalQuestions += rec.total;
        correctQuestions += rec.correct;
        practicedUnits.push({ unit: u, record: rec });
      }
    }

    const accuracy =
      totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : null;

    return {
      id: subj.id,
      name: subj.name,
      emoji: subj.iconEmoji,
      themeColor: subj.themeColor,
      allowedYears: subj.allowedYears,
      drillsCount,
      totalQuestions,
      correctQuestions,
      accuracy,
      practicedUnits,
    };
  });

  // Overall totals across all 7 subjects
  const totalDrillsAll = subjectStats.reduce((sum, s) => sum + s.drillsCount, 0);
  const totalQuestionsAll = subjectStats.reduce((sum, s) => sum + s.totalQuestions, 0);
  const totalCorrectAll = subjectStats.reduce((sum, s) => sum + s.correctQuestions, 0);
  const overallAccuracy =
    totalQuestionsAll > 0 ? Math.round((totalCorrectAll / totalQuestionsAll) * 100) : null;

  // Count practiced subjects
  const practicedSubjectCount = subjectStats.filter((s) => s.drillsCount > 0).length;

  const toggleSubjectDetail = (subjectId: SubjectId) => {
    setExpandedSubject((prev) => (prev === subjectId ? null : subjectId));
  };

  return (
    <div
      className={`w-full bg-[#0b1329]/95 rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-2 border-cyan-500/50 shadow-2xl'
          : 'border-2 border-fuchsia-500/70 shadow-[0_0_18px_rgba(217,70,239,0.25)] hover:border-fuchsia-400'
      }`}
    >
      {/* Accordion Master Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3.5 sm:p-4 text-left transition-colors cursor-pointer group ${
          isOpen ? 'hover:bg-cyan-950/20' : 'hover:bg-fuchsia-950/20'
        }`}
        aria-expanded={isOpen}
      >
        {/* 上段（1行目）: グラフマーク直結タイトル ＋ 完了バッジ ──── 右端開閉トグル */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`font-black tracking-wide text-xs sm:text-sm flex items-center gap-1.5 truncate ${
                isOpen ? 'text-slate-100' : 'text-fuchsia-200'
              }`}
            >
              <BarChart3
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isOpen ? 'text-cyan-400' : 'text-fuchsia-400'
                }`}
              />
              <span>【各教科演習履歴】</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                isOpen
                  ? 'bg-cyan-950 border border-cyan-500/30 text-cyan-300'
                  : 'bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300'
              }`}
            >
              {practicedSubjectCount} / 7教科完了
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-[11px] font-bold hidden sm:inline ${
                isOpen
                  ? 'text-cyan-400 group-hover:text-cyan-300'
                  : 'text-fuchsia-400 group-hover:text-fuchsia-300'
              }`}
            >
              {isOpen ? 'カルテを閉じる' : '教科別カルテを展開'}
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isOpen
                  ? 'bg-slate-800/80 border border-slate-700/60 text-cyan-400 group-hover:border-cyan-500/50'
                  : 'bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300 group-hover:border-fuchsia-400'
              }`}
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* 下段（2行目）: 演習回数・総解答数・全体正解率 */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span>
              演習回数:{' '}
              <strong className={isOpen ? 'text-cyan-300' : 'text-fuchsia-300'}>
                {totalDrillsAll}回
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              総解答数: <strong className="text-slate-100">{totalQuestionsAll}問</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              全体正解率:{' '}
              <strong
                className={`font-black ${
                  overallAccuracy !== null
                    ? overallAccuracy >= 80
                      ? 'text-emerald-400'
                      : overallAccuracy >= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {overallAccuracy !== null ? `${overallAccuracy}%` : '--'}
              </strong>
            </span>
          </div>
        </div>
      </button>

      {/* Accordion Content Body: 案B「ライトサイバー／プラチナシルバー成績表シート」 */}
      {isOpen && (
        <div className="p-3.5 sm:p-5 border-t-2 border-cyan-500/30 bg-slate-100/95 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200 text-slate-900">
          {/* Tess Educational Advice Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs text-slate-200 flex items-start gap-2.5 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300">テスの学習バランス診断：</span>
              <p className="text-slate-300 leading-relaxed font-medium">
                文部科学省指導要領では全教科の基礎定着が重視されます。正解率80%未満の教科・単元を優先的に再演習し、バランス良く得点力を底上げしましょう。
              </p>
            </div>
          </div>

          {/* 7 Subjects Grid: オフホワイトカード ＋ 7教科固有カラー枠線 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {subjectStats.map((subj) => {
              const isPracticed = subj.drillsCount > 0;
              const isSubExpanded = expandedSubject === subj.id;
              const themeStyle = SUBJECT_THEME_BORDER_MAP[subj.id];

              return (
                <div
                  key={subj.id}
                  className={`rounded-xl border-2 transition-all bg-white ${themeStyle.border} ${
                    themeStyle.shadow
                  } ${isPracticed ? 'hover:shadow-md' : 'opacity-85'}`}
                >
                  {/* Subject Summary Card Top */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{subj.emoji}</span>
                        <span className="font-black text-sm text-slate-900 tracking-wide">
                          {subj.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300 font-mono font-bold">
                          中{subj.allowedYears.join('・')}
                        </span>
                      </div>

                      {/* Accuracy Pill */}
                      <div>
                        {subj.accuracy !== null ? (
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full border font-mono shadow-2xs ${
                              subj.accuracy >= 80
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : subj.accuracy >= 60
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            正解率 {subj.accuracy}%
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-300">
                            未演習
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numbers: Drills Count & Questions */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center font-mono text-xs shadow-2xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          演習回数
                        </span>
                        <span className="font-black text-slate-900 text-xs sm:text-sm">
                          {subj.drillsCount}回
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          総解答数
                        </span>
                        <span className="font-black text-slate-900 text-xs sm:text-sm">
                          {subj.totalQuestions}問
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">
                          正解数
                        </span>
                        <span className="font-black text-emerald-700 text-xs sm:text-sm">
                          {subj.correctQuestions}問
                        </span>
                      </div>
                    </div>

                    {/* Visual Accuracy Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            subj.accuracy !== null
                              ? subj.accuracy >= 80
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                : subj.accuracy >= 60
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                                : 'bg-gradient-to-r from-rose-500 to-red-500'
                              : 'bg-transparent'
                          }`}
                          style={{ width: `${subj.accuracy || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Unit breakdown toggle & quick select */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      {isPracticed ? (
                        <button
                          type="button"
                          onClick={() => toggleSubjectDetail(subj.id)}
                          className="text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>単元別内訳 ({subj.practicedUnits.length}単元)</span>
                          {isSubExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">演習データなし</span>
                      )}

                      {onSelectSubject && (
                        <button
                          type="button"
                          onClick={() => onSelectSubject(subj.id)}
                          className="text-slate-600 hover:text-slate-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>この教科を選択</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sub-Accordion: Practiced Units List */}
                  {isSubExpanded && subj.practicedUnits.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50/90 p-3 space-y-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">
                        単元ごとの演習成績:
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {subj.practicedUnits.map(({ unit, record }) => {
                          const unitAcc =
                            record.total > 0
                              ? Math.round((record.correct / record.total) * 100)
                              : 0;
                          return (
                            <div
                              key={unit.id}
                              className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate">
                                  <span className="text-cyan-700 font-mono text-[10px] font-bold mr-1">
                                    [中{unit.year}]
                                  </span>
                                  {unit.title}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  演習: {record.drillsCount}回 | 解答: {record.total}問中{' '}
                                  {record.correct}問正解
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span
                                  className={`font-black font-mono text-xs ${
                                    unitAcc >= 80
                                      ? 'text-emerald-700'
                                      : unitAcc >= 60
                                      ? 'text-amber-700'
                                      : 'text-rose-700'
                                  }`}
                                >
                                  {unitAcc}%
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono">
                                  直近 {record.lastAcc}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Controls in Accordion */}
          <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px] text-slate-500">
              ※ 成績データは端末内に自動保存されています
            </span>
            {totalDrillsAll > 0 && (
              <button
                type="button"
                onClick={onResetRequest}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-100/70 border border-transparent hover:border-rose-300 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>学習履歴のリセット</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
