import { useEffect, useRef } from "react";
import { getAudioContext } from "@strudel/webaudio";

// define this outside the component so it only ever runs once, 
// even if React re-renders or unmounts the visualizer.
let isAudioPatched = false;

export default function AudioVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    const customAnalyserRef = useRef<AnalyserNode | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const attemptAudioWireUp = () => {
            // get the global audio context used by Strudel
            const audioCtx = getAudioContext();
            
            // if the context isn't running yet (user hasn't clicked play), wait.
            if (!audioCtx || audioCtx.state !== "running") return false;

            // if analyzer hasn't been created yet, make one
            if (!customAnalyserRef.current) {
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                
                // connect analyser directly to the main speakers
                analyser.connect(audioCtx.destination);
        
                // hijack: intercept strudel's audio
                if (!isAudioPatched) {
                    const originalConnect = AudioNode.prototype.connect;
                    
                    // @ts-ignore - use ...args to accept any number of arguments
                    AudioNode.prototype.connect = function (...args: any[]) {
                        const destination = args[0];
                        
                        // if Strudel tries to plug an audio node into the main speakers...
                        // Note: check if destination matches the destination of our audio context
                        if (destination === audioCtx.destination && this !== analyser) {
                            console.log("Intercepted Strudel audio! Routing to visualizer...");
                            // force it to go through our analyser first
                            return originalConnect.apply(this, [analyser] as any);
                        }
                
                        // otherwise, let it connect normally with all original arguments
                        return originalConnect.apply(this, args as any);
                    };
            
                    isAudioPatched = true;
                    console.log("Audio graph hijacked successfully.");
                }
        
                customAnalyserRef.current = analyser;
            }
            return true;
        };

        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            
            // Try to wire up the audio (will silently fail until user presses Play)
            const isWired = attemptAudioWireUp();
            const analyser = customAnalyserRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // DIAGNOSTIC STATE: Waiting for audio
            if (!isWired || !analyser) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.font = "14px monospace";
                ctx.fillText("AWAITING AUDIO STREAM...", 10, 20);
                return;
            }

            const bufferLength = analyser.frequencyBinCount;
            const data = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(data); 

            // Check if audio is actually flowing
            const maxValue = Math.max(...data);
            if (maxValue === 0) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.font = "14px monospace";
                ctx.fillText("AUDIO CONNECTED - WAITING FOR SOUND", 10, 20);
                return;
            }

            // Draw the Japanese Modern / Minimalist Bars
            const visibleBins = Math.floor(bufferLength * 0.75);
            const barWidth = (canvas.width / visibleBins) - 1; 

            for (let i = 0; i < visibleBins; i++) {
                const normalized = data[i] / 255; 
                const barHeight = Math.pow(normalized, 1.2) * canvas.height;

                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (normalized * 0.7)})`;
                ctx.fillRect(
                    i * (barWidth + 1), 
                    canvas.height - barHeight, 
                    barWidth, 
                    barHeight
                );
            }
        };

        draw();
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div style={{ width: "100%", background: "#000000", padding: "10px" }}>
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={200} 
                style={{ width: "100%", display: "block" }} 
            />
        </div>
    );
}