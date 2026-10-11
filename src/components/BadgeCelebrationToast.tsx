import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, X, ChevronRight } from 'lucide-react';
import { BadgeDefinition } from '../data/badges';

interface BadgeCelebrationToastProps {
  newBadges: BadgeDefinition[];
  onDismiss: () => void;
}

export const BadgeCelebrationToast: React.FC<BadgeCelebrationToastProps> = ({
  newBadges,
  onDismiss,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!newBadges || newBadges.length === 0) return null;

  const currentBadge = newBadges[currentIndex];
  const isMultiple = newBadges.length > 1;

  const handleNextOrClose = () => {
    if (currentIndex + 1 < newBadges.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 p-4 rounded-2xl shadow-xl border-2 border-yellow-200 animate-in zoom-in-95 duration-300 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/30 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        {/* Trophy icon */}
        <div className="w-10 h-10 rounded-xl bg-white/90 border border-amber-300 flex items-center justify-center shrink-0 shadow-md">
          <Trophy className="w-6 h-6 text-amber-600 animate-bounce" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-amber-950">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>
              🎉 新たな称号を獲得！
              {isMultiple && ` (${currentIndex + 1}/${newBadges.length})`}
            </span>
          </div>

          <div className="text-base sm:text-lg font-black text-slate-950 drop-shadow-xs">
            【{currentBadge.name}】
          </div>

          <div className="text-xs font-bold text-amber-950/90 leading-tight">
            達成条件: {currentBadge.conditionText}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1 shrink-0">
          {isMultiple && currentIndex + 1 < newBadges.length ? (
            <button
              type="button"
              onClick={handleNextOrClose}
              className="px-3 py-1.5 rounded-lg bg-slate-950 text-amber-300 font-black text-xs flex items-center gap-1 hover:bg-slate-900 transition cursor-pointer shadow-md"
            >
              <span>次へ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-black/10 text-slate-900 transition cursor-pointer"
              title="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
