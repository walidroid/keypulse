export type GameMode = 'words' | 'time' | 'quotes' | 'code' | 'accuracy' | 'custom';

export type WordCountOption = 10 | 25 | 50 | 100;
export type TimeOption = 15 | 30 | 60 | 120;

export type SoundProfile = 'thock' | 'clicky' | 'creamy' | 'silent';
export type ThemeMode = 'paper' | 'dark' | 'sepia' | 'cyber';
export type HighlightColor = 'amber' | 'emerald' | 'blue' | 'purple' | 'crimson';

export interface KeyFingerMap {
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky' | 'thumb';
  label: string;
}

export interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  currentStreak: number;
  maxStreak: number;
  mistypedKeys: Record<string, number>;
  wpmHistory: Array<{ second: number; wpm: number; rawWpm: number; errors: number }>;
}

export interface RoundResult {
  id: string;
  timestamp: number;
  dateStr: string;
  mode: GameMode;
  targetDescription: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  correctChars: number;
  incorrectChars: number;
  maxStreak: number;
  mostMistyped: Array<{ char: string; count: number }>;
}

export interface TextSnippet {
  id: string;
  title: string;
  category: 'quotes' | 'code' | 'accuracy' | 'custom' | 'general';
  text: string;
  authorOrSource?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}
