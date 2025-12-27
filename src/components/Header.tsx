import type { Difficulty } from "../types";
import { DIFFICULTY_CONFIGS } from "../utils/notes";

interface HeaderProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function Header({ difficulty, onDifficultyChange }: HeaderProps) {
  return (
    <header className="header">
      <h1>Guitar Sight Reading</h1>
      <div className="select-wrapper">
        <select
          className="select"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
        >
          {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((key) => (
            <option key={key} value={key}>
              {DIFFICULTY_CONFIGS[key].label}
            </option>
          ))}
        </select>
        <span className="select-arrow">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </header>
  );
}
