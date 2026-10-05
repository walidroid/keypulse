import React from 'react';
import { RoundResult } from '../types';
import { X, Trophy, Target, Zap, Clock, Trash2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RoundResult[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory
}) => {
  if (!isOpen) return null;

  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const bestAccuracy = history.length > 0 ? Math.max(...history.map((h) => h.accuracy)) : 0;
  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col gap-6 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Historique des sessions</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {history.length} session{history.length > 1 ? 's' : ''} enregistrée{history.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col">
            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Vitesse record
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {bestWpm}
            </span>
            <span className="text-[10px] text-stone-400">mots / min</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col">
            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              Vitesse moyenne
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {avgWpm}
            </span>
            <span className="text-[10px] text-stone-400">allure moyenne</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col">
            <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              Précision record
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
              {bestAccuracy}%
            </span>
            <span className="text-[10px] text-stone-400">exactitude max</span>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto min-h-48 max-h-72 border border-stone-200/80 rounded-2xl divide-y divide-stone-100">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400">
              <Clock className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium text-stone-600">Aucune session enregistrée</p>
              <p className="text-xs text-stone-400 mt-0.5">Terminez une session de frappe pour voir vos statistiques</p>
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className="p-3.5 flex items-center justify-between hover:bg-stone-50/70 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-800 capitalize">
                      {record.mode === 'words'
                        ? 'Mots'
                        : record.mode === 'time'
                        ? 'Chrono'
                        : record.mode === 'quotes'
                        ? 'Citations'
                        : record.mode === 'code'
                        ? 'Code'
                        : record.mode === 'accuracy'
                        ? 'Précision'
                        : 'Personnalisé'}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500 truncate max-w-48">
                      {record.targetDescription}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 mt-0.5 font-mono">
                    {record.dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-base font-bold font-mono tabular-nums text-stone-900">
                      {record.wpm} <span className="text-xs font-normal text-stone-500">mpm</span>
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-stone-500">
                      {record.accuracy}% précision
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Effacer l'historique
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors ml-auto"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
