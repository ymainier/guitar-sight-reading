import type { GuitarPosition, Note, Difficulty, DifficultyConfig } from "../types";

// Standard tuning: string number -> MIDI note number for open string (written pitch)
// Guitar notation is written one octave higher than it sounds (transposing instrument)
// Written pitch: String 1 (high E) = E5 = 76, String 6 (low E) = E3 = 52
// Concert pitch would be: E4 and E2 respectively
const STRING_OPEN_NOTES: Record<number, number> = {
  1: 76, // E5 (written) - sounds as E4
  2: 71, // B4 (written) - sounds as B3
  3: 67, // G4 (written) - sounds as G3
  4: 62, // D4 (written) - sounds as D3
  5: 57, // A3 (written) - sounds as A2
  6: 52, // E3 (written) - sounds as E2
};

// MIDI note to VexFlow pitch mapping
const MIDI_TO_VEXFLOW: Record<number, string> = {
  40: "e/2",
  41: "f/2",
  42: "f#/2",
  43: "g/2",
  44: "g#/2",
  45: "a/2",
  46: "a#/2",
  47: "b/2",
  48: "c/3",
  49: "c#/3",
  50: "d/3",
  51: "d#/3",
  52: "e/3",
  53: "f/3",
  54: "f#/3",
  55: "g/3",
  56: "g#/3",
  57: "a/3",
  58: "a#/3",
  59: "b/3",
  60: "c/4",
  61: "c#/4",
  62: "d/4",
  63: "d#/4",
  64: "e/4",
  65: "f/4",
  66: "f#/4",
  67: "g/4",
  68: "g#/4",
  69: "a/4",
  70: "a#/4",
  71: "b/4",
  72: "c/5",
  73: "c#/5",
  74: "d/5",
  75: "d#/5",
  76: "e/5",
  77: "f/5",
  78: "f#/5",
  79: "g/5",
  80: "g#/5",
  81: "a/5",
  82: "a#/5",
  83: "b/5",
  84: "c/6",
  85: "c#/6",
  86: "d/6",
  87: "d#/6",
  88: "e/6",
};

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  openStrings: {
    label: "Open Strings",
    maxFret: 0,
    strings: [1, 2, 3, 4, 5, 6],
  },
  firstPosition: {
    label: "First Position",
    maxFret: 4,
    strings: [1, 2, 3, 4, 5, 6],
  },
  intermediate: {
    label: "Intermediate",
    maxFret: 7,
    strings: [1, 2, 3, 4, 5, 6],
  },
  advanced: {
    label: "Advanced",
    maxFret: 12,
    strings: [1, 2, 3, 4, 5, 6],
  },
};

// Get MIDI note number for a guitar position
export function getMidiNote(position: GuitarPosition): number {
  return STRING_OPEN_NOTES[position.string] + position.fret;
}

// Get VexFlow pitch for a guitar position
export function getVexFlowPitch(position: GuitarPosition): string {
  const midi = getMidiNote(position);
  return MIDI_TO_VEXFLOW[midi] || "c/4";
}

// Generate all possible guitar positions for a given difficulty
export function getAvailablePositions(config: DifficultyConfig): GuitarPosition[] {
  const positions: GuitarPosition[] = [];
  for (const string of config.strings) {
    for (let fret = 0; fret <= config.maxFret; fret++) {
      positions.push({ string, fret });
    }
  }
  return positions;
}

// Get all positions that produce the same note
export function getEquivalentPositions(
  targetPosition: GuitarPosition,
  config: DifficultyConfig
): GuitarPosition[] {
  const targetMidi = getMidiNote(targetPosition);
  const available = getAvailablePositions(config);
  return available.filter((pos) => getMidiNote(pos) === targetMidi);
}

// Generate a random note with its correct position and wrong options
export function generateQuestion(
  config: DifficultyConfig
): { note: Note; correctPosition: GuitarPosition; options: GuitarPosition[] } {
  const availablePositions = getAvailablePositions(config);

  // Pick a random position as the correct answer
  const correctPosition =
    availablePositions[Math.floor(Math.random() * availablePositions.length)];
  const pitch = getVexFlowPitch(correctPosition);

  // Find all equivalent positions (same note, different position)
  const equivalentPositions = getEquivalentPositions(correctPosition, config);

  // Generate wrong options (different notes)
  const wrongOptions = availablePositions.filter(
    (pos) => getMidiNote(pos) !== getMidiNote(correctPosition)
  );

  // Shuffle and pick 3 wrong options
  const shuffledWrong = shuffleArray(wrongOptions).slice(0, 3);

  // Combine correct and wrong, then shuffle
  const options = shuffleArray([correctPosition, ...shuffledWrong]).slice(0, 4);

  // Ensure the correct answer is in the options
  if (!options.some((opt) => positionsEqual(opt, correctPosition))) {
    options[0] = correctPosition;
  }

  return {
    note: { pitch, positions: equivalentPositions },
    correctPosition,
    options: shuffleArray(options),
  };
}

// Check if a position is correct (same note, may be different position)
export function isCorrectAnswer(
  selected: GuitarPosition,
  correct: GuitarPosition
): boolean {
  return getMidiNote(selected) === getMidiNote(correct);
}

// Check if two positions are exactly the same
export function positionsEqual(a: GuitarPosition, b: GuitarPosition): boolean {
  return a.string === b.string && a.fret === b.fret;
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
