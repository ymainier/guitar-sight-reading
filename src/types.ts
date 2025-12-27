export interface GuitarPosition {
  string: number; // 1-6 (1 = high E, 6 = low E)
  fret: number; // 0-24
}

export interface Note {
  pitch: string; // VexFlow format: "c/4", "d/4", etc.
  positions: GuitarPosition[]; // All possible positions for this note
}

export type Difficulty = "openStrings" | "firstPosition" | "intermediate" | "advanced";

export interface DifficultyConfig {
  label: string;
  maxFret: number;
  strings: number[]; // Which strings to include
}

export interface GameState {
  currentNote: Note | null;
  options: GuitarPosition[];
  correctAnswer: GuitarPosition | null;
  selectedAnswer: GuitarPosition | null;
  revealed: boolean;
}
