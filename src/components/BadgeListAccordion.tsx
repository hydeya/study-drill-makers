import React, { useState } from 'react';
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Lock,
  Flame,
  Sparkles,
  CheckCircle2,
  Crown,
  Medal,
  Award,
} from 'lucide-react';
import {
  BADGE_DEFINITIONS,
  BadgeCategory,
  BadgeDefinition,
  BadgeStatsStore,
  BadgeTier,
} from '../data/badges';

interface BadgeListAccordionProps {
  stats: BadgeStatsStore;
}

const CATEGORY_TABS: { id: BadgeCategory | 'all'; label: string }[] = [
  { id: 'all', label: '全て' },
  { id: 'run', label: '完走系' },
  { id: 'questions', label: '問題数' },
  { id: 'accuracy', label: '正解率' },
  { id: 'retry', label: 'リトライ' },
  { id: 'difficulty', label: '難易度' },
  { id: 'coverage', label: '7教科' },
  { id: 'streak', label: '連続日数' },
  { id: 'complete', label: '神' },
];

function getTierBadgeStyles(tier: BadgeTier, isUnlocked: boolean) {
  if (!isUnlocked) {
    return {
      card: 'bg-slate-950/70 border-slate-800/80 text-slate-500 opacity-70',
      iconBox: 'bg-slate-900 border-slate-800 text-slate-600',
      tag: 'bg-slate-900 text-slate-500 border-slate-800',
    };
  }

  switch (tier) {
    case 'bronze':
      return {
        card: 'bg-gradient-to-br from-amber-950/60 via-amber-900/30 to-slate-900 border-amber-700/60 text-amber-200 shadow-[0_2px_12px_rgba(180,83,9,0.15)]',
        iconBox: 'bg-amber-950 border-amber-600/70 text-amber-400 shadow-xs',
        tag: 'bg-amber-950/80 text-amber-300 border-amber-600/60',
      };
    case 'silver':
      return {
        card: 'bg-gradient-to-br from-slate-800/80 via-slate-850/60 to-slate-900 border-slate-300/60 text-slate-100 shadow-[0_2px_12px_rgba(203,213,225,0.15)]',
        iconBox: 'bg-slate-800 border-slate-300/80 text-slate-200 shadow-xs',
        tag: 'bg-slate-800 text-slate-200 border-slate-400/60',
      };
    case 'gold':
      return {
        card: 'bg-gradient-to-br from-yellow-950/70 via-amber-900/40 to-slate-900 border-yellow-400/80 text-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.25)]',
        iconBox: 'bg-yellow-950 border-yellow-400 text-yellow-300 shadow-md',
        tag: 'bg-yellow-950 text-yellow-300 border-yellow-400/80',
      };
    case 'platinum':
      return {
        card: 'bg-gradient-to-br from-cyan-950/80 via-sky-900/40 to-slate-900 border-cyan-400 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.3)]',
        iconBox: 'bg-cyan-950 border-cyan-300 text-cyan-300 shadow-md',
        tag: 'bg-cyan-950 text-cyan-200 border-cyan-400/80',
      };
    case 'gariben':
      return {
        card: 'bg-gradient-to-br from-purple-950/90 via-fuchsia-950/50 to-slate-900 border-fuchsia-400/90 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.35)]',
        iconBox: 'bg-fuchsia-950 border-fuchsia-300 text-fuchsia-300 shadow-lg',
        tag: 'bg-fuchsia-950 text-fuchsia-200 border-fuchsia-400',
      };
    case 'god':
      return {
        card: 'bg-gradient-to-r from-amber-950/90 via-rose-950/70 to-indigo-950/90 border-2 border-amber-300 text-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.55)]',
        iconBox: 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-white shadow-xl',
        tag: 'bg-amber-900 text-amber-200 border-amber-300 font-black',
      };
  }
}

function renderTierIcon(tier: BadgeTier, isUnlocked: boolean) {
  if (!isUnlocked) {
    return <Lock className="w-4 h-4 text-slate-600" />;
  }
  switch (tier) {
    case 'bronze':
      return <Medal className="w-4 h-4 text-amber-400" />;
    case 'silver':
      return <Award className="w-4 h-4 text-slate-200" />;
    case 'gold':
      return <Crown className="w-4 h-4 text-yellow-300" />;
    case 'platinum':
      return <Sparkles className="w-4 h-4 text-cyan-300" />;
    case 'gariben':
      return <Flame className="w-4 h-4 text-fuchsia-300" />;
    case 'god':
      return <Crown className="w-5 h-5 text-slate-950" />;
  }
}

export const BadgeListAccordion: React.FC<BadgeListAccordionProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');

  const unlockedCount = stats.unlockedBadgeIds.length;
  const totalCount = BADGE_DEFINITIONS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges =
    selectedCategory === 'all'
      ? BADGE_DEFINITIONS
      : BADGE_DEFINITIONS.filter((b) => b.category === selectedCategory);

  return (
    <div
      className={`w-full bg-[#0b1329]/95 rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-2 border-amber-500/60 shadow-2xl'
          : 'border-2 border-amber-500/70 shadow-[0_0_18px_rgba(245,158,11,0.22)] hover:border-amber-400'
      }`}
    >
      {/* Accordion Master Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3.5 sm:p-4 text-left transition-colors cursor-pointer group hover:bg-amber-950/20"
        aria-expanded={isOpen}
      >
        {/* 上段: トロフィータイトル ＋ 連続日数 ＋ 開閉トグル */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-black tracking-wide text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 text-amber-200 shrink-0">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span>【称号閲覧】</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 shrink-0">
              {unlockedCount}/{totalCount} [{progressPct}%]
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 連続日数バッジ（常時表示） */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-600/30 to-red-600/30 border border-orange-500/50 text-orange-300 text-[11px] sm:text-xs font-black shadow-2xs font-mono shrink-0">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>連続{stats.currentStreak}日</span>
            </div>

            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/80 border border-slate-700/60 text-amber-400 group-hover:border-amber-400 transition-colors shrink-0">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* 下段: プログレスバー */}
        <div className="mt-2.5 space-y-1">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </button>

      {/* Accordion Content Body */}
      {isOpen && (
        <div className="p-3 sm:p-5 border-t border-amber-500/30 bg-slate-900/90 space-y-4 animate-in fade-in duration-200">
          {/* Header Message */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-slate-300 flex items-start gap-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300">ガリ勉くんの称号指南：</span>
              <p className="text-slate-300 leading-relaxed font-medium">
                日々のドリル完走、100%満点、弱点克服リトライで称号を解放！全30種をコンプリートして『神になったガリ勉くん』を目指そう！
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Badge Grid (Pixel 9a 最適化 2〜3列) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredBadges.map((badge) => {
              const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
              const styles = getTierBadgeStyles(badge.tier, isUnlocked);

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border transition-all relative overflow-hidden flex items-start gap-3 ${styles.card}`}
                >
                  {/* Emblem Icon Box */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${styles.iconBox}`}
                  >
                    {renderTierIcon(badge.tier, isUnlocked)}
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-black text-xs sm:text-sm tracking-wide truncate">
                        {badge.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 font-mono ${styles.tag}`}
                      >
                        {badge.tier === 'god'
                          ? 'GOD'
                          : badge.tier === 'gariben'
                          ? '最上位'
                          : badge.tier.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] leading-tight text-slate-300 font-medium line-clamp-2">
                      {badge.conditionText}
                    </div>

                    <div className="pt-0.5 flex items-center gap-1 text-[10px]">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>獲得済み</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold flex items-center gap-0.5">
                          <Lock className="w-3 h-3" />
                          <span>未獲得</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
