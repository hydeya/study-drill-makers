import React, { useState } from 'react';
import { ChevronDown, Keyboard } from 'lucide-react';
import { SubjectId } from '../types';
import { KEYBOARD_CONFIGS, COMMON_CONTROL_KEYS, KeyItem } from '../data/keyboards';

interface SmartKeyboardProps {
  subjectId: SubjectId;
  subjectName: string;
  themeColor: string;
  onInsert: (val: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const QWERTY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const SmartKeyboard: React.FC<SmartKeyboardProps> = ({
  subjectId,
  subjectName,
  themeColor,
  onInsert,
  onBackspace,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);

  const config = KEYBOARD_CONFIGS[subjectId];
  if (!config) return null; // 国語などキーボード不要な教科

  const handleKeyClick = (key: KeyItem) => {
    if (key.val === '__BACKSPACE__') {
      onBackspace();
    } else if (key.val === '__CLEAR__') {
      onClear();
    } else {
      onInsert(key.val);
    }
  };

  // フィルタリングされたキー
  const filteredKeys = config.hasCategories
    ? config.keys.filter((k) => currentTab === 'all' || k.cat === currentTab)
    : config.keys;

  return (
    <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-gray-200 shadow-2xs shrink-0 select-none">
      {/* アコーディオン開閉ヘッダー */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5" style={{ color: themeColor }} />
          <span>{subjectName}専用スマートキーボード</span>
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 flex items-center gap-1 transition"
        >
          <span>{isOpen ? '閉じる' : '開く'}</span>
          <ChevronDown
            className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* アコーディオン本体パネル */}
      <div
        className={`transition-all duration-200 overflow-hidden ${
          isOpen ? 'max-h-[300px] opacity-100 pt-1' : 'max-h-0 opacity-0 p-0 m-0'
        }`}
      >
        {/* カテゴリタブ（数学・理科など） */}
        {config.hasCategories && config.categories && (
          <div className="flex flex-wrap border-b border-gray-100 pb-1.5 mb-1.5 gap-1 text-[10px]">
            {config.categories.map((cat) => {
              const isActive = currentTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCurrentTab(cat.id)}
                  style={{
                    backgroundColor: isActive ? themeColor : '#ffffff',
                    color: isActive ? '#ffffff' : '#4b5563',
                    borderColor: isActive ? themeColor : '#e5e7eb',
                  }}
                  className="px-2 py-0.5 rounded border font-medium transition"
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 英語QWERTYキーボード */}
        {config.isQwerty ? (
          <div className="space-y-1">
            {/* 1行目 */}
            <div className="grid grid-cols-10 gap-1">
              {QWERTY_ROWS[0].map((char) => {
                const displayChar = isShiftActive ? char.toUpperCase() : char;
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(displayChar)}
                    className="py-1.5 text-xs font-semibold rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 active:scale-95 transition"
                  >
                    {displayChar}
                  </button>
                );
              })}
            </div>

            {/* 2行目 */}
            <div className="grid grid-cols-9 gap-1 px-2">
              {QWERTY_ROWS[1].map((char) => {
                const displayChar = isShiftActive ? char.toUpperCase() : char;
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(displayChar)}
                    className="py-1.5 text-xs font-semibold rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 active:scale-95 transition"
                  >
                    {displayChar}
                  </button>
                );
              })}
            </div>

            {/* 3行目 (Shift + z〜m + ⌫) */}
            <div className="grid grid-cols-9 gap-1">
              <button
                type="button"
                onClick={() => setIsShiftActive(!isShiftActive)}
                className={`py-1.5 text-[10px] font-bold rounded border transition ${
                  isShiftActive
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-2xs'
                    : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}
              >
                ⇧
              </button>
              {QWERTY_ROWS[2].map((char) => {
                const displayChar = isShiftActive ? char.toUpperCase() : char;
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(displayChar)}
                    className="py-1.5 text-xs font-semibold rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 active:scale-95 transition"
                  >
                    {displayChar}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={onBackspace}
                className="py-1.5 text-xs font-bold rounded bg-gray-200 text-gray-700 border border-gray-300 active:bg-gray-300"
              >
                ⌫
              </button>
            </div>

            {/* 4行目 (記号 + Space + AC) */}
            <div className="flex gap-1 pt-0.5">
              {['.', "'", ',', '?'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => onInsert(sym)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 active:scale-95 transition"
                >
                  {sym}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onInsert(' ')}
                className="flex-1 py-1.5 text-[11px] font-bold rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600 transition"
              >
                Space
              </button>
              <button
                type="button"
                onClick={onClear}
                className="px-3 py-1.5 text-[10px] font-bold rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
              >
                AC
              </button>
            </div>
          </div>
        ) : (
          /* 通常グリッドキーボード (5列〜6列) */
          <div>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 max-h-[140px] overflow-y-auto pr-0.5">
              {filteredKeys.map((key, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKeyClick(key)}
                  className="py-1.5 px-1 text-xs font-semibold rounded bg-white hover:bg-gray-50 active:bg-gray-200 border border-gray-200 text-gray-800 shadow-2xs transition active:scale-95 flex items-center justify-center"
                >
                  {key.label}
                </button>
              ))}
              {/* 操作キー（⌫ / AC） */}
              {COMMON_CONTROL_KEYS.map((k) => (
                <button
                  key={k.label}
                  type="button"
                  onClick={() => handleKeyClick(k)}
                  className={`py-1.5 px-1 text-xs font-bold rounded border shadow-2xs transition active:scale-95 flex items-center justify-center ${
                    k.label === 'AC'
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
