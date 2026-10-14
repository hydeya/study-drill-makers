/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  ChevronDown,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  GraduationCap,
  ShieldCheck,
  Compass,
  ExternalLink,
  FileSpreadsheet,
  X,
  Send,
  Loader2,
  Flame,
  Star,
  Sprout,
  Check,
  BookOpen,
  Cpu,
} from 'lucide-react';
import {
  ALL_UNITS_MASTER,
  SUBJECT_CONFIGS,
  CURATED_QUESTIONS_MAP,
  getUnitItems,
} from './data/units';
import {
  UnitMaster,
  DrillQuestion,
  ScoreStore,
  UserAnswerHistory,
  AnswerJudgement,
  SubjectId,
  DifficultyLevel,
} from './types';
import { DrillHeader } from './components/DrillHeader';
import { Footer } from './components/Footer';
import { SmartKeyboard } from './components/SmartKeyboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SubjectHistoryAccordion } from './components/SubjectHistoryAccordion';
import { BadgeListAccordion } from './components/BadgeListAccordion';
import { BadgeCelebrationToast } from './components/BadgeCelebrationToast';
import { GasSyncSettingsAccordion } from './components/GasSyncSettingsAccordion';
import {
  sendDrillResultToGas,
  getJSTTimestamp,
  getGasConfig,
  getSpreadsheetUrl,
  GasDrillPayload,
} from './services/gasSync';
import {
  BadgeStatsStore,
  BADGE_STORAGE_KEY,
  createInitialBadgeStats,
  evaluateBadges,
  getJSTDateString,
  getDayDifferenceJST,
  BadgeDefinition,
} from './data/badges';

const STORAGE_KEY = 'study_drill_makers_scores';

// 匠プロンプト準拠 7教科メタリックカラー設定
interface SubjectMetallicTheme {
  gradient: string;
  shadow: string;
  border: string;
  activeBorder: string;
  glow: string;
  labelColor: string;
}

const SUBJECT_METALLIC_MAP: Record<SubjectId, SubjectMetallicTheme> = {
  japanese: {
    gradient: 'from-[#b81d43] via-[#800020] to-[#42000e]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(128,0,32,0.45)]',
    border: 'border-[#ff4d79]/40',
    activeBorder: 'border-rose-400 bg-rose-950/80',
    glow: 'shadow-[0_0_18px_rgba(184,29,67,0.45)]',
    labelColor: 'text-rose-200',
  },
  math: {
    gradient: 'from-[#38bdf8] via-[#007BFF] to-[#003d80]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(0,123,255,0.45)]',
    border: 'border-[#7dd3fc]/50',
    activeBorder: 'border-sky-400 bg-blue-950/80',
    glow: 'shadow-[0_0_18px_rgba(0,123,255,0.45)]',
    labelColor: 'text-sky-200',
  },
  english: {
    gradient: 'from-[#fde047] via-[#FF8C00] to-[#8f3200]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(255,140,0,0.45)]',
    border: 'border-[#fef08a]/60',
    activeBorder: 'border-amber-400 bg-amber-950/80',
    glow: 'shadow-[0_0_18px_rgba(255,140,0,0.45)]',
    labelColor: 'text-amber-200',
  },
  science: {
    gradient: 'from-[#86efac] via-[#32CD32] to-[#124d12]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(50,205,50,0.45)]',
    border: 'border-[#bbf7d0]/50',
    activeBorder: 'border-emerald-400 bg-emerald-950/80',
    glow: 'shadow-[0_0_18px_rgba(50,205,50,0.45)]',
    labelColor: 'text-emerald-200',
  },
  geography: {
    gradient: 'from-[#d97706] via-[#8B4513] to-[#361502]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),inset_0_-2px_4px_rgba(0,0,0,0.7),0_2px_10px_rgba(139,69,19,0.45)]',
    border: 'border-[#fcd34d]/40',
    activeBorder: 'border-amber-500 bg-amber-950/90',
    glow: 'shadow-[0_0_18px_rgba(139,69,19,0.45)]',
    labelColor: 'text-amber-200',
  },
  history: {
    gradient: 'from-[#c084fc] via-[#4B0082] to-[#1e0036]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(75,0,130,0.45)]',
    border: 'border-[#e9d5ff]/50',
    activeBorder: 'border-purple-400 bg-purple-950/80',
    glow: 'shadow-[0_0_18px_rgba(147,51,234,0.45)]',
    labelColor: 'text-purple-200',
  },
  civics: {
    gradient: 'from-[#f472b6] via-[#FF69B4] to-[#700b46]',
    shadow:
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.55),0_2px_10px_rgba(255,105,180,0.45)]',
    border: 'border-[#fbcfe8]/60',
    activeBorder: 'border-pink-400 bg-pink-950/80',
    glow: 'shadow-[0_0_18px_rgba(255,105,180,0.45)]',
    labelColor: 'text-pink-200',
  },
};

// 学年選択ボタン 推奨メタリック階層スタイル
const GRADE_METALLIC_CONFIG = {
  1: {
    name: '中1',
    selectedButtonClass:
      'border-white bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400 text-slate-950 shadow-[0_0_18px_rgba(203,213,225,0.7),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(71,85,105,0.5)] scale-[1.02]',
    badgeClass: 'bg-slate-900/90 text-slate-200 border border-slate-600',
    unselectedClass:
      'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900/80',
  },
  2: {
    name: '中2',
    selectedButtonClass:
      'border-slate-300 bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 text-slate-100 shadow-[0_0_18px_rgba(148,163,184,0.6),inset_0_1px_2px_rgba(255,255,255,0.6),inset_0_-2px_3px_rgba(15,23,42,0.95)] scale-[1.02]',
    badgeClass: 'bg-slate-950 text-slate-300 border border-slate-500',
    unselectedClass:
      'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900/80',
  },
  3: {
    name: '中3',
    selectedButtonClass:
      'border-white bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-950 shadow-[0_0_22px_rgba(255,255,255,0.85),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(148,163,184,0.5)] scale-[1.02]',
    badgeClass: 'bg-slate-900 text-amber-300 border border-amber-300/40',
    unselectedClass:
      'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900/80',
  },
} as const;

export default function App() {
  // Navigation & Setup State
  const [currentView, setCurrentView] = useState<'setup' | 'practice' | 'result'>('setup');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('japanese');
  const [selectedGrade, setSelectedGrade] = useState<1 | 2 | 3>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('standard');
  const [selectedCount, setSelectedCount] = useState<number>(5);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('j1-1');
  const [selectedItem, setSelectedItem] = useState<string>(''); // 詳細項目（空文字は全項目総合）
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [openGuideSections, setOpenGuideSections] = useState<{
    usage: boolean;
    policy: boolean;
    audit: boolean;
  }>({
    usage: true,
    policy: false,
    audit: false,
  });

  const toggleGuideSection = (key: 'usage' | 'policy' | 'audit') => {
    setOpenGuideSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Active Drill Questions & Progress
  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [userAnswersHistory, setUserAnswersHistory] = useState<UserAnswerHistory[]>([]);

  // Input & Status in Current Question
  const [userTextInput, setUserTextInput] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState<string>('');
  const [isJudged, setIsJudged] = useState<boolean>(false);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean>(false);
  const [currentJudgeStatus, setCurrentJudgeStatus] = useState<AnswerJudgement | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);
  const [currentMaxPoints, setCurrentMaxPoints] = useState<number>(5);
  const [currentRubricEarned, setCurrentRubricEarned] = useState<string>('');
  const [currentRubricDeducted, setCurrentRubricDeducted] = useState<string>('');

  // Loading & Error States
  const [isLoadingDrill, setIsLoadingDrill] = useState<boolean>(false);
  const [drillError, setDrillError] = useState<string | null>(null);
  const [activeModelName, setActiveModelName] = useState<string>('gemini-3.8-flash');

  // Modals
  const [showInterruptModal, setShowInterruptModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Stored Scores
  const [scores, setScores] = useState<ScoreStore>({});
  const [prevUnitAcc, setPrevUnitAcc] = useState<number | null>(null);

  // Badges & Achievements Store
  const [badgeStats, setBadgeStats] = useState<BadgeStatsStore>(() => createInitialBadgeStats());
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<BadgeDefinition[]>([]);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Speech synthesizer status
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Google Apps Script (GAS) 成績自動連携ステータス
  const [gasSyncStatus, setGasSyncStatus] = useState<
    'idle' | 'sending' | 'success' | 'queued' | 'not_configured'
  >('idle');
  const [gasSyncMessage, setGasSyncMessage] = useState<string>('');
  const lastSyncedDrillSessionIdRef = useRef<string>('');

  // Load scores & badge stats on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let loadedScores: ScoreStore = {};
      if (stored) {
        loadedScores = JSON.parse(stored);
        setScores(loadedScores);
      }

      const storedBadge = localStorage.getItem(BADGE_STORAGE_KEY);
      if (storedBadge) {
        const parsed: BadgeStatsStore = JSON.parse(storedBadge);
        const today = getJSTDateString();
        if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
          const diff = getDayDifferenceJST(parsed.lastActiveDate, today);
          if (diff > 1) {
            parsed.currentStreak = 0; // 1日でも空くと0に戻る
          }
        }
        const { updatedStats } = evaluateBadges(parsed, loadedScores);
        setBadgeStats(updatedStats);
      } else {
        const initial = createInitialBadgeStats(loadedScores);
        const { updatedStats } = evaluateBadges(initial, loadedScores);
        setBadgeStats(updatedStats);
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(updatedStats));
      }
    } catch (e) {
      console.warn('Failed to parse stored scores or badges', e);
    }
  }, []);

  // Current Subject config
  const currentSubject =
    SUBJECT_CONFIGS.find((s) => s.id === selectedSubjectId) || SUBJECT_CONFIGS[0];

  // Update selected grade when subject changes if grade is not allowed
  useEffect(() => {
    if (!currentSubject.allowedYears.includes(selectedGrade)) {
      setSelectedGrade(currentSubject.allowedYears[0]);
    }
  }, [selectedSubjectId]);

  // Update selected unit when subject or grade changes
  useEffect(() => {
    const availableUnits = ALL_UNITS_MASTER.filter(
      (u) => u.subjectId === selectedSubjectId && u.year === selectedGrade
    );
    if (availableUnits.length > 0 && !availableUnits.some((u) => u.id === selectedUnitId)) {
      setSelectedUnitId(availableUnits[0].id);
      setSelectedItem('');
    }
  }, [selectedSubjectId, selectedGrade]);

  const currentUnit =
    ALL_UNITS_MASTER.find((u) => u.id === selectedUnitId) || ALL_UNITS_MASTER[0];
  const unitItems = getUnitItems(currentUnit);

  const saveScoreRecord = (
    unitId: string,
    correctCount: number,
    totalCount: number,
    partialCount: number = 0
  ) => {
    const accPct = Math.round((correctCount / totalCount) * 100);
    const prev = scores[unitId] || { total: 0, correct: 0, partial: 0, drillsCount: 0, lastAcc: 0 };
    setPrevUnitAcc(prev.total > 0 ? Math.round((prev.correct / prev.total) * 100) : null);

    const updated: ScoreStore = {
      ...scores,
      [unitId]: {
        total: prev.total + totalCount,
        correct: prev.correct + correctCount,
        partial: (prev.partial || 0) + partialCount,
        drillsCount: prev.drillsCount + 1,
        lastAcc: accPct,
      },
    };

    setScores(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save scores to localStorage', e);
    }
  };

  const recordDrillCompletionToBadges = (
    totalCount: number,
    correctCount: number,
    isRetrySession: boolean
  ) => {
    const today = getJSTDateString();
    const isAllCorrect = correctCount === totalCount;
    // 5問以上の演習で全問正解した場合のみ数える
    const isPerfect = isAllCorrect && totalCount >= 5;
    // 🔥弱点克服リトライで全問正解した1回とする
    const isRetrySuccess = isRetrySession && isAllCorrect;

    setBadgeStats((prev) => {
      // 連続日数の判定（日本時間の0時で区切り、1日でも空くと0に戻る）
      let newStreak = prev.currentStreak;
      if (!prev.lastActiveDate) {
        newStreak = 1;
      } else if (prev.lastActiveDate === today) {
        newStreak = Math.max(1, prev.currentStreak);
      } else {
        const diff = getDayDifferenceJST(prev.lastActiveDate, today);
        if (diff === 1) {
          newStreak = prev.currentStreak + 1;
        } else {
          newStreak = 1;
        }
      }

      const diffKey: 'basic' | 'standard' | 'advanced' =
        selectedDifficulty === 'basic'
          ? 'basic'
          : selectedDifficulty === 'applied'
          ? 'advanced'
          : 'standard';

      const updatedDiff = {
        ...prev.difficultyCompleted,
        [diffKey]: (prev.difficultyCompleted[diffKey] || 0) + (isRetrySession ? 0 : 1),
      };

      const updatedSubj = {
        ...prev.subjectCompleted,
        [selectedSubjectId]:
          (prev.subjectCompleted[selectedSubjectId] || 0) + (isRetrySession ? 0 : 1),
      };

      const updatedRaw: BadgeStatsStore = {
        ...prev,
        totalDrillsCompleted: prev.totalDrillsCompleted + (isRetrySession ? 0 : 1),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + totalCount,
        perfectScoreCount: prev.perfectScoreCount + (isPerfect ? 1 : 0),
        retrySuccessCount: prev.retrySuccessCount + (isRetrySuccess ? 1 : 0),
        difficultyCompleted: updatedDiff,
        subjectCompleted: updatedSubj,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };

      const { updatedStats, newlyUnlocked } = evaluateBadges(updatedRaw, scores);

      try {
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(updatedStats));
      } catch (e) {
        console.warn('Failed to save badge stats', e);
      }

      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadges((existing) => [...existing, ...newlyUnlocked]);
      }

      return updatedStats;
    });
  };

  // Google Apps Script (GAS) 演習結果の自動連携
  const triggerGasSync = (
    total: number,
    correctCount: number,
    partialCount: number,
    incorrectCount: number,
    earnedPts: number,
    maxPts: number,
    accPct: number
  ) => {
    const config = getGasConfig();
    if (!config.isConfigured) {
      setGasSyncStatus('not_configured');
      setGasSyncMessage('');
      return;
    }

    // 画面再描画や再読込での二重送信防止
    const sessionId = `${currentUnit.id}-${Date.now()}`;
    if (lastSyncedDrillSessionIdRef.current === sessionId) return;
    lastSyncedDrillSessionIdRef.current = sessionId;

    setGasSyncStatus('sending');
    setGasSyncMessage('スプレッドシートへ演習結果を送信中...');

    const payload: GasDrillPayload = {
      timestamp: getJSTTimestamp(),
      subjectName: currentSubject.name,
      grade: selectedGrade,
      difficulty: isRetrying
        ? 'リトライ'
        : selectedDifficulty === 'basic'
        ? '基礎'
        : selectedDifficulty === 'standard'
        ? '標準'
        : '応用',
      unitName: currentUnit.title,
      item: isRetrying
        ? selectedItem
          ? `${selectedItem}【リトライ】`
          : '【リトライ】'
        : selectedItem,
      totalQuestions: total,
      correctCount,
      partialCount,
      incorrectCount,
      earnedPoints: earnedPts,
      maxPoints: maxPts,
      accuracyPct: accPct,
      token: config.token,
    };

    sendDrillResultToGas(payload)
      .then((res) => {
        if (res.success) {
          setGasSyncStatus('success');
          setGasSyncMessage('Googleスプレッドシートへ演習結果を自動連携しました');
        } else if (res.queued) {
          setGasSyncStatus('queued');
          setGasSyncMessage('オフライン一時保存しました（次回オンライン時に自動再送）');
        }
      })
      .catch((err) => {
        console.warn('Silent fallback for GAS sync:', err);
        setGasSyncStatus('queued');
        setGasSyncMessage('一時保存（次回再送）');
      });
  };

  const handleResetData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setScores({});
      // 案A（教育的最適解）: 獲得済みバッジはもちろん、累計問題数・完走回数・連続日数などのバッジ進捗も一切初期化せず完全保持
      setShowResetModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Start Drill Process
  const handleStartDrill = async (unitToStart = currentUnit, itemToStart = selectedItem) => {
    setIsLoadingDrill(true);
    setDrillError(null);

    try {
      const res = await fetch('/api/drill/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: unitToStart.id,
          count: selectedCount,
          level: selectedDifficulty,
          item: itemToStart,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const errText = await res.text().catch(() => '');
        console.warn('Non-JSON response from /api/drill/generate:', res.status, errText.slice(0, 100));
        throw new Error('サーバー通信で問題が発生しました。');
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('取得できた問題がありません。');
      }

      if (data.model) {
        setActiveModelName(data.model);
      }

      setQuestions(data.questions);
      setCurrentQuestionIdx(0);
      setIsRetrying(false);
      setNewlyUnlockedBadges([]);
      setCurrentScore(0);
      setUserAnswersHistory([]);
      setUserTextInput('');
      setSelectedChoice(null);
      setLastSubmittedAnswer('');
      setIsJudged(false);
      setCurrentFeedback('');
      setCurrentJudgeStatus(null);
      setCurrentPoints(null);
      setCurrentMaxPoints(5);
      setCurrentRubricEarned('');
      setCurrentRubricDeducted('');

      const prev = scores[unitToStart.id];
      setPrevUnitAcc(prev && prev.total > 0 ? Math.round((prev.correct / prev.total) * 100) : null);

      setCurrentView('practice');
    } catch (err: any) {
      console.warn('API error, applying instant client question fallback:', err);
      // Graceful client fallback: Check curated questions or generate from unit metadata
      const curated = CURATED_QUESTIONS_MAP[unitToStart.id] || [];
      if (curated.length > 0) {
        const shuffled = [...curated].sort(() => 0.5 - Math.random());
        let finalQuestions = shuffled.slice(0, selectedCount);
        if (finalQuestions.length < selectedCount) {
          const needed = selectedCount - finalQuestions.length;
          const items = unitToStart.desc.split('／').map((s) => s.trim());
          for (let i = 0; i < needed; i++) {
            const sub = items[i % items.length] || itemToStart || unitToStart.title;
            finalQuestions.push({
              question: `【${unitToStart.title}】${sub}に関する重要事項または解法・用語を答えなさい。（問${finalQuestions.length + 1}）`,
              answer: sub,
              explanation: `文部科学省指導要領（${unitToStart.desc}）に基づく基礎確認問題です。`,
            });
          }
        }
        setQuestions(finalQuestions);
        setCurrentQuestionIdx(0);
        setCurrentScore(0);
        setUserAnswersHistory([]);
        setUserTextInput('');
        setSelectedChoice(null);
        setLastSubmittedAnswer('');
        setIsJudged(false);
        setCurrentFeedback('');
        setActiveModelName('文部科学省精選バンク (Client)');
        const prev = scores[unitToStart.id];
        setPrevUnitAcc(prev && prev.total > 0 ? Math.round((prev.correct / prev.total) * 100) : null);
        setCurrentView('practice');
        return;
      }

      // Dynamic fallback based on unit description items
      const items = unitToStart.desc.split('／').map((s) => s.trim());
      const fallbackQuestions: DrillQuestion[] = [];
      for (let i = 0; i < selectedCount; i++) {
        const sub = items[i % items.length] || itemToStart || unitToStart.title;
        fallbackQuestions.push({
          question: `【${unitToStart.title}】${sub}に関する重要事項または解法・用語を答えなさい。（問${i + 1}）`,
          answer: sub,
          explanation: `文部科学省指導要領（${unitToStart.desc}）に基づく基礎確認問題です。`,
        });
      }

      if (fallbackQuestions.length > 0) {
        setQuestions(fallbackQuestions);
        setCurrentQuestionIdx(0);
        setCurrentScore(0);
        setUserAnswersHistory([]);
        setUserTextInput('');
        setSelectedChoice(null);
        setLastSubmittedAnswer('');
        setIsJudged(false);
        setCurrentFeedback('');
        setActiveModelName('指導要領シード (Client)');
        const prev = scores[unitToStart.id];
        setPrevUnitAcc(prev && prev.total > 0 ? Math.round((prev.correct / prev.total) * 100) : null);
        setCurrentView('practice');
        return;
      }

      setDrillError(err.message || '問題の読み込み中にエラーが発生しました。');
    } finally {
      setIsLoadingDrill(false);
    }
  };

  // Retry only questions that were incorrect or partial (🔥弱点克服リトライ🔥)
  const handleRetryWeakPoints = () => {
    const weakQuestionTexts = new Set(
      userAnswersHistory
        .filter((h) => !h.isCorrect || h.status !== 'correct')
        .map((h) => h.question)
    );
    const retryQuestions = questions.filter((q) => weakQuestionTexts.has(q.question));
    if (retryQuestions.length === 0) return;

    setIsRetrying(true);
    setNewlyUnlockedBadges([]);
    setQuestions(retryQuestions);
    setCurrentQuestionIdx(0);
    setCurrentScore(0);
    setUserAnswersHistory([]);
    setUserTextInput('');
    setSelectedChoice(null);
    setLastSubmittedAnswer('');
    setIsJudged(false);
    setCurrentFeedback('');
    setCurrentJudgeStatus(null);
    setCurrentPoints(null);
    setCurrentMaxPoints(5);
    setCurrentRubricEarned('');
    setCurrentRubricDeducted('');
    setCurrentView('practice');
  };

  // Text-to-speech for reading questions
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/【[^】]*】/g, '').replace(/（[^）]*）/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = selectedSubjectId === 'english' ? 'en-US' : 'ja-JP';
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  // Current Question Data
  const currentQ = questions[currentQuestionIdx];

  // Safety Guard: Revert to setup if practice is entered without questions
  useEffect(() => {
    if (currentView === 'practice' && (!questions || questions.length === 0 || !currentQ)) {
      if (!isLoadingDrill) {
        console.warn('Practice view opened without questions. Falling back to setup.');
        setCurrentView('setup');
      }
    }
  }, [currentView, questions, currentQ, isLoadingDrill]);

  // Focus Shield: Keep focus permanently pinned to practiceCardRef so focus NEVER escapes iframe
  const practiceCardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const step1SubjectSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectSubjectFromHistory = (subjId: SubjectId) => {
    setSelectedSubjectId(subjId);
    setSelectedItem('');
    const subjectUnits = ALL_UNITS_MASTER.filter((u) => u.subjectId === subjId);
    const validCurrentGradeUnits = subjectUnits.filter((u) => u.year === selectedGrade);
    if (validCurrentGradeUnits.length > 0) {
      setSelectedUnitId(validCurrentGradeUnits[0].id);
    } else if (subjectUnits.length > 0) {
      setSelectedGrade(subjectUnits[0].year);
      setSelectedUnitId(subjectUnits[0].id);
    }

    if (step1SubjectSectionRef.current) {
      step1SubjectSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (isJudged) {
      // Focus Next Button or Practice Card immediately inside iframe so focus never escapes to parent chat
      if (nextButtonRef.current) {
        nextButtonRef.current.focus({ preventScroll: true });
      } else if (practiceCardRef.current) {
        practiceCardRef.current.focus({ preventScroll: true });
      }
    }
  }, [isJudged]);

  // Execute Judge (Meaning-based flexible judging)
  const handleJudge = async () => {
    if (!currentQ || isJudged || isJudging) return;

    // Pin focus to the permanent practice card container before any DOM transition occurs
    if (practiceCardRef.current) {
      practiceCardRef.current.focus({ preventScroll: true });
    }
    // Safely blur the textarea to close the on-screen keyboard without leaking focus outside iframe
    if (textareaRef.current) {
      textareaRef.current.blur();
    }

    const isChoiceQ = Boolean(currentQ.options && currentQ.options.length >= 2);

    if (isChoiceQ) {
      if (!selectedChoice) return;
      setLastSubmittedAnswer(selectedChoice);
      const isCorrect = selectedChoice.trim() === currentQ.answer.trim();
      const choiceStatus: AnswerJudgement = isCorrect ? 'correct' : 'incorrect';
      setCurrentIsCorrect(isCorrect);
      setCurrentJudgeStatus(choiceStatus);
      setCurrentPoints(isCorrect ? 5 : 0);
      setCurrentMaxPoints(5);
      setCurrentRubricEarned(isCorrect ? '✔ 正しい選択肢を選択できました（+5点）' : '');
      setCurrentRubricDeducted(isCorrect ? '' : '✖ 誤った選択肢を選びました（-5点）');
      if (isCorrect) setCurrentScore((prev) => prev + 1);

      setCurrentFeedback(
        isCorrect
          ? '正解です！しっかりポイントを押さえられています。'
          : '不正解です。解説をよく確認して復習しましょう。'
      );
      setIsJudged(true);

      setUserAnswersHistory((prev) => [
        ...prev,
        {
          question: currentQ.question,
          options: currentQ.options,
          userAnswer: selectedChoice,
          correctAnswer: currentQ.answer,
          status: choiceStatus,
          isCorrect,
          explanation: currentQ.explanation,
          points: isCorrect ? 5 : 0,
          maxPoints: 5,
        },
      ]);
    } else {
      const userVal = userTextInput.trim();
      if (!userVal) return;
      setLastSubmittedAnswer(userVal);

      setIsJudging(true);
      try {
        const res = await fetch('/api/drill/judge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQ.question,
            modelAnswer: currentQ.answer,
            userAnswer: userVal,
            subjectId: selectedSubjectId,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error('Non-JSON response from server');
        }
        const data = await res.json();
        if (data.model) {
          setActiveModelName(data.model);
        }
        const isCorrect = Boolean(data.correct);
        const judgeStatus: AnswerJudgement =
          data.status === 'correct' || data.status === 'partial' || data.status === 'incorrect'
            ? data.status
            : isCorrect
            ? 'correct'
            : 'incorrect';

        const points =
          typeof data.points === 'number'
            ? data.points
            : judgeStatus === 'correct'
            ? 5
            : judgeStatus === 'partial'
            ? 3
            : 0;
        const maxPoints = data.maxPoints || 5;

        setCurrentIsCorrect(isCorrect);
        setCurrentJudgeStatus(judgeStatus);
        setCurrentPoints(points);
        setCurrentMaxPoints(maxPoints);
        setCurrentRubricEarned(data.rubricEarned || '');
        setCurrentRubricDeducted(data.rubricDeducted || '');

        if (isCorrect) setCurrentScore((prev) => prev + 1);
        setCurrentFeedback(
          data.feedback ||
            (judgeStatus === 'correct'
              ? '正解と判定しました！'
              : judgeStatus === 'partial'
              ? '惜しい！部分点獲得です。あと一歩で満点！'
              : '不正解です。模範解答を確認しましょう。')
        );
        setIsJudged(true);

        setUserAnswersHistory((prev) => [
          ...prev,
          {
            question: currentQ.question,
            options: currentQ.options,
            userAnswer: userVal,
            correctAnswer: currentQ.answer,
            status: judgeStatus,
            isCorrect,
            explanation: currentQ.explanation,
            feedback: data.feedback,
            points,
            maxPoints,
            rubricEarned: data.rubricEarned,
            rubricDeducted: data.rubricDeducted,
          },
        ]);
      } catch (e) {
        console.error('Judge error:', e);
        // Fallback local comparison
        const isCorrect = userVal === currentQ.answer || currentQ.answer.includes(userVal);
        const fallbackStatus: AnswerJudgement = isCorrect ? 'correct' : 'incorrect';
        setCurrentIsCorrect(isCorrect);
        setCurrentJudgeStatus(fallbackStatus);
        setCurrentPoints(isCorrect ? 5 : 0);
        setCurrentMaxPoints(5);
        setCurrentRubricEarned(isCorrect ? '✔ 正解要件を満たしています' : '');
        setCurrentRubricDeducted(isCorrect ? '' : '✖ 模範解答と照合して要点を確認しましょう');

        if (isCorrect) setCurrentScore((prev) => prev + 1);
        setCurrentFeedback(isCorrect ? '正解です！' : '不正解です。模範解答を確認しましょう。');
        setIsJudged(true);

        setUserAnswersHistory((prev) => [
          ...prev,
          {
            question: currentQ.question,
            options: currentQ.options,
            userAnswer: userVal,
            correctAnswer: currentQ.answer,
            status: fallbackStatus,
            isCorrect,
            explanation: currentQ.explanation,
            points: isCorrect ? 5 : 0,
            maxPoints: 5,
          },
        ]);
      } finally {
        setIsJudging(false);
      }
    }
  };

  // Next Question or Finish
  const handleNextOrFinish = () => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setUserTextInput('');
      setSelectedChoice(null);
      setLastSubmittedAnswer('');
      setIsJudged(false);
      setCurrentFeedback('');
      setCurrentJudgeStatus(null);
      setCurrentPoints(null);
      setCurrentRubricEarned('');
      setCurrentRubricDeducted('');
    } else {
      const total = questions.length;
      const partialCount = userAnswersHistory.filter((h) => h.status === 'partial').length;
      const incorrectCount = userAnswersHistory.filter((h) => h.status === 'incorrect').length;
      const earnedPts = userAnswersHistory.reduce(
        (sum, h) =>
          sum +
          (typeof h.points === 'number'
            ? h.points
            : h.status === 'correct'
            ? 5
            : h.status === 'partial'
            ? 3
            : 0),
        0
      );
      const maxPts = total * 5;
      const accPct = maxPts > 0 ? Math.round((earnedPts / maxPts) * 100) : 0;

      saveScoreRecord(currentUnit.id, currentScore, total, partialCount);
      recordDrillCompletionToBadges(total, currentScore, isRetrying);
      triggerGasSync(total, currentScore, partialCount, incorrectCount, earnedPts, maxPts, accPct);
      setCurrentView('result');
    }
  };

  const handleInterrupt = () => {
    setShowInterruptModal(false);
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setCurrentView('setup');
  };

  // Filtered units by current subject and grade
  const filteredUnits = ALL_UNITS_MASTER.filter(
    (u) => u.subjectId === selectedSubjectId && u.year === selectedGrade
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-300 font-sans">
      {/* 1. Header Component (Shown only during setup for maximum vertical space in practice & result) */}
      {currentView === 'setup' && <DrillHeader />}

      {/* Main Container */}
      <main className={`flex-1 max-w-4xl w-full mx-auto p-2.5 sm:p-5 flex flex-col ${currentView === 'setup' ? 'justify-center' : 'justify-start'}`}>
        {/* VIEW 1: SETUP SCREEN */}
        {currentView === 'setup' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-5">
            {/* Guide Accordion: 【StudyDRILLMakers】使い方＆方針・仕様ガイド */}
            <div className="border border-cyan-500/30 rounded-xl bg-slate-950/60 overflow-hidden transition-all shadow-md">
              <button
                type="button"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
                className="w-full py-3.5 px-3 sm:py-4 sm:px-5 hover:bg-cyan-950/30 transition cursor-pointer group"
                aria-expanded={isGuideOpen}
              >
                {/* 左右に大型アイコンボックス、中央に太字・中央揃えタイトル */}
                <div className="w-full flex items-center justify-between gap-3 sm:gap-6">
                  {/* 帽子マークボックス（拡大・発光） */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:border-cyan-400 group-hover:bg-cyan-900/70 transition-all shadow-md">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  {/* 中央コンテンツ（太字・中央揃え・充実した存在感） */}
                  <div className="text-center space-y-1 flex-1 min-w-0">
                    <div className="text-sm sm:text-base md:text-lg font-black text-cyan-100 tracking-wider drop-shadow-sm">
                      【StudyDRILLMakers】
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-extrabold text-cyan-300 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 shadow-xs tracking-wide">
                        使い方 ＆ 方針・仕様ガイド
                      </span>
                    </div>
                  </div>
                  {/* 拡大開閉ボタン */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:border-cyan-400 group-hover:bg-cyan-900/70 transition-all shadow-md">
                    <ChevronDown
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-transform duration-200 ${
                        isGuideOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </button>

              {isGuideOpen && (
                <div className="px-3.5 pb-4 sm:px-5 sm:pb-5 space-y-3 border-t border-cyan-500/20 pt-3">
                  <div className="text-[11px] sm:text-xs text-slate-400 flex items-center justify-between">
                    <span>ボタンを押すとそれぞれの説明が表示されます</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGuideSections({ usage: true, policy: true, audit: true })
                        }
                        className="text-[10px] text-cyan-400 hover:text-cyan-200 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 cursor-pointer"
                      >
                        すべて開く
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGuideSections({ usage: false, policy: false, audit: false })
                        }
                        className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-900 border border-slate-700/50 cursor-pointer"
                      >
                        すべて閉じる
                      </button>
                    </div>
                  </div>

                  {/* アコーディオン①：📖 使い方説明 */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-inner">
                    <button
                      type="button"
                      onClick={() => toggleGuideSection('usage')}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/60 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <BookOpen className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-amber-200">
                            📖 使い方説明
                          </span>
                          <span className="ml-2 text-[10px] sm:text-[11px] text-amber-400/80">
                            基本操作・音声読み上げ・PRINT ARCHIVE連携
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-amber-400 transition-transform ${
                          openGuideSections.usage ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openGuideSections.usage && (
                      <div className="p-3.5 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 bg-slate-950/40 leading-relaxed font-sans">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold shrink-0">
                            基本操作
                          </span>
                          <div>
                            教科（全7教科）・学年・詳細項目・問題数（3〜10問）・出題形式を選択し、「特訓開始」ボタンを押すことで即座に演習が始まります。
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                            音声読み上げ
                          </span>
                          <div>
                            問題文カードおよび解答・解説エリア右上の<strong className="text-emerald-300">「🔊 読み上げ」</strong>ボタンを押すと音声合成がスタートします。英語はネイティブ発音、他教科は自然な日本語音声で読み上げられ、耳からの反復学習が可能です（再タップで停止）。
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold shrink-0">
                            保管庫連携
                          </span>
                          <div>
                            タイトル右上の<strong className="text-amber-300">【🗂️ PRINT ARCHIVE】</strong>ボタンをタップすると、プリント保管アプリ（Cloudflare Workers）にジャンプします。教科・学年別に作成・保管したPDFプリントをいつでも一覧・閲覧できます。
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold shrink-0">
                            ホーム画面追加
                          </span>
                          <div>
                            Safari（「共有」→「ホーム画面に追加」）またはChrome（「メニュー」→「アプリをインストール/ホーム画面に追加」）を行うと、全画面ネイティブアプリ感覚で快適に起動できます。
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* アコーディオン②：🎯 学習方針 */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-inner">
                    <button
                      type="button"
                      onClick={() => toggleGuideSection('policy')}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/60 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <Compass className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-cyan-200">
                            🎯 学習方針
                          </span>
                          <span className="ml-2 text-[10px] sm:text-[11px] text-cyan-400/80">
                            文科省指導要領準拠・ピンポイント特訓・AI記述採点
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-cyan-400 transition-transform ${
                          openGuideSections.policy ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openGuideSections.policy && (
                      <div className="p-3.5 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 bg-slate-950/40 leading-relaxed font-sans">
                        <p>
                          ・<strong className="text-cyan-300">文部科学省 中学校学習指導要領100%準拠</strong>：国語・地理・歴史・公民・理科・英語（東京書籍準拠）および数学（啓林館準拠）のカリキュラム体系に基づき、現役中学生の定期テスト・高校入試レベルに適合した出題を行います。
                        </p>
                        <p>
                          ・<strong className="text-amber-300">大単元 ＆ 詳細項目（小単元）の2段階選択</strong>：学年・単元全体だけでなく、苦手なピンポイントの項目（例：一次関数の変化の割合、be動詞と一般動詞など）に絞った集中的な反復特訓が可能です。
                        </p>
                        <p>
                          ・<strong className="text-emerald-300">柔軟かつ厳格なAI記述採点</strong>：機械的な完全一致判定ではなく、漢字・ひらがなの表記ゆれ、送り仮名の違い、数学の同値な式変形や記号（×略記・約分後表現など）、理科・社会の核となる必須語句と意味論的一致をAIが精査し、的確に合否を判定します。
                        </p>
                      </div>
                    )}
                  </div>

                  {/* アコーディオン③：🛡️ AI自己監査仕様 */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-inner">
                    <button
                      type="button"
                      onClick={() => toggleGuideSection('audit')}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-800/60 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-emerald-200">
                            🛡️ AI自己監査仕様
                          </span>
                          <span className="ml-2 text-[10px] sm:text-[11px] text-emerald-400/80">
                            AUDIT事前自己監査・教科純度・エンジン冗長化
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-400 transition-transform ${
                          openGuideSections.audit ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openGuideSections.audit && (
                      <div className="p-3.5 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 bg-slate-950/40 leading-relaxed font-sans">
                        <p>
                          ・<strong className="text-emerald-300">出力前事前自己監査（AUDIT）</strong>：AIが作問を生成した直後、ユーザー画面に表示する前に「教科純度」「指定問数」「選択肢の独立性・重複なし」「数式Unicode記号の規格適合」を厳格に自己検査。不適合と判定された場合は自動的に破棄・再生成されます。
                        </p>
                        <p>
                          ・<strong className="text-cyan-300">システムエンジン構成</strong>：最高峰の思考力・記述精度を誇る <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">gemini-3.8-flash</code> を主軸採用。「速度より品質最優先」方針に基づき、Liteモデルを完全排除した多重フルスペックFlashプール（3.7-flash ➔ 3.6-flash ➔ 3.5-flash）への自動フェイルオーバーおよび指導要領シード救済を備えています。
                        </p>
                        <p>
                          ・<strong className="text-amber-300">ハルシネーション抑止</strong>：各単元の解説には教科書範囲外の混入を防止するプロンプト制約を課し、中学生にとって信頼性の高い学習教材品質を維持します。
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 1: 教科選択 (7教科 - メタリックテーマ) */}
            <div ref={step1SubjectSectionRef} className="scroll-mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono">
                    Step 1
                  </span>
                  <span>教科を選択</span>
                </label>
                <span className="text-[11px] text-slate-400">全7教科対応</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {SUBJECT_CONFIGS.map((sub) => {
                  const isSelected = selectedSubjectId === sub.id;
                  const metal = SUBJECT_METALLIC_MAP[sub.id];
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(sub.id);
                        setSelectedItem('');
                      }}
                      className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden select-none ${
                        isSelected
                          ? `${metal.activeBorder} ${metal.glow} scale-[1.04] ring-1 ring-white/20`
                          : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900/80 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {/* メタリック光沢アイコンバッジ */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border text-2xl transition-transform ${
                          isSelected ? 'scale-105' : 'group-hover:scale-102'
                        } bg-gradient-to-br ${metal.gradient} ${metal.border} ${metal.shadow}`}
                      >
                        <span className="drop-shadow-md select-none">{sub.iconEmoji}</span>
                      </div>

                      {/* 教科名 */}
                      <span
                        className={`text-xs font-black block leading-tight text-center ${
                          isSelected ? metal.labelColor : 'text-slate-300'
                        }`}
                      >
                        {sub.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: 学年選択 & 難易度レベル選択 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 学年選択 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono">
                      Step 2
                    </span>
                    <span>学年を選択</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {([1, 2, 3] as const).map((g) => {
                    const isAllowed = currentSubject.allowedYears.includes(g);
                    const isSelected = selectedGrade === g;
                    const gradeConf = GRADE_METALLIC_CONFIG[g];

                    return (
                      <button
                        key={g}
                        type="button"
                        disabled={!isAllowed}
                        onClick={() => {
                          setSelectedGrade(g);
                          setSelectedItem('');
                        }}
                        className={`py-3 px-1.5 text-center rounded-2xl border transition-all cursor-pointer relative ${
                          !isAllowed
                            ? 'opacity-25 border-slate-900 bg-slate-950 text-slate-600 cursor-not-allowed'
                            : isSelected
                            ? `${gradeConf.selectedButtonClass}`
                            : `${gradeConf.unselectedClass}`
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`text-sm font-black tracking-wider ${
                              isSelected
                                ? g === 2
                                  ? 'text-white drop-shadow-sm'
                                  : 'text-slate-950 drop-shadow-xs'
                                : 'text-slate-200'
                            }`}
                          >
                            {gradeConf.name}
                          </span>
                          {!isAllowed && (
                            <span className="text-[9px] font-bold text-slate-600 block mt-0.5">
                              対象外
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 難易度レベル選択 (基礎・標準・応用) */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono mr-1.5">
                    Step 3
                  </span>
                  難易度レベルを選択
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* 基礎 */}
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('basic')}
                    className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                      selectedDifficulty === 'basic'
                        ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs font-bold">
                      <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                      <span>基礎</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 block mt-0.5">4択(確認)+記述</span>
                  </button>

                  {/* 標準 (デフォルト) */}
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('standard')}
                    className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                      selectedDifficulty === 'standard'
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-cyan-400" />
                      <span>標準</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
                      記述メイン
                    </span>
                  </button>

                  {/* 応用 */}
                  <button
                    type="button"
                    onClick={() => setSelectedDifficulty('applied')}
                    className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                      selectedDifficulty === 'applied'
                        ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>応用</span>
                    </div>
                    <span className="text-[10px] text-amber-400/80 block mt-0.5">全問記述(発展)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: 出題数選択 */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono mr-1.5">
                  Step 4
                </span>
                出題数を選択
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSelectedCount(cnt)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedCount === cnt
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    {cnt}問
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: 大単元を選択 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono">
                    Step 5
                  </span>
                  <span>大単元を選択（{currentSubject.name}・中{selectedGrade}）</span>
                </label>
                <span className="text-[11px] text-slate-400">{filteredUnits.length}単元</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto p-1.5 border border-slate-800 rounded-xl bg-slate-950/50">
                {filteredUnits.map((u) => {
                  const isSelected = selectedUnitId === u.id;
                  const record = scores[u.id];
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUnitId(u.id);
                        setSelectedItem('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {u.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            記述中心
                          </span>
                          {record && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                              {record.lastAcc}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-1">
                        {u.title}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{u.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 6: 学習項目（小単元）を選択 */}
            {unitItems.length > 0 && (
              <div className="bg-slate-950/70 border border-cyan-500/20 rounded-xl p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono">
                      Step 6
                    </span>
                    <span>学習項目（小単元）を選択</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {selectedItem ? '項目指定特訓' : '単元総合ランダム'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {/* 全項目（総合出題） */}
                  <button
                    type="button"
                    onClick={() => setSelectedItem('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedItem === ''
                        ? 'border-cyan-400 bg-cyan-950/90 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>全項目（単元総合・ランダム）</span>
                  </button>

                  {/* 各項目 */}
                  {unitItems.map((item, idx) => {
                    const isItemSelected = selectedItem === item;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isItemSelected
                            ? 'border-amber-400 bg-amber-950/80 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)] font-bold'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono text-slate-300">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Message */}
            {drillError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{drillError}</span>
              </div>
            )}

            {/* Start Button */}
            <button
              type="button"
              disabled={isLoadingDrill}
              onClick={() => handleStartDrill()}
              className="w-full py-4 px-4 rounded-xl font-black text-sm sm:text-base tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoadingDrill ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>AI問題生成中（事前自己監査実施中...）</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>
                    【{currentSubject.name}・中{selectedGrade}】
                    {currentUnit.title}
                    {selectedItem ? ` [${selectedItem}]` : ''} 演習開始（{selectedCount}問）
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </>
              )}
            </button>

            {/* 各教科演習履歴 (アコーディオン式) */}
            <SubjectHistoryAccordion
              scores={scores}
              onResetRequest={() => setShowResetModal(true)}
              onSelectSubject={handleSelectSubjectFromHistory}
            />

            {/* 🏆 称号 ＆ 達成バッジ (アコーディオン式) */}
            <BadgeListAccordion stats={badgeStats} />

            {/* 📊 成績自動連携（スプレッドシート・GAS） (アコーディオン式) */}
            <GasSyncSettingsAccordion />
          </div>
        )}

        {/* VIEW 2: PRACTICE SCREEN (フルサイズ・スクロールレス最適化) */}
        {currentView === 'practice' && (
          currentQ ? (
            <div
              ref={practiceCardRef}
              tabIndex={-1}
              className="outline-none focus:outline-none bg-white text-slate-900 border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 animate-in fade-in duration-200"
            >

            {/* Header Strip inside Practice (極小1行ステータスバー) */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 gap-2">
              {/* Question metadata badge */}
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono font-black text-xs tracking-wider">
                  {currentQuestionIdx + 1} / {questions.length} 問
                </span>
                <span
                  style={{ backgroundColor: currentSubject.themeColor }}
                  className="px-2 py-0.5 rounded-full text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>{currentSubject.iconEmoji}</span>
                  <span>{currentSubject.name}</span>
                  <span className="text-[10px] opacity-90">中{selectedGrade}</span>
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                    selectedDifficulty === 'basic'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : selectedDifficulty === 'applied'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                  }`}
                >
                  {selectedDifficulty === 'basic'
                    ? '🌱 基礎'
                    : selectedDifficulty === 'applied'
                    ? '🔥 応用'
                    : '⭐ 標準'}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                    currentQ?.options && currentQ.options.length >= 2
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {currentQ?.options && currentQ.options.length >= 2 ? '4択' : '記述'}
                </span>
                <span className="text-xs font-bold text-slate-600 truncate max-w-[140px] sm:max-w-none">
                  {currentUnit.title}
                  {selectedItem ? ` [${selectedItem}]` : ''}
                </span>

                {/* 稼働中モデルバッジ（息子さんが一目で判別可能） */}
                <span
                  title={`現在稼働中のAIエンジン: ${activeModelName}（画面下の「AUDIT ACTIVE」で詳細確認可能）`}
                  className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border shadow-xs ${
                    activeModelName.includes('3.8-flash')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : activeModelName.includes('flash')
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-cyan-600" />
                  <span>
                    {activeModelName.includes('3.8-flash')
                      ? '3.8-flash'
                      : activeModelName.includes('3.7-flash')
                      ? '3.7-flash'
                      : activeModelName.includes('3.6-flash')
                      ? '3.6-flash'
                      : activeModelName.includes('3.5-flash')
                      ? '3.5-flash'
                      : '指導要領バンク'}
                  </span>
                </span>
              </div>

              {/* Controls (Interrupt) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowInterruptModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="演習の中断"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">中断</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Large, High-Contrast Question Box (コンパクトかつ明瞭 ＆ 音声読み上げボタン付き) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    Q
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug tracking-wide font-sans">
                    {currentQ.question}
                  </h2>
                </div>
                {/* 問題文音声読み上げボタン */}
                <button
                  type="button"
                  onClick={() => speakText(currentQ.question)}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs ${
                    isSpeaking
                      ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300'
                  }`}
                  title={isSpeaking ? '音声読み上げ停止' : '問題文を音声読み上げ'}
                  aria-label={isSpeaking ? '音声停止' : '問題文を読み上げる'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-amber-700" />
                      <span className="hidden sm:inline text-[11px]">停止</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-cyan-700" />
                      <span className="hidden sm:inline text-[11px]">読み上げ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Input Section (Choice or Text dynamically decided per question) */}
            {!isJudged ? (
              <div className="space-y-3 pt-0.5">
                {currentQ.options && currentQ.options.length >= 2 ? (
                  /* 4 Choice buttons: Large, Spacious, Clear */
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = selectedChoice === opt;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedChoice(opt)}
                          className={`min-h-[50px] p-3 sm:p-3.5 rounded-xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-black shadow-md ring-2 ring-cyan-400/40'
                              : 'border-slate-200 bg-slate-50/70 hover:bg-cyan-50/60 hover:border-cyan-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 font-mono ${
                                isSelected
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-cyan-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Text Input: 複数行対応テキストエリア + リアルタイム文字数カウンター + キーボード連動 */
                  <div className="space-y-2">
                    <div className="rounded-xl border-2 border-slate-300 bg-white p-2.5 focus-within:border-cyan-500 focus-within:ring-3 focus-within:ring-cyan-100 transition-all shadow-inner">
                      <textarea
                        ref={textareaRef}
                        rows={2}
                        value={userTextInput}
                        onChange={(e) => setUserTextInput(e.target.value)}
                        onKeyDown={(e) => {
                          // Smartphone / desktop Enter key trap: prevent focus loss and parent tab jump
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isJudging && !isJudged && userTextInput.trim()) {
                              practiceCardRef.current?.focus({ preventScroll: true });
                              handleJudge();
                            }
                          }
                        }}
                        enterKeyHint="done"
                        placeholder="解答を入力してください（記述・語句・数式）"
                        className="w-full bg-transparent text-slate-900 text-base font-semibold focus:outline-hidden font-sans resize-none h-16 sm:h-20 max-h-28 overflow-y-auto leading-relaxed placeholder:text-slate-400 placeholder:font-normal"
                      />
                      {/* インライン情報バー（文字数カウンター ＆ 操作ヒント） */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100 select-none">
                        <span className="flex items-center gap-1 font-bold text-cyan-700">
                          <span>入力文字数:</span>
                          <span className="text-slate-800">{userTextInput.length}</span>
                          <span>字</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          入力完了後、下の「判定する」ボタンを押してください
                        </span>
                      </div>
                    </div>

                    {/* Dedicated Smart Keyboard for Math/Science/English etc */}
                    {currentSubject.hasKeyboard && (
                      <SmartKeyboard
                        subjectId={selectedSubjectId}
                        subjectName={currentSubject.name}
                        themeColor={currentSubject.themeColor}
                        onInsert={(val) => setUserTextInput((prev) => prev + val)}
                        onBackspace={() => setUserTextInput((prev) => prev.slice(0, -1))}
                        onClear={() => setUserTextInput('')}
                      />
                    )}
                  </div>
                )}

                {/* Judge Submit Button (イベント伝播防止・フォーカス跳躍防止・セーフエリア付与) */}
                <div className="pt-2 pb-8 sm:pb-6">
                  <button
                    type="button"
                    disabled={
                      isJudging ||
                      (currentQ.options && currentQ.options.length >= 2 ? !selectedChoice : !userTextInput.trim())
                    }
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      practiceCardRef.current?.focus({ preventScroll: true });
                      handleJudge();
                    }}
                    className="w-full py-4 px-5 rounded-2xl font-black text-sm sm:text-base tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg select-none"
                  >
                    {isJudging ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>AI指導教官テスが柔軟判定中（意味照合）...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>解答を判定する</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Judged Feedback View: Clear, Beautiful, High-Contrast */
              <div
                ref={feedbackRef}
                tabIndex={-1}
                className="space-y-5 animate-in fade-in duration-300 outline-none focus:outline-none"
              >
                {/* Result Banner: 〇 完全正解 / △ 部分点 / ✕ 不正解 */}
                <div
                  className={`p-5 rounded-2xl border-2 flex items-start gap-4 shadow-sm ${
                    currentJudgeStatus === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : currentJudgeStatus === 'partial'
                      ? 'bg-amber-50 border-amber-500 text-amber-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  {currentJudgeStatus === 'correct' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                  ) : currentJudgeStatus === 'partial' ? (
                    <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-black text-lg sm:text-xl">
                      {currentJudgeStatus === 'correct'
                        ? '〇 完全正解！お見事です'
                        : currentJudgeStatus === 'partial'
                        ? `△ 部分点獲得！あと一歩で満点（${currentPoints ?? 3}/${currentMaxPoints}点）`
                        : '✕ 不正解... 模範解答と比較しましょう'}
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed font-semibold">
                      {currentFeedback}
                    </div>
                  </div>
                </div>

                {/* Rubric Breakdown Section (獲得要素・減点NG点) */}
                {(currentRubricEarned || currentRubricDeducted) && (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2 text-xs sm:text-sm shadow-md">
                    <div className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                      <span>【福井県入試特化・要素採点カルテ】</span>
                    </div>
                    {currentRubricEarned && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-bold flex items-start gap-2">
                        <span className="shrink-0 text-emerald-400 font-black">【得点要素】</span>
                        <span className="leading-relaxed">{currentRubricEarned}</span>
                      </div>
                    )}
                    {currentRubricDeducted && (
                      <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 font-bold flex items-start gap-2">
                        <span className="shrink-0 text-rose-400 font-black">【減点・改善点】</span>
                        <span className="leading-relaxed">{currentRubricDeducted}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Comparison Section: あなたの解答 & 模範解答 (併記) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* あなたの解答 */}
                  <div
                    className={`p-4 rounded-2xl border-2 space-y-2 transition-all shadow-xs ${
                      currentJudgeStatus === 'correct'
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : currentJudgeStatus === 'partial'
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : 'bg-rose-50/90 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold tracking-wider flex items-center gap-1.5 ${
                          currentJudgeStatus === 'correct'
                            ? 'text-emerald-800'
                            : currentJudgeStatus === 'partial'
                            ? 'text-amber-800'
                            : 'text-rose-800'
                        }`}
                      >
                        <span>✍️ あなたの解答</span>
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          currentJudgeStatus === 'correct'
                            ? 'bg-emerald-200 text-emerald-900 border border-emerald-400/50'
                            : currentJudgeStatus === 'partial'
                            ? 'bg-amber-200 text-amber-950 border border-amber-400/50'
                            : 'bg-rose-200 text-rose-900 border border-rose-400/50'
                        }`}
                      >
                        {currentJudgeStatus === 'correct'
                          ? '判定：〇 完全正解'
                          : currentJudgeStatus === 'partial'
                          ? `判定：△ 部分点（${currentPoints ?? 3}点）`
                          : '判定：✕ 不正解'}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-xl border text-base sm:text-lg font-black font-sans break-words min-h-[52px] flex items-center ${
                        currentJudgeStatus === 'correct'
                          ? 'bg-white/80 border-emerald-200 text-emerald-950'
                          : currentJudgeStatus === 'partial'
                          ? 'bg-white/80 border-amber-200 text-amber-950'
                          : 'bg-white/80 border-rose-200 text-rose-950'
                      }`}
                    >
                      {lastSubmittedAnswer || '（未入力）'}
                    </div>
                  </div>

                  {/* 模範解答 */}
                  <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 space-y-2 text-amber-950 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 tracking-wider flex items-center gap-1.5">
                        <span>📌 模範解答</span>
                      </span>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400/50">
                        正解基準
                      </span>
                    </div>
                    <div className="bg-white/90 border border-amber-200 p-3 rounded-xl text-base sm:text-lg font-black font-sans break-words min-h-[52px] flex items-center text-amber-950">
                      {currentQ.answer}
                    </div>
                  </div>
                </div>

                {/* Educational Explanation Box (要点解説 ＆ 音声読み上げボタン) */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                      <span>📖 文部科学省指導要領解説</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(`正解は、${currentQ.answer}です。解説。${currentQ.explanation}`)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs ${
                        isSpeaking
                          ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300'
                      }`}
                      title={isSpeaking ? '音声読み上げ停止' : '模範解答と解説を音声で確認'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                          <span className="text-[11px]">停止</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                          <span className="text-[11px]">解説を聞く</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>
                </div>

                {/* Next Question or Finish Button */}
                <button
                  ref={nextButtonRef}
                  type="button"
                  onClick={handleNextOrFinish}
                  className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 hover:brightness-105 active:scale-[0.99] shadow-xl"
                >
                  <span>
                    {currentQuestionIdx + 1 < questions.length ? '次の問題へ進む' : '結果を見る'}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto my-auto shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-sm font-bold text-slate-200">演習問題を読み込み中...</p>
            <button
              type="button"
              onClick={() => setCurrentView('setup')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 transition cursor-pointer"
            >
              単元選択に戻る
            </button>
          </div>
        ))}

        {/* VIEW 3: RESULT SCREEN */}
        {currentView === 'result' && (
          <div className="bg-white text-slate-900 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Newly earned badges celebration toast */}
            {newlyUnlockedBadges.length > 0 && (
              <BadgeCelebrationToast
                newBadges={newlyUnlockedBadges}
                onDismiss={() => setNewlyUnlockedBadges([])}
              />
            )}

            {/* Header Trophy & Score */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-600 border border-amber-300 shadow-md">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">演習完了！お疲れ様でした</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-bold">
                {currentSubject.name}・中{selectedGrade}「{currentUnit.title}」
                {selectedItem ? ` ＞ ${selectedItem}` : ''}
              </p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-500 block mb-1">正解数（〇）</span>
                <span className="text-3xl font-black text-slate-900">
                  {currentScore} / {questions.length}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-500 block mb-1">厳密正解率</span>
                <span className="text-3xl font-black text-amber-600">
                  {Math.round((currentScore / questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* 〇・△・✕ 内訳カード */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 block">〇 完全正解</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {userAnswersHistory.filter((h) => h.status === 'correct').length}
                  <span className="text-xs font-sans ml-0.5 font-bold">問</span>
                </span>
              </div>
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 block">△ 部分点</span>
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {userAnswersHistory.filter((h) => h.status === 'partial').length}
                  <span className="text-xs font-sans ml-0.5 font-bold">問</span>
                </span>
              </div>
              <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-[11px] font-bold text-rose-800 block">✕ 不正解</span>
                <span className="text-2xl font-black text-rose-700 font-mono">
                  {userAnswersHistory.filter((h) => h.status === 'incorrect').length}
                  <span className="text-xs font-sans ml-0.5 font-bold">問</span>
                </span>
              </div>
            </div>

            {/* GAS Sync Status Banner (設定時のみ表示) */}
            {gasSyncStatus !== 'not_configured' && gasSyncStatus !== 'idle' && (
              <div
                className={`max-w-md mx-auto p-3 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-xs ${
                  gasSyncStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : gasSyncStatus === 'sending'
                    ? 'bg-sky-50 text-sky-900 border-sky-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold min-w-0">
                  {gasSyncStatus === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {gasSyncStatus === 'sending' && (
                    <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                  )}
                  {gasSyncStatus === 'queued' && (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="truncate">{gasSyncMessage}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-slate-300 shrink-0 font-bold">
                  GAS連携
                </span>
              </div>
            )}

            {/* Comparison with Previous Record */}
            {prevUnitAcc !== null && (
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-700 flex items-center justify-between font-bold">
                <span>前回のこの単元の正解率: {prevUnitAcc}%</span>
                <span className="text-cyan-700">
                  {Math.round((currentScore / questions.length) * 100) >= prevUnitAcc
                    ? '📈 成績向上！'
                    : '🔁 復習して定着させよう'}
                </span>
              </div>
            )}

            {/* Wrong & Partial Questions Review List */}
            {userAnswersHistory.filter((h) => h.status !== 'correct').length > 0 && (
              <div className="space-y-2.5 max-w-2xl mx-auto pt-2">
                <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>復習ポイント（△ 部分点・✕ 不正解）</span>
                </div>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto p-1">
                  {userAnswersHistory
                    .filter((h) => h.status !== 'correct')
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl p-4 text-xs sm:text-sm space-y-2 border-2 ${
                          item.status === 'partial'
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-rose-50/70 border-rose-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-slate-900 flex-1">{item.question}</div>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 border ${
                              item.status === 'partial'
                                ? 'bg-amber-200 text-amber-950 border-amber-400'
                                : 'bg-rose-200 text-rose-950 border-rose-400'
                            }`}
                          >
                            {item.status === 'partial'
                              ? `△ 部分点 (${item.points ?? 3}/5点)`
                              : '✕ 不正解 (0/5点)'}
                          </span>
                        </div>
                        <div
                          className={`font-semibold ${
                            item.status === 'partial' ? 'text-amber-900' : 'text-rose-700'
                          }`}
                        >
                          あなたの解答: {item.userAnswer}
                        </div>
                        <div className="text-emerald-800 font-bold">
                          模範解答: {item.correctAnswer}
                        </div>
                        {item.rubricEarned && (
                          <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-900 text-[11px] font-bold">
                            {item.rubricEarned}
                          </div>
                        )}
                        {item.rubricDeducted && (
                          <div className="p-2 rounded-lg bg-rose-100/70 text-rose-900 text-[11px] font-bold">
                            {item.rubricDeducted}
                          </div>
                        )}
                        <div className="text-slate-600 text-xs leading-relaxed pt-1 border-t border-slate-200">
                          解説: {item.explanation}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Weak Points Retry Button */}
            {userAnswersHistory.filter((h) => !h.isCorrect || h.status !== 'correct').length > 0 && (
              <div className="pt-2 text-center max-w-md mx-auto space-y-1.5">
                <div className="text-xs font-bold text-rose-600 tracking-wide">
                  〜間違えた問題で満点を目指そう🎯〜
                </div>
                <button
                  type="button"
                  onClick={handleRetryWeakPoints}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-rose-900/40 transition cursor-pointer active:scale-98"
                >
                  <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>
                    🔥弱点克服リトライ🔥（
                    {userAnswersHistory.filter((h) => !h.isCorrect || h.status !== 'correct').length}問）
                  </span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-3">
              <button
                type="button"
                onClick={() => handleStartDrill()}
                className="py-3.5 px-4 rounded-xl border-2 border-cyan-600 bg-cyan-50 text-cyan-800 font-black text-sm flex items-center justify-center gap-2 hover:bg-cyan-100 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>同じ単元をもう一度</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('setup')}
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-105 transition cursor-pointer shadow-md"
              >
                <span>単元選択に戻る</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 📊 成績一覧&グラフ（スプレッドシート）直通リンク */}
            <div className="pt-1 max-w-md mx-auto">
              <a
                href={getSpreadsheetUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition cursor-pointer active:scale-98 border border-emerald-400/40"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>成績一覧&グラフを見る</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* 2. Footer Component */}
      <Footer activeModel={activeModelName} />

      {/* Modal: Interrupt Confirmation */}
      {showInterruptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowInterruptModal(false)}
        >
          <div
            className="bg-[#0b1329] border border-cyan-500/40 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>演習を中断しますか？</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              現在の進捗は保存されません。単元設定画面へ戻りますか？
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInterruptModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition cursor-pointer"
              >
                続ける
              </button>
              <button
                type="button"
                onClick={handleInterrupt}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition cursor-pointer"
              >
                中断して戻る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Scores Confirmation */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-[#0b1329] border border-rose-500/40 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Trash2 className="w-5 h-5" />
              <span>演習履歴・カルテのリセット</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                全教科の単元別演習履歴・正解率・カルテデータを初期化します。
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold leading-normal">
                ✓ 獲得した称号バッジ、累計問題数、連続日数などのバッジ進捗はすべて安全に保持されます。
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition cursor-pointer"
              >
                履歴カルテを初期化
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connectivity status indicator */}
      <OfflineIndicator />
    </div>
  );
}
