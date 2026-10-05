import React, { useRef, useEffect } from 'react';
import { HighlightColor } from '../types';

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  currentInput: string;
  hasError: boolean;
  highlightColor: HighlightColor;
  onFocusNeeded?: () => void;
  isFocused: boolean;
  onRestart: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  currentCharIndex,
  currentInput,
  hasError,
  highlightColor,
  onFocusNeeded,
  isFocused,
  onRestart
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to keep active word in comfortable reading view
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeWordRef.current;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Keep active line roughly 1/3 down from top of typing box
      const targetScroll = elementTop - containerHeight * 0.3;
      if (Math.abs(containerTop - targetScroll) > 40) {
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }
  }, [currentWordIndex]);

  const getHighlightClasses = () => {
    switch (highlightColor) {
      case 'amber':
        return 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 shadow-sm';
      case 'emerald':
        return 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-sm';
      case 'purple':
        return 'bg-purple-500 text-white ring-2 ring-purple-400 shadow-sm';
      case 'crimson':
        return 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-sm';
      case 'blue':
      default:
        return 'bg-sky-500 text-white ring-2 ring-sky-400 shadow-sm';
    }
  };

  const currentWord = words[currentWordIndex] || '';

  return (
    <div
      onClick={onFocusNeeded}
      className={`relative w-full rounded-2xl bg-white border transition-all duration-200 cursor-text select-none ${
        isFocused
          ? 'border-stone-400 shadow-lg ring-4 ring-stone-900/5'
          : 'border-stone-200/90 shadow-sm'
      }`}
    >
      {/* Unfocused overlay prompt */}
      {!isFocused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-100/70 backdrop-blur-[1px] rounded-2xl">
          <div className="px-4 py-2 bg-white border border-stone-300 rounded-xl shadow-md text-stone-700 text-sm font-medium flex items-center gap-2 animate-bounce">
            <span>Cliquez ici ou appuyez sur une touche pour commencer</span>
          </div>
        </div>
      )}

      {/* Main text stream container */}
      <div
        ref={containerRef}
        className="h-64 sm:h-72 overflow-y-auto p-6 sm:p-8 font-mono text-2xl sm:text-3xl leading-relaxed tracking-normal break-words scroll-smooth"
      >
        <div className="flex flex-wrap items-center content-start gap-x-3 gap-y-3">
          {words.map((word, wordIdx) => {
            const isCompleted = wordIdx < currentWordIndex;
            const isCurrent = wordIdx === currentWordIndex;
            const isUpcoming = wordIdx > currentWordIndex;

            // 1. COMPLETED WORDS: Fully in black bold as requested
            if (isCompleted) {
              return (
                <span
                  key={wordIdx}
                  className="font-bold text-black tracking-normal transition-colors duration-150 inline-block"
                >
                  {word}
                </span>
              );
            }

            // 2. UPCOMING WORDS: Displayed in opacity as requested
            if (isUpcoming) {
              return (
                <span
                  key={wordIdx}
                  className="font-normal text-stone-400 opacity-40 transition-opacity duration-200 inline-block"
                >
                  {word}
                </span>
              );
            }

            // 3. CURRENT ACTIVE WORD: Detailed character-by-character status & highlight
            const targetWordWithSpace = word + ' ';
            const maxLen = Math.max(targetWordWithSpace.length, currentInput.length);
            const chars = [];

            for (let i = 0; i < maxLen; i++) {
              const expectedChar = targetWordWithSpace[i];
              const typedChar = currentInput[i];
              const isPastChar = i < currentCharIndex;
              const isCurrentActiveChar = i === currentCharIndex;
              const isRemainingChar = i > currentCharIndex;

              if (isPastChar) {
                // Typed character
                const isCharCorrect = typedChar === expectedChar;
                if (isCharCorrect) {
                  // Correct typed character in current word: black bold
                  chars.push(
                    <span
                      key={i}
                      className="font-bold text-black border-b-2 border-transparent"
                    >
                      {typedChar === ' ' ? '\u00A0' : typedChar}
                    </span>
                  );
                } else {
                  // Mistyped character: distinct error styling
                  chars.push(
                    <span
                      key={i}
                      className="font-bold text-rose-600 bg-rose-100 rounded px-0.5 border-b-2 border-rose-500 animate-pulse-subtle"
                    >
                      {typedChar || expectedChar || '_'}
                    </span>
                  );
                }
              } else if (isCurrentActiveChar) {
                // THE CURRENT CHARACTER: Highlighted in a vibrant contrasting color to improve typing accuracy!
                const isSpace = expectedChar === ' ';
                chars.push(
                  <span
                    key={i}
                    className={`relative inline-flex items-center justify-center font-bold px-1 py-0.5 rounded transition-transform duration-100 ${getHighlightClasses()} ${
                      hasError ? 'bg-rose-500 text-white ring-2 ring-rose-400' : ''
                    }`}
                  >
                    {/* Blinking Caret Indicator */}
                    <span className="absolute -top-1 -bottom-1 left-0 w-0.5 bg-current animate-caret rounded-full" />
                    {isSpace ? (
                      <span className="text-sm font-mono opacity-90 px-0.5">␣</span>
                    ) : (
                      expectedChar
                    )}
                  </span>
                );
              } else if (isRemainingChar) {
                // Untyped upcoming characters in this word: in opacity
                chars.push(
                  <span
                    key={i}
                    className="font-normal text-stone-400 opacity-40"
                  >
                    {expectedChar === ' ' ? '\u00A0' : expectedChar}
                  </span>
                );
              }
            }

            return (
              <span
                key={wordIdx}
                ref={activeWordRef}
                className="inline-flex items-center tracking-normal px-1 py-0.5 rounded-lg bg-stone-100/60 ring-1 ring-stone-200/80 transition-all duration-150"
              >
                {chars}
              </span>
            );
          })}
        </div>
      </div>

      {/* Subtle bottom action toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl text-xs text-stone-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="font-semibold text-stone-800">Noir gras</span>
            <span>= mots validés</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400 opacity-40"></span>
            <span>Texte estompé = à venir</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span>
            <span className="font-medium text-stone-800">Surligné</span>
            <span>= caractère actif</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          className="flex items-center gap-1.5 font-medium text-stone-600 hover:text-stone-900 transition-colors px-2 py-1 rounded hover:bg-stone-200/60"
        >
          <span>Recommencer</span>
          <kbd className="font-mono text-[10px] bg-stone-200/90 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300">
            Tab
          </kbd>
        </button>
      </div>
    </div>
  );
};
