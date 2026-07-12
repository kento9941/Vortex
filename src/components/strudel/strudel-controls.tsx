// src/components/strudel-controls.tsx
import { useStrudelStore } from "../../stores/useStrudelStore";

export default function StrudelControls() {
  const play = useStrudelStore((state) => state.play);
  const stop = useStrudelStore((state) => state.stop);
  const proc = useStrudelStore((state) => state.proc);
  const isPlaying = useStrudelStore((state) => state.isPlaying);

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button onClick={() => play?.()} disabled={!play || isPlaying} className="cursor-pointer">
        Play
      </button>
      <button onClick={() => stop?.()} disabled={!stop || !isPlaying}>
        Stop
      </button>
      <button onClick={() => proc?.()} disabled={!proc}>
        Load Tune
      </button>
    </div>
  );
}