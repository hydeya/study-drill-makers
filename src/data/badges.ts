import { DifficultyLevel, ScoreStore, SubjectId } from '../types';

export type BadgeCategory =
  | 'run'
  | 'questions'
  | 'accuracy'
  | 'retry'
  | 'difficulty'
  | 'coverage'
  | 'streak'
  | 'complete';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'gariben' | 'god';

export interface BadgeDefinition {
  id: string;
  name: string; // 称号名
  category: BadgeCategory;
  categoryLabel: string;
  tier: BadgeTier;
  conditionText: string;
  check: (stats: BadgeStatsStore, scores?: ScoreStore) => boolean;
}

export interface BadgeStatsStore {
  totalDrillsCompleted: number; // 完走回数
  totalQuestionsAnswered: number; // 解答数
  perfectScoreCount: number; // 5問以上で100%だった回数
  retrySuccessCount: number; // 🔥リトライ全問正解回数
  difficultyCompleted: {
    basic: number;
    standard: number;
    advanced: number;
  };
  subjectCompleted: Record<SubjectId, number>; // 7教科それぞれの完走回数
  currentStreak: number; // 連続日数
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD (JST)
  unlockedBadgeIds: string[]; // 獲得済みバッジID（一度獲得したら取り消さない）
}

export const BADGE_STORAGE_KEY = 'study_drill_badge_stats_v1';

export const ALL_SUBJECT_IDS: SubjectId[] = [
  'japanese',
  'math',
  'english',
  'science',
  'geography',
  'history',
  'civics',
];

// 日本時間 (JST) の YYYY-MM-DD を取得
export function getJSTDateString(date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const y = parts.find((p) => p.type === 'year')?.value || '';
    const m = parts.find((p) => p.type === 'month')?.value || '';
    const d = parts.find((p) => p.type === 'day')?.value || '';
    return `${y}-${m}-${d}`;
  } catch {
    const d = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }
}

// 2つのJST日付の日数差を計算
export function getDayDifferenceJST(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 999;
  const d1 = new Date(dateStr1 + 'T00:00:00+09:00').getTime();
  const d2 = new Date(dateStr2 + 'T00:00:00+09:00').getTime();
  return Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

// 既存の scores (ScoreStore) から矛盾しない初期統計を構築
export function createInitialBadgeStats(scores: ScoreStore = {}): BadgeStatsStore {
  let totalDrills = 0;
  let totalQuestions = 0;
  const subjectCompleted: Record<SubjectId, number> = {
    japanese: 0,
    math: 0,
    english: 0,
    science: 0,
    geography: 0,
    history: 0,
    civics: 0,
  };

  Object.entries(scores).forEach(([unitId, record]) => {
    if (record && record.drillsCount > 0) {
      totalDrills += record.drillsCount;
      totalQuestions += record.total;
      const subjPrefix = unitId[0];
      if (subjPrefix === 'j') subjectCompleted.japanese += record.drillsCount;
      else if (subjPrefix === 'm') subjectCompleted.math += record.drillsCount;
      else if (subjPrefix === 'e') subjectCompleted.english += record.drillsCount;
      else if (subjPrefix === 's') subjectCompleted.science += record.drillsCount;
      else if (subjPrefix === 'g') subjectCompleted.geography += record.drillsCount;
      else if (subjPrefix === 'h') subjectCompleted.history += record.drillsCount;
      else if (subjPrefix === 'c') subjectCompleted.civics += record.drillsCount;
    }
  });

  return {
    totalDrillsCompleted: totalDrills,
    totalQuestionsAnswered: totalQuestions,
    perfectScoreCount: 0,
    retrySuccessCount: 0,
    difficultyCompleted: {
      basic: 0,
      standard: 0,
      advanced: 0,
    },
    subjectCompleted,
    currentStreak: totalDrills > 0 ? 1 : 0,
    longestStreak: totalDrills > 0 ? 1 : 0,
    lastActiveDate: totalDrills > 0 ? getJSTDateString() : '',
    unlockedBadgeIds: [],
  };
}

// 全30種のバッジ定義（ヒデ仕様に100%完全準拠）
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ■ 完走系 (4種)
  {
    id: 'run-1',
    name: '初陣の証',
    category: 'run',
    categoryLabel: '完走系',
    tier: 'bronze',
    conditionText: '初めてドリルを1回完走',
    check: (s) => s.totalDrillsCompleted >= 1,
  },
  {
    id: 'run-50',
    name: '努力の証',
    category: 'run',
    categoryLabel: '完走系',
    tier: 'silver',
    conditionText: '50回ドリルを完走',
    check: (s) => s.totalDrillsCompleted >= 50,
  },
  {
    id: 'run-100',
    name: '修練の証',
    category: 'run',
    categoryLabel: '完走系',
    tier: 'gold',
    conditionText: '100回ドリルを完走',
    check: (s) => s.totalDrillsCompleted >= 100,
  },
  {
    id: 'run-300',
    name: '完走ガリ勉くん',
    category: 'run',
    categoryLabel: '完走系',
    tier: 'gariben',
    conditionText: '300回ドリルを完走',
    check: (s) => s.totalDrillsCompleted >= 300,
  },

  // ■ 問題数系 (5種)
  {
    id: 'q-10',
    name: '十問斬り',
    category: 'questions',
    categoryLabel: '問題数系',
    tier: 'bronze',
    conditionText: '全教科累計 10問解答',
    check: (s) => s.totalQuestionsAnswered >= 10,
  },
  {
    id: 'q-50',
    name: '五十問ノ太刀',
    category: 'questions',
    categoryLabel: '問題数系',
    tier: 'silver',
    conditionText: '全教科累計 50問解答',
    check: (s) => s.totalQuestionsAnswered >= 50,
  },
  {
    id: 'q-100',
    name: '百問ノススメ',
    category: 'questions',
    categoryLabel: '問題数系',
    tier: 'gold',
    conditionText: '全教科累計 100問解答',
    check: (s) => s.totalQuestionsAnswered >= 100,
  },
  {
    id: 'q-1000',
    name: '千問ノ神',
    category: 'questions',
    categoryLabel: '問題数系',
    tier: 'platinum',
    conditionText: '全教科累計 1000問解答',
    check: (s) => s.totalQuestionsAnswered >= 1000,
  },
  {
    id: 'q-2000',
    name: 'ガリ勉くん2000',
    category: 'questions',
    categoryLabel: '問題数系',
    tier: 'gariben',
    conditionText: '全教科累計 2000問解答',
    check: (s) => s.totalQuestionsAnswered >= 2000,
  },

  // ■ 正解率系 (6種: 5問以上の演習で全問正解)
  {
    id: 'acc-1',
    name: '百発百中',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'bronze',
    conditionText: '初めて正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 1,
  },
  {
    id: 'acc-20',
    name: '才能開花',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'silver',
    conditionText: '20回 正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 20,
  },
  {
    id: 'acc-50',
    name: '百花繚乱',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'gold',
    conditionText: '50回 正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 50,
  },
  {
    id: 'acc-100',
    name: '秀才ノ域',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'platinum',
    conditionText: '100回 正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 100,
  },
  {
    id: 'acc-200',
    name: '学問ノ神',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'platinum',
    conditionText: '200回 正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 200,
  },
  {
    id: 'acc-300',
    name: '100%ガリ勉くん',
    category: 'accuracy',
    categoryLabel: '正解率系',
    tier: 'gariben',
    conditionText: '300回 正解率100%（5問以上）',
    check: (s) => s.perfectScoreCount >= 300,
  },

  // ■ リトライ系 (4種: 🔥弱点克服リトライで全問正解)
  {
    id: 'retry-50',
    name: '努力の人',
    category: 'retry',
    categoryLabel: 'リトライ系',
    tier: 'bronze',
    conditionText: '50回 リトライ全問正解に成功',
    check: (s) => s.retrySuccessCount >= 50,
  },
  {
    id: 'retry-100',
    name: '根気の人',
    category: 'retry',
    categoryLabel: 'リトライ系',
    tier: 'silver',
    conditionText: '100回 リトライ全問正解に成功',
    check: (s) => s.retrySuccessCount >= 100,
  },
  {
    id: 'retry-150',
    name: '復習王',
    category: 'retry',
    categoryLabel: 'リトライ系',
    tier: 'gold',
    conditionText: '150回 リトライ全問正解に成功',
    check: (s) => s.retrySuccessCount >= 150,
  },
  {
    id: 'retry-300',
    name: '根性ガリ勉くん',
    category: 'retry',
    categoryLabel: 'リトライ系',
    tier: 'gariben',
    conditionText: '300回 リトライ全問正解に成功',
    check: (s) => s.retrySuccessCount >= 300,
  },

  // ■ 難易度系 (4種)
  {
    id: 'diff-basic-30',
    name: '全ての始まり',
    category: 'difficulty',
    categoryLabel: '難易度系',
    tier: 'bronze',
    conditionText: '基礎モード 30回完走',
    check: (s) => s.difficultyCompleted.basic >= 30,
  },
  {
    id: 'diff-std-30',
    name: '挑戦者',
    category: 'difficulty',
    categoryLabel: '難易度系',
    tier: 'silver',
    conditionText: '標準モード 30回完走',
    check: (s) => s.difficultyCompleted.standard >= 30,
  },
  {
    id: 'diff-adv-30',
    name: '極メシ者',
    category: 'difficulty',
    categoryLabel: '難易度系',
    tier: 'gold',
    conditionText: '応用モード 30回完走',
    check: (s) => s.difficultyCompleted.advanced >= 30,
  },
  {
    id: 'diff-all-50',
    name: 'モード制覇ガリ勉くん',
    category: 'difficulty',
    categoryLabel: '難易度系',
    tier: 'gariben',
    conditionText: '全モード（基礎・標準・応用）それぞれ50回完走',
    check: (s) =>
      s.difficultyCompleted.basic >= 50 &&
      s.difficultyCompleted.standard >= 50 &&
      s.difficultyCompleted.advanced >= 50,
  },

  // ■ 網羅系 (4種: 7教科それぞれを学習)
  {
    id: 'cov-1',
    name: '探求者',
    category: 'coverage',
    categoryLabel: '網羅系',
    tier: 'bronze',
    conditionText: '7教科それぞれを1回以上学習',
    check: (s) => ALL_SUBJECT_IDS.every((id) => (s.subjectCompleted[id] || 0) >= 1),
  },
  {
    id: 'cov-10',
    name: '全テヲ知ル者',
    category: 'coverage',
    categoryLabel: '網羅系',
    tier: 'silver',
    conditionText: '7教科それぞれを10回以上学習',
    check: (s) => ALL_SUBJECT_IDS.every((id) => (s.subjectCompleted[id] || 0) >= 10),
  },
  {
    id: 'cov-30',
    name: '全テヲ修メシ者',
    category: 'coverage',
    categoryLabel: '網羅系',
    tier: 'gold',
    conditionText: '7教科それぞれを30回以上学習',
    check: (s) => ALL_SUBJECT_IDS.every((id) => (s.subjectCompleted[id] || 0) >= 30),
  },
  {
    id: 'cov-50',
    name: '全知全能ガリ勉くん',
    category: 'coverage',
    categoryLabel: '網羅系',
    tier: 'gariben',
    conditionText: '7教科それぞれを50回以上学習',
    check: (s) => ALL_SUBJECT_IDS.every((id) => (s.subjectCompleted[id] || 0) >= 50),
  },

  // ■ 連続日数系 (2種)
  {
    id: 'streak-30',
    name: '継続王',
    category: 'streak',
    categoryLabel: '連続日数系',
    tier: 'gold',
    conditionText: '連続30日演習を達成',
    check: (s) => s.currentStreak >= 30 || s.longestStreak >= 30,
  },
  {
    id: 'streak-100',
    name: '継続王ガリ勉くん',
    category: 'streak',
    categoryLabel: '連続日数系',
    tier: 'gariben',
    conditionText: '連続100日演習を達成',
    check: (s) => s.currentStreak >= 100 || s.longestStreak >= 100,
  },

  // ■ コンプリート系 (1種: 他の全29称号を獲得)
  {
    id: 'complete-god',
    name: '神になったガリ勉くん',
    category: 'complete',
    categoryLabel: 'コンプリート系',
    tier: 'god',
    conditionText: '他の全29個の称号・バッジをすべて獲得',
    check: (s) => {
      const otherIds = BADGE_DEFINITIONS.filter((b) => b.id !== 'complete-god').map((b) => b.id);
      return otherIds.every((id) => s.unlockedBadgeIds.includes(id));
    },
  },
];

// バッジ状態を検証し、新たに獲得されたバッジを返す
export function evaluateBadges(
  prevStats: BadgeStatsStore,
  scores?: ScoreStore
): { updatedStats: BadgeStatsStore; newlyUnlocked: BadgeDefinition[] } {
  const unlockedSet = new Set(prevStats.unlockedBadgeIds);
  const newlyUnlocked: BadgeDefinition[] = [];

  // Pass 1: 通常29バッジの判定
  for (const badge of BADGE_DEFINITIONS) {
    if (badge.id === 'complete-god') continue;
    if (!unlockedSet.has(badge.id) && badge.check(prevStats, scores)) {
      unlockedSet.add(badge.id);
      newlyUnlocked.push(badge);
    }
  }

  // Pass 2: コンプリートバッジの判定
  const godBadge = BADGE_DEFINITIONS.find((b) => b.id === 'complete-god');
  if (godBadge && !unlockedSet.has('complete-god')) {
    const tempStats: BadgeStatsStore = {
      ...prevStats,
      unlockedBadgeIds: Array.from(unlockedSet),
    };
    if (godBadge.check(tempStats, scores)) {
      unlockedSet.add('complete-god');
      newlyUnlocked.push(godBadge);
    }
  }

  const updatedStats: BadgeStatsStore = {
    ...prevStats,
    unlockedBadgeIds: Array.from(unlockedSet),
  };

  return { updatedStats, newlyUnlocked };
}
