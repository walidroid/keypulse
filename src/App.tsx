/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  HighlightColor,
  SoundProfile,
  Stats,
  RoundResult,
  WordCountOption,
  TimeOption
} from './types';
import { sound } from './utils/audio';
import {
  getRandomWords,
  getAccuracyDrillText,
  ACCURACY_WORDS,
  CURATED_QUOTES,
  CODE_SNIPPETS
} from './data/texts';
import { HeaderNav } from './components/HeaderNav';
import { StatsBar } from './components/StatsBar';
import { TypingArea } from './components/TypingArea';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Mode et configuration
  const [mode, setMode] = useState<GameMode>('words');
  const [wordCount, setWordCount] = useState<WordCountOption>(25);
  const [timeLimit, setTimeLimit] = useState<TimeOption>(30);
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('amber');
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('thock');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');

  // Modales
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  // État du jeu
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [activePhysicalKey, setActivePhysicalKey] = useState<string | null>(null);

  // Statistiques
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    elapsedSeconds: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalKeystrokes: 0,
    currentStreak: 0,
    maxStreak: 0,
    mistypedKeys: {},
    wpmHistory: []
  });

  // Historique des sessions
  const [history, setHistory] = useState<RoundResult[]>(() => {
    try {
      const saved = localStorage.getItem('keypulse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sauvegarde dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('keypulse_history', JSON.stringify(history));
    } catch {
      // Stockage non disponible dans le bac à sable
    }
  }, [history]);

  // Synchronisation des paramètres audio
  useEffect(() => {
    sound.setMuted(isMuted);
    sound.setProfile(soundProfile);
  }, [isMuted, soundProfile]);

  // Génération du texte selon le mode sélectionné
  const generateNewTest = useCallback(() => {
    setIsStarted(false);
    setIsRoundFinished(false);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCurrentInput('');
    setHasError(false);
    setActivePhysicalKey(null);
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      elapsedSeconds: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalKeystrokes: 0,
      currentStreak: 0,
      maxStreak: 0,
      mistypedKeys: {},
      wpmHistory: []
    });

    let newWords: string[] = [];

    switch (mode) {
      case 'words':
        newWords = getRandomWords(wordCount).split(' ');
        break;
      case 'time':
        // Génère un stock généreux de mots pour ne pas manquer de texte avant la fin du temps
        newWords = getRandomWords(160).split(' ');
        break;
      case 'quotes': {
        const randomQuote =
          CURATED_QUOTES[Math.floor(Math.random() * CURATED_QUOTES.length)];
        newWords = randomQuote.text.split(' ');
        break;
      }
      case 'code': {
        const randomCode =
          CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        newWords = randomCode.text.split(' ');
        break;
      }
      case 'accuracy':
        newWords = getAccuracyDrillText(wordCount).split(' ');
        break;
      case 'custom':
        if (customText.trim()) {
          newWords = customText.trim().split(/\s+/);
        } else {
          newWords = getRandomWords(25).split(' ');
        }
        break;
      default:
        newWords = getRandomWords(25).split(' ');
    }

    setWords(newWords);
  }, [mode, wordCount, customText]);

  // Réinitialisation lors du changement de mode ou de paramètres
  useEffect(() => {
    generateNewTest();
  }, [generateNewTest]);

  // Mot cible et caractère attendu
  const currentWord = words[currentWordIndex] || '';
  const isLastWord = currentWordIndex === words.length - 1;
  const targetSequence = isLastWord ? currentWord : currentWord + ' ';
  const expectedChar = targetSequence[currentCharIndex] || '';

  // Boucle de chronométrage
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStarted && !isRoundFinished) {
      timerRef.current = setInterval(() => {
        setStats((prev) => {
          const nextElapsed = prev.elapsedSeconds + 1;
          const minutes = Math.max(1 / 60, nextElapsed / 60);

          // Vitesse standard : (caractères corrects / 5) / minutes
          const calcWpm = Math.round((prev.correctChars / 5) / minutes);
          const calcRaw = Math.round((prev.totalKeystrokes / 5) / minutes);
          const calcAcc =
            prev.totalKeystrokes > 0
              ? Math.round((prev.correctChars / prev.totalKeystrokes) * 100)
              : 100;

          return {
            ...prev,
            elapsedSeconds: nextElapsed,
            wpm: calcWpm,
            rawWpm: calcRaw,
            accuracy: calcAcc,
            wpmHistory: [
              ...prev.wpmHistory,
              { second: nextElapsed, wpm: calcWpm, rawWpm: calcRaw, errors: prev.incorrectChars }
            ]
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isRoundFinished]);

  // Fin automatique en mode chrono
  useEffect(() => {
    if (mode === 'time' && isStarted && !isRoundFinished && stats.elapsedSeconds >= timeLimit) {
      finishRound();
    }
  }, [mode, isStarted, isRoundFinished, stats.elapsedSeconds, timeLimit]);

  // Clôture de la session
  const finishRound = useCallback(() => {
    setIsRoundFinished(true);
    setIsStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playRoundVictory();

    setStats((prev) => {
      const minutes = Math.max(1 / 60, prev.elapsedSeconds / 60);
      const finalWpm = Math.round((prev.correctChars / 5) / minutes);
      const finalRaw = Math.round((prev.totalKeystrokes / 5) / minutes);
      const finalAcc =
        prev.totalKeystrokes > 0
          ? Math.round((prev.correctChars / prev.totalKeystrokes) * 100)
          : 100;

      const record: RoundResult = {
        id: 'session-' + Date.now(),
        timestamp: Date.now(),
        dateStr: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        mode,
        targetDescription:
          mode === 'words'
            ? `${wordCount} mots`
            : mode === 'time'
            ? `${timeLimit} s chrono`
            : mode === 'quotes'
            ? 'Citations'
            : mode === 'code'
            ? 'Code'
            : mode === 'accuracy'
            ? 'Précision'
            : 'Personnalisé',
        wpm: finalWpm,
        rawWpm: finalRaw,
        accuracy: finalAcc,
        elapsedSeconds: prev.elapsedSeconds,
        correctChars: prev.correctChars,
        incorrectChars: prev.incorrectChars,
        maxStreak: prev.maxStreak,
        mostMistyped: Object.entries(prev.mistypedKeys)
          .sort((a, b) => b[1] - a[1])
          .map(([char, count]) => ({ char, count }))
      };

      setHistory((old) => [record, ...old.slice(0, 49)]);

      return {
        ...prev,
        wpm: finalWpm,
        rawWpm: finalRaw,
        accuracy: finalAcc
      };
    });
  }, [mode, wordCount, timeLimit]);

  // Gestionnaire global du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'textarea' || targetTag === 'input') {
        return;
      }

      // Raccourci pour recommencer immédiatement : touche Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        generateNewTest();
        return;
      }

      // Touche Entrée sur la modale de fin pour lancer la session suivante
      if (isRoundFinished && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        generateNewTest();
        return;
      }

      if (isRoundFinished) return;

      // Animation visuelle de la touche physique pressée
      setActivePhysicalKey(e.key === ' ' ? 'Space' : e.key);
      setTimeout(() => setActivePhysicalKey(null), 120);

      // Gestion de la touche Effacer (Backspace)
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentCharIndex > 0) {
          const newIndex = currentCharIndex - 1;
          setCurrentCharIndex(newIndex);
          setCurrentInput((prev) => prev.slice(0, -1));
          setHasError(false);
          sound.playKey('Backspace');
        }
        return;
      }

      // Ignorer les touches de combinaison
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Traitement des caractères uniques
      if (e.key.length === 1) {
        if (e.key === ' ') {
          e.preventDefault();
        }

        if (!isStarted) {
          setIsStarted(true);
        }

        const inputChar = e.key;
        const isMatch = inputChar === expectedChar;

        if (isMatch) {
          sound.playKey(inputChar);
          setHasError(false);

          setStats((prev) => {
            const nextCorrect = prev.correctChars + 1;
            const nextTotal = prev.totalKeystrokes + 1;
            const nextStreak = prev.currentStreak + 1;
            return {
              ...prev,
              correctChars: nextCorrect,
              totalKeystrokes: nextTotal,
              currentStreak: nextStreak,
              maxStreak: Math.max(prev.maxStreak, nextStreak),
              accuracy: Math.round((nextCorrect / nextTotal) * 100)
            };
          });

          if (expectedChar === ' ') {
            sound.playWordComplete();
            const nextWordIdx = currentWordIndex + 1;
            if (nextWordIdx >= words.length) {
              finishRound();
            } else {
              setCurrentWordIndex(nextWordIdx);
              setCurrentCharIndex(0);
              setCurrentInput('');
            }
          } else {
            if (isLastWord && currentCharIndex === targetSequence.length - 1) {
              sound.playWordComplete();
              finishRound();
            } else {
              setCurrentCharIndex((prev) => prev + 1);
              setCurrentInput((prev) => prev + inputChar);
            }
          }
        } else {
          // Erreur de frappe
          sound.playError();
          setHasError(true);

          setStats((prev) => {
            const nextErrors = prev.incorrectChars + 1;
            const nextTotal = prev.totalKeystrokes + 1;
            const nextMistyped = { ...prev.mistypedKeys };
            nextMistyped[expectedChar] = (nextMistyped[expectedChar] || 0) + 1;

            return {
              ...prev,
              incorrectChars: nextErrors,
              totalKeystrokes: nextTotal,
              currentStreak: 0,
              mistypedKeys: nextMistyped,
              accuracy: Math.round((prev.correctChars / nextTotal) * 100)
            };
          });

          setCurrentInput((prev) => prev + inputChar);
          setCurrentCharIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRoundFinished,
    currentCharIndex,
    currentWordIndex,
    expectedChar,
    isLastWord,
    isStarted,
    targetSequence.length,
    words.length,
    generateNewTest,
    finishRound
  ]);

  // Exercice ciblé sur les touches ayant provoqué des erreurs
  const handlePracticeMistakes = (mistypedChars: string[]) => {
    setIsRoundFinished(false);
    const drill = ACCURACY_WORDS.filter((w: string) =>
      mistypedChars.some((char) => w.toLowerCase().includes(char.toLowerCase()))
    );
    const customDrill = drill.length > 5 ? drill.slice(0, 15).join(' ') : getAccuracyDrillText(15);
    setMode('accuracy');
    setCustomText(customDrill);
    generateNewTest();
  };

  const getSoundLabel = (s: SoundProfile) => {
    switch (s) {
      case 'thock': return 'Frappe sourde';
      case 'clicky': return 'Clic franc';
      case 'creamy': return 'Linéaire fluide';
      case 'silent': return 'Silencieux';
    }
  };

  const getModeTitle = (m: GameMode) => {
    switch (m) {
      case 'words': return 'Mots';
      case 'time': return 'Chrono';
      case 'quotes': return 'Citations';
      case 'code': return 'Code';
      case 'accuracy': return 'Précision';
      case 'custom': return 'Personnalisé';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-stone-950">
      {/* Barre de navigation principale */}
      <HeaderNav
        currentMode={mode}
        onSelectMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'custom' && !customText) {
            setIsSettingsOpen(true);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Contenu principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Sélecteurs de mode et d'options */}
        <div className="w-full flex items-center justify-between flex-wrap gap-3">
          {/* Onglets de mode */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl">
            {(['words', 'time', 'quotes', 'code', 'accuracy'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mode === m
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {getModeTitle(m)}
              </button>
            ))}
          </div>

          {/* Sous-options selon le mode */}
          <div className="flex items-center gap-2">
            {mode === 'words' && (
              <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-mono">
                {([10, 25, 50, 100] as WordCountOption[]).map((count) => (
                  <button
                    key={count}
                    onClick={() => setWordCount(count)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      wordCount === count
                        ? 'bg-white font-bold text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {count} mots
                  </button>
                ))}
              </div>
            )}

            {mode === 'time' && (
              <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-mono">
                {([15, 30, 60, 120] as TimeOption[]).map((seconds) => (
                  <button
                    key={seconds}
                    onClick={() => setTimeLimit(seconds)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      timeLimit === seconds
                        ? 'bg-white font-bold text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {seconds} s
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Indicateurs en direct : Vitesse, Précision, Série, Temps/Progression */}
        <StatsBar
          stats={stats}
          gameMode={mode}
          targetSeconds={timeLimit}
          totalWords={words.length}
          currentWordIndex={currentWordIndex}
          isSoundMuted={isMuted}
          onToggleSound={() => setIsMuted((prev) => !prev)}
          onRestart={generateNewTest}
        />

        {/* Zone centrale de frappe : Texte estompé + Mots validés en noir gras + Caractère actif surligné */}
        <div className="flex flex-col gap-2">
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            currentInput={currentInput}
            hasError={hasError}
            highlightColor={highlightColor}
            onFocusNeeded={() => setIsFocused(true)}
            isFocused={isFocused}
            onRestart={generateNewTest}
          />
        </div>

        {/* Repères et conseils de posture */}
        <div className="w-full flex items-center justify-between text-xs text-stone-500 px-2 pt-2 border-t border-stone-200/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Posture conseillée : reposez vos index sur les ergots F et J</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Audio mécanique :</span>
            <span className="font-semibold text-stone-800">{getSoundLabel(soundProfile)}</span>
          </div>
        </div>
      </main>

      {/* Modale de fin de session */}
      {isRoundFinished && (
        <RoundSummaryModal
          stats={stats}
          gameMode={mode}
          onPlayAgain={generateNewTest}
          onPracticeMistakes={handlePracticeMistakes}
        />
      )}

      {/* Modale de préférences */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        highlightColor={highlightColor}
        onChangeHighlightColor={setHighlightColor}
        soundProfile={soundProfile}
        onChangeSoundProfile={setSoundProfile}
        onSetCustomText={(txt) => {
          setCustomText(txt);
          setMode('custom');
        }}
      />

      {/* Modale d'historique */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
