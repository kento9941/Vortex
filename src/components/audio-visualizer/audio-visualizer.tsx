import { useEffect, useRef } from "react";
import { getAudioContext } from "@strudel/webaudio";

let isAudioPatched = false;

export default function AudioVisualizer() {
    const rafRef = useRef<number>(0);
    const customAnalyserRef = useRef<AnalyserNode | null>(null);
    
    // Store references to our DOM elements so we can update them directly
    const barsRef = useRef<(HTMLDivElement | null)[]>([]);

    // We calculate a static number of bins to render the divs initially
    // 256 fftSize = 128 frequency bins. 128 * 0.9 = ~115 visible bars.
    const visibleBins = 115; 

    useEffect(() => {
        const attemptAudioWireUp = () => {
            const audioCtx = getAudioContext();
            if (!audioCtx || audioCtx.state !== "running") return false;

            if (!customAnalyserRef.current) {
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                analyser.connect(audioCtx.destination);
        
                if (!isAudioPatched) {
                    const originalConnect = AudioNode.prototype.connect;
                    
                    // @ts-ignore
                    AudioNode.prototype.connect = function (...args: any[]) {
                        const destination = args[0];
                        if (destination === audioCtx.destination && this !== analyser) {
                            console.log("Intercepted Strudel audio! Routing to visualizer...");
                            return originalConnect.apply(this, [analyser] as any);
                        }
                        return originalConnect.apply(this, args as any);
                    };
            
                    isAudioPatched = true;
                }
        
                customAnalyserRef.current = analyser;
            }
            return true;
        };

        const updateBars = () => {
            rafRef.current = requestAnimationFrame(updateBars);
            
            attemptAudioWireUp();
            const analyser = customAnalyserRef.current;

            // Default to empty data (zeros)
            let data = new Uint8Array(visibleBins);

            // If audio is flowing, populate with real data
            if (analyser) {
                const bufferLength = analyser.frequencyBinCount;
                const realData = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(realData); 
                data = realData;
            }

            // Directly update the style of each mapped div
            // Inside your updateBars loop:
            for (let i = 0; i < visibleBins; i++) {
                const bar = barsRef.current[i];
                if (!bar) continue;

                const normalized = (data[i] || 0) / 255; 
                
                // Instead of pixels, calculate a scale multiplier. 
                // 1 = 10px (resting), 8 = 80px (loud)
                const scale = Math.max(1, Math.pow(normalized, 1.2) * 20);

                // Update transform instead of height!
                bar.style.transform = `scaleY(${scale})`;
                bar.style.backgroundColor = `rgba(255, 255, 255, ${0.3 + (normalized * 0.7)})`;
            }
        };

        updateBars();
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div 
            className="flex items-center justify-center gap-[2px] w-full" 
            style={{ height: "10rem" }}
        >
            {Array.from({ length: visibleBins }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {barsRef.current[i] = el}}
                    style={{
                        width: "2px",
                        height: "4px", 
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        transformOrigin: "center",
                        willChange: "transform, background-color" // tell gpu
                    }}
                />
            ))}
        </div>
    );
}