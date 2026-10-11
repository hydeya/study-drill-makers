export type SubjectId =
  | 'japanese'
  | 'math'
  | 'english'
  | 'science'
  | 'geography'
  | 'history'
  | 'civics';

export type DifficultyLevel = 'basic' | 'standard' | 'applied';

export type UnitFormat = 'choice' | 'text';

export type AnswerJudgement = 'correct' | 'partial' | 'incorrect';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  shortName: string;
  themeColor: string;
  lightColor: string;
  darkColor: string;
  badgeColor: string;
  iconEmoji: string;
  allowedYears: (1 | 2 | 3)[];
  hasKeyboard: boolean;
}

export interface UnitMaster {
  id: string;
  subjectId: SubjectId;
  year: 1 | 2 | 3;
  title: string;
  desc: string;
  format: UnitFormat;
  category: string;
  items?: string[]; // 詳細項目・小単元リスト (1, 2, 3...)
}

export interface DrillQuestion {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  rubric?: string; // 採点基準（満点・部分点・0点）
  level?: DifficultyLevel;
}

export interface UnitScoreRecord {
  total: number;
  correct: number;
  partial?: number;
  drillsCount: number;
  lastAcc: number; // 厳密な〇正解率（%）
}

export interface SubjectScoreStore {
  [unitId: string]: UnitScoreRecord;
}

export type AllScoresStore = Record<string, UnitScoreRecord>;
export type ScoreStore = Record<string, UnitScoreRecord>;

export interface UserAnswerHistory {
  question: string;
  options?: string[];
  userAnswer: string;
  correctAnswer: string;
  status: AnswerJudgement; // 'correct' | 'partial' | 'incorrect'
  isCorrect: boolean;
  explanation: string;
  feedback?: string;
  points?: number;
  maxPoints?: number;
  rubricEarned?: string;
  rubricDeducted?: string;
}

export interface JudgeResponse {
  status: AnswerJudgement;
  correct: boolean;
  points: number;
  maxPoints: number;
  feedback: string;
  rubricEarned?: string;
  rubricDeducted?: string;
  model?: string;
}
