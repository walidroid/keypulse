import React from 'react';
import { Stats, GameMode } from '../types';
import { Flame, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface StatsBarProps {
  stats: Stats;
  gameMode: GameMode;
  targetSeconds?: number;
  totalWords: number;
  currentWordIndex: number;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  gameMode,
  targetSeconds = 30,
  totalWords,
  currentWordIndex,
  isSoundMuted,
  onToggleSound,
  onRestart
}) => {
  const remainingSeconds = Math.max(0, targetSeconds - stats.elapsedSeconds);
  const progressPercent = Math.min(100, Math.round((currentWordIndex / Math.max(1, totalWords)) * 100));

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top HUD Metrics Row */}
      <div className="w-full flex items-center justify-between px-2">
        {/* Metric Cluster: Live WPM, Accuracy, Streak */}
        <div className="flex items-baseline gap-6 sm:gap-8">
          {/* WPM */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">Vitesse</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-stone-900">
                {stats.wpm}
              </span>
              <span className="text-xs font-medium text-stone-600">mpm</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">Précision</span>
            <div className="flex items-baseline gap-0.5">
              <span className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums ${
                stats.accuracy >= 97 ? 'text-emerald-700' : stats.accuracy >= 90 ? 'text-stone-900' : 'text-amber-700'
              }`}>
                {stats.accuracy}
              </span>
              <span className="text-sm font-medium text-stone-600">%</span>
            </div>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">Série</span>
            <div className="flex items-center gap-1">
              <Flame className={`w-4 h-4 ${stats.currentStreak > 15 ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`} />
              <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                {stats.currentStreak}
              </span>
              <span className="text-xs text-stone-600 font-medium">
                (record {stats.maxStreak})
              </span>
            </div>
          </div>

          {/* Time / Progress */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
              {gameMode === 'time' ? 'Temps restant' : 'Progression'}
            </span>
            <div className="flex items-baseline gap-1">
              {gameMode === 'time' ? (
                <>
                  <span className={`text-3xl sm:text-4xl font-bold font-mono tabular-nums ${
                    remainingSeconds <= 5 ? 'text-rose-600' : 'text-stone-900'
                  }`}>
                    {remainingSeconds}
                  </span>
                  <span className="text-xs font-medium text-stone-600">s</span>
                </>
              ) : (
                <>
                  <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-stone-900">
                    {currentWordIndex}
                  </span>
                  <span className="text-xs text-stone-600">/ {totalWords}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={isSoundMuted ? 'Activer le son mécanique' : 'Couper le son'}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-5 h-5 text-stone-400" /> : <Volume2 className="w-5 h-5 text-stone-700" />}
          </button>

          <button
            onClick={onRestart}
            title="Recommencer la session (Tab)"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thin elegant progress bar */}
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-stone-900 transition-all duration-150 ease-out"
          style={{ width: `${gameMode === 'time' ? ((targetSeconds - remainingSeconds) / targetSeconds) * 100 : progressPercent}%` }}
        />
      </div>
    </div>
  );
};
