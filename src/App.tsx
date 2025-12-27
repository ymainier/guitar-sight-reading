import { useState, useMemo } from "react";
import type { Difficulty, GuitarPosition, Note } from "./types";
import {
  DIFFICULTY_CONFIGS,
  generateQuestion,
  isCorrectAnswer,
  positionsEqual,
} from "./utils/notes";
import { Header } from "./components/Header";
import { Staff } from "./components/Staff";
import { TabOption } from "./components/TabOption";

interface QuestionState {
  note: Note;
  options: GuitarPosition[];
  correctPosition: GuitarPosition;
}

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("openStrings");
  const [questionKey, setQuestionKey] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<GuitarPosition | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = useMemo<QuestionState>(() => {
    // questionKey is used to trigger re-generation
    void questionKey;
    const config = DIFFICULTY_CONFIGS[difficulty];
    const q = generateQuestion(config);
    return {
      note: q.note,
      options: q.options,
      correctPosition: q.correctPosition,
    };
  }, [difficulty, questionKey]);

  const generateNewQuestion = () => {
    setQuestionKey((k) => k + 1);
    setSelectedPosition(null);
    setRevealed(false);
  };

  const handleOptionClick = (position: GuitarPosition) => {
    if (revealed) return;
    setSelectedPosition(position);
    setRevealed(true);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const getOptionCorrectness = (position: GuitarPosition): boolean | null => {
    if (!revealed) return null;
    return isCorrectAnswer(position, question.correctPosition);
  };

  return (
    <div className="container">
      <Header difficulty={difficulty} onDifficultyChange={handleDifficultyChange} />

      <section>
        <h2 className="section-label">STANDARD NOTATION</h2>
        <div className="staff-container">
          <Staff pitch={question.note.pitch} />
        </div>
      </section>

      <section className="tab-section">
        <h2 className="section-label">WHERE IS THIS NOTE?</h2>
        <div className="tab-options">
          {question.options.map((position, index) => (
            <TabOption
              key={`${position.string}-${position.fret}-${index}`}
              position={position}
              selected={
                selectedPosition !== null && positionsEqual(position, selectedPosition)
              }
              correct={getOptionCorrectness(position)}
              onClick={() => handleOptionClick(position)}
            />
          ))}
        </div>
      </section>

      {revealed && (
        <div className="controls">
          <button className="button" onClick={generateNewQuestion}>
            Next Note
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
