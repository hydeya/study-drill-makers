import { SubjectId } from '../types';

export interface KeyItem {
  label: string;
  val: string;
  cat?: string;
  cats?: string[];
  isWide?: boolean;
  isAction?: boolean;
}

export interface KeyboardLayout {
  hasCategories: boolean;
  categories?: { id: string; label: string }[];
  keys: KeyItem[];
  isQwerty?: boolean;
}

export const COMMON_CONTROL_KEYS: KeyItem[] = [
  { label: '⌫', val: '__BACKSPACE__', isAction: true },
  { label: 'AC', val: '__CLEAR__', isAction: true },
];

export const KEYBOARD_CONFIGS: Record<SubjectId, KeyboardLayout | null> = {
  japanese: null, // 国語は標準キーボード入力

  math: {
    hasCategories: true,
    categories: [
      { id: 'all', label: '全て' },
      { id: 'num', label: '数字' },
      { id: 'var', label: '変数' },
      { id: 'unit', label: '単位' },
      { id: 'pow', label: '累乗' },
      { id: 'sym', label: '記号' },
    ],
    keys: [
      // 数字
      { label: '0', val: '0', cat: 'num' },
      { label: '1', val: '1', cat: 'num' },
      { label: '2', val: '2', cat: 'num' },
      { label: '3', val: '3', cat: 'num' },
      { label: '4', val: '4', cat: 'num' },
      { label: '5', val: '5', cat: 'num' },
      { label: '6', val: '6', cat: 'num' },
      { label: '7', val: '7', cat: 'num' },
      { label: '8', val: '8', cat: 'num' },
      { label: '9', val: '9', cat: 'num' },
      { label: '.', val: '.', cat: 'num' },

      // 変数
      { label: 'x', val: 'x', cat: 'var' },
      { label: 'y', val: 'y', cat: 'var' },
      { label: 'a', val: 'a', cat: 'var' },
      { label: 'b', val: 'b', cat: 'var' },
      { label: 'n', val: 'n', cat: 'var' },
      { label: 'm', val: 'm', cat: 'var' },

      // 単位
      { label: 'cm', val: 'cm', cat: 'unit' },
      { label: 'm', val: 'm', cat: 'unit' },
      { label: 'g', val: 'g', cat: 'unit' },
      { label: 'kg', val: 'kg', cat: 'unit' },

      // 累乗
      { label: '²', val: '²', cat: 'pow' },
      { label: '³', val: '³', cat: 'pow' },

      // 計算・記号
      { label: '+', val: '+', cat: 'sym' },
      { label: '-', val: '-', cat: 'sym' },
      { label: '=', val: '=', cat: 'sym' },
      { label: '±', val: '±', cat: 'sym' },
      { label: '(', val: '(', cat: 'sym' },
      { label: ')', val: ')', cat: 'sym' },
      { label: ',', val: ',', cat: 'sym' },
      { label: ':', val: ':', cat: 'sym' },
      { label: '/', val: '/', cat: 'sym' },
      { label: '°', val: '°', cat: 'sym' },
      { label: 'π', val: 'π', cat: 'sym' },
      { label: '√', val: '√', cat: 'sym' },
      { label: '≦', val: '≦', cat: 'sym' },
      { label: '≧', val: '≧', cat: 'sym' },
    ],
  },

  science: {
    hasCategories: true,
    categories: [
      { id: 'all', label: '全て' },
      { id: 'chem', label: '化学・イオン' },
      { id: 'phys', label: '物理・単位' },
      { id: 'geo', label: '生物・地学' },
    ],
    keys: [
      // 共通数字
      { label: '0', val: '0', cat: 'phys' },
      { label: '1', val: '1', cat: 'phys' },
      { label: '2', val: '2', cat: 'phys' },
      { label: '3', val: '3', cat: 'phys' },
      { label: '4', val: '4', cat: 'phys' },
      { label: '5', val: '5', cat: 'phys' },
      { label: '6', val: '6', cat: 'phys' },
      { label: '7', val: '7', cat: 'phys' },
      { label: '8', val: '8', cat: 'phys' },
      { label: '9', val: '9', cat: 'phys' },
      { label: '.', val: '.', cat: 'phys' },
      { label: '+', val: '+', cat: 'chem', cats: ['chem', 'phys'] },
      { label: '-', val: '-', cat: 'phys', cats: ['chem', 'phys'] },
      { label: '=', val: '=', cat: 'chem', cats: ['chem', 'phys'] },

      // 化学・イオン・累乗
      { label: '²', val: '²', cat: 'chem', cats: ['chem', 'phys'] },
      { label: '³', val: '³', cat: 'chem', cats: ['chem', 'phys'] },
      { label: '⁺', val: '⁺', cat: 'chem' },
      { label: '⁻', val: '⁻', cat: 'chem' },
      { label: '₂', val: '₂', cat: 'chem' },
      { label: '₃', val: '₃', cat: 'chem' },
      { label: '₄', val: '₄', cat: 'chem' },
      { label: '→', val: '→', cat: 'chem' },
      { label: '(', val: '(', cat: 'chem' },
      { label: ')', val: ')', cat: 'chem' },
      { label: ':', val: ':', cat: 'chem' },

      // 物理・化学単位
      { label: 'g', val: 'g', cat: 'phys' },
      { label: 'kg', val: 'kg', cat: 'phys' },
      { label: 'cm³', val: 'cm³', cat: 'phys' },
      { label: 'g/cm³', val: 'g/cm³', cat: 'phys' },
      { label: '℃', val: '℃', cat: 'phys' },
      { label: 'V', val: 'V', cat: 'phys' },
      { label: 'A', val: 'A', cat: 'phys' },
      { label: 'Ω', val: 'Ω', cat: 'phys' },
      { label: 'W', val: 'W', cat: 'phys' },
      { label: 'N', val: 'N', cat: 'phys' },
      { label: 'J', val: 'J', cat: 'phys' },
      { label: 'Pa', val: 'Pa', cat: 'phys' },
      { label: 'hPa', val: 'hPa', cat: 'phys' },

      // 生物・地学単位
      { label: 'm', val: 'm', cat: 'geo' },
      { label: 'km', val: 'km', cat: 'geo' },
      { label: 's', val: 's', cat: 'geo' },
      { label: '%', val: '%', cat: 'geo' },
      { label: '°', val: '°', cat: 'geo' },
      { label: '/', val: '/', cat: 'geo' },
    ],
  },

  geography: {
    hasCategories: false,
    keys: [
      { label: '0', val: '0' },
      { label: '1', val: '1' },
      { label: '2', val: '2' },
      { label: '3', val: '3' },
      { label: '4', val: '4' },
      { label: '5', val: '5' },
      { label: '6', val: '6' },
      { label: '7', val: '7' },
      { label: '8', val: '8' },
      { label: '9', val: '9' },
      { label: '.', val: '.' },
      { label: ',', val: ',' },
      { label: '-', val: '-' },
      { label: ':', val: ':' },
      { label: '/', val: '/' },
      { label: '〜', val: '〜' },
      { label: '、', val: '、' },
      { label: 'm', val: 'm' },
      { label: 'km', val: 'km' },
      { label: '²', val: '²' },
      { label: '℃', val: '℃' },
      { label: '%', val: '%' },
      { label: 'hPa', val: 'hPa' },
      { label: '時間', val: '時間' },
    ],
  },

  history: {
    hasCategories: false,
    keys: [
      { label: '0', val: '0' },
      { label: '1', val: '1' },
      { label: '2', val: '2' },
      { label: '3', val: '3' },
      { label: '4', val: '4' },
      { label: '5', val: '5' },
      { label: '6', val: '6' },
      { label: '7', val: '7' },
      { label: '8', val: '8' },
      { label: '9', val: '9' },
      { label: '年', val: '年' },
      { label: '世紀', val: '世紀' },
      { label: '第', val: '第' },
      { label: '代', val: '代' },
      { label: '人', val: '人' },
      { label: '、', val: '、' },
      { label: '・', val: '・' },
      { label: '〜', val: '〜' },
      { label: '-', val: '-' },
    ],
  },

  civics: {
    hasCategories: false,
    keys: [
      { label: '0', val: '0' },
      { label: '1', val: '1' },
      { label: '2', val: '2' },
      { label: '3', val: '3' },
      { label: '4', val: '4' },
      { label: '5', val: '5' },
      { label: '6', val: '6' },
      { label: '7', val: '7' },
      { label: '8', val: '8' },
      { label: '9', val: '9' },
      { label: '第', val: '第' },
      { label: '条', val: '条' },
      { label: '歳', val: '歳' },
      { label: '人', val: '人' },
      { label: '%', val: '%' },
      { label: '(', val: '(' },
      { label: ')', val: ')' },
      { label: '「', val: '「' },
      { label: '」', val: '」' },
      { label: '・', val: '・' },
      { label: '，', val: '，' },
      { label: '〜', val: '〜' },
    ],
  },

  english: {
    hasCategories: false,
    isQwerty: true,
    keys: [], // QWERTY is rendered dynamically with Shift state
  },
};
