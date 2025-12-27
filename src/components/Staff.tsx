import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";

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

    // Add ledger lines if needed (VexFlow handles this automatically)

    // Create a voice and add the note
    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickable(note);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
  }, [pitch]);

  return <div ref={containerRef} />;
}
