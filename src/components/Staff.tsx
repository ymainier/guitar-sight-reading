import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from "vexflow";

interface StaffProps {
  pitch: string; // VexFlow format: "c/4", "d/4", etc.
}

export function Staff({ pitch }: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous rendering
    containerRef.current.innerHTML = "";

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(400, 150);
    const context = renderer.getContext();

    // Create a stave with treble clef
    const stave = new Stave(50, 20, 300);
    stave.addClef("treble");
    stave.setContext(context).draw();

    // Create the note
    const note = new StaveNote({
      keys: [pitch],
      duration: "w", // whole note
    });

    // Add accidental if present in the pitch (e.g., "f#/5" or "bb/4")
    const notePart = pitch.split("/")[0];
    if (notePart.includes("#")) {
      note.addModifier(new Accidental("#"));
    } else if (notePart.includes("b") && notePart.length > 1) {
      note.addModifier(new Accidental("b"));
    }

    // Create a voice and add the note
    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickable(note);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
  }, [pitch]);

  return <div ref={containerRef} />;
}
