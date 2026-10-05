import React from 'react';
import { Stats, GameMode } from '../types';
import { RotateCcw, Target, Zap, Award, Sparkles, AlertCircle } from 'lucide-react';

interface RoundSummaryModalProps {
  stats: Stats;
  gameMode: GameMode;
  onPlayAgain: () => void;
  onPracticeMistakes?: (mistypedChars: string[]) => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  stats,
  gameMode,
  onPlayAgain,
  onPracticeMistakes
}) => {
  // Sort most mistyped characters
  const mistypedList = Object.entries(stats.mistypedKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getRank = (wpm: number, accuracy: number) => {
    if (wpm >= 90 && accuracy >= 98) return { title: 'Grand maître du clavier', desc: 'Vitesse foudroyante et précision chirurgicale.' };
    if (wpm >= 75 && accuracy >= 95) return { title: 'Virtuose de la cadence', desc: 'Excellente régularité et rythme soutenu.' };
    if (wpm >= 55 && accuracy >= 92) return { title: 'Dactylo fluide', desc: 'Grande régularité et solide mémoire musculaire.' };
    if (accuracy >= 98) return { title: 'Tireur d\'élite de la précision', desc: 'Frappe impeccable, la vitesse viendra naturellement.' };
    if (wpm >= 40) return { title: 'Opérateur régulier', desc: 'Bonne base technique. Continuez à cibler vos touches faibles !' };
    return { title: 'Apprenti dactylo', desc: 'Privilégiez la précision avant de chercher la vitesse brute.' };
  };

  const rank = getRank(stats.wpm, stats.accuracy);

  const getModeLabel = (m: GameMode) => {
    switch (m) {
      case 'words': return 'MOTS';
      case 'time': return 'CHRONO';
      case 'quotes': return 'CITATIONS';
      case 'code': return 'CODE';
      case 'accuracy': return 'PRÉCISION';
      case 'custom': return 'PERSONNALISÉ';
      default: return String(m).toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header with Title & Rank */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
                Session terminée · {getModeLabel(gameMode)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {rank.title}
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">
              {rank.desc}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Vitesse nette
            </span>
            <span className="text-3xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {stats.wpm}
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              brute : {stats.rawWpm} mpm
            </span>
          </div>

          <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              Précision
            </span>
            <span className="text-3xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {stats.accuracy}%
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              {stats.incorrectChars} erreur{stats.incorrectChars > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Série record
            </span>
            <span className="text-3xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {stats.maxStreak}
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              caractères d'affilée
            </span>
          </div>

          <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
              Frappes totales
            </span>
            <span className="text-3xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {stats.totalKeystrokes}
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5">
              en {stats.elapsedSeconds} s
            </span>
          </div>
        </div>

        {/* Tricky / Mistyped Keys Diagnostic */}
        {mistypedList.length > 0 && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                Touches à travailler
              </span>
              <span className="text-xs text-stone-500">
                Nombre d'erreurs
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {mistypedList.map(([char, count]) => (
                <div
                  key={char}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono shadow-2xs"
                >
                  <span className="font-bold text-stone-900 text-sm">
                    {char === ' ' ? '␣ espace' : char}
                  </span>
                  <span className="text-rose-600 font-semibold">
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          {mistypedList.length > 0 && onPracticeMistakes && (
            <button
              onClick={() => onPracticeMistakes(mistypedList.map(([char]) => char))}
              className="px-4 py-2.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Entraîner les touches faibles
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              autoFocus
              onClick={onPlayAgain}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Session suivante</span>
              <kbd className="font-mono text-xs opacity-70 bg-stone-800 px-1.5 py-0.5 rounded">
                Entrée
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
