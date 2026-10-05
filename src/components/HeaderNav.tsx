import React from 'react';
import { GameMode } from '../types';
import { SlidersHorizontal, BarChart3 } from 'lucide-react';

interface HeaderNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onSelectMode,
  onOpenSettings,
  onOpenHistory
}) => {
  const modes: Array<{ id: GameMode; label: string }> = [
    { id: 'words', label: 'Mots' },
    { id: 'time', label: 'Chrono' },
    { id: 'quotes', label: 'Citations' },
    { id: 'code', label: 'Code' },
    { id: 'accuracy', label: 'Précision' }
  ];

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectMode('words');
        }}
        className="text-xl font-bold tracking-tight text-stone-900 font-serif select-none"
      >
        KeyPulse
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                isActive
                  ? 'text-stone-950 font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {mode.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
          title="Historique des sessions"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Historique</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Paramètres</span>
        </button>
      </div>
    </header>
  );
};
