import { useEffect, useRef } from "react";
import { Renderer, TabStave, TabNote, Voice, Formatter } from "vexflow";
import type { GuitarPosition } from "../types";

interface TabOptionProps {
  position: GuitarPosition;
  selected: boolean;
  correct: boolean | null; // null = not revealed, true = correct, false = incorrect
  onClick: () => void;
}

export function TabOption({ position, selected, correct, onClick }: TabOptionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = "";

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(120, 100);
    const context = renderer.getContext();

    // Create a tab stave (6 strings)
    const tabStave = new TabStave(10, -30, 100);
    tabStave.setNumLines(6);
    tabStave.setContext(context).draw();

    const positions = [{ str: position.string, fret: position.fret }];

    const tabNote = new TabNote({
      positions,
      duration: "w",
    });

    // Create a voice and add the note
    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickable(tabNote);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], 60);
    voice.draw(context, tabStave);
  }, [position]);

  let className = "tab-option";
  if (selected) className += " selected";
  if (correct === true) className += " correct";
  if (correct === false && selected) className += " incorrect";

  return (
    <button className={className} onClick={onClick} type="button">
      <div ref={containerRef} />
    </button>
  );
}
