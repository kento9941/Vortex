import { useEffect, useRef } from "react";
import { getAudioContext } from "@strudel/webaudio";

let isAudioPatched = false;

export default function AudioVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>(0);
    const customAnalyserRef = useRef<AnalyserNode | null>(null);

    const visibleBins = 115;
    const barWidth = 2;
    const gap = 2;
    const baseHeight = 4;
    const maxScale = 20;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Allocate memory once
        const dataArray = new Uint8Array(128);

        // 2. Handle crisp rendering on High-DPI / Retina screens
        let dpr = window.devicePixelRatio || 1;
        let cssWidth = 0;
        let cssHeight = 0;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                cssWidth = entry.contentRect.width;
                cssHeight = entry.contentRect.height;
                // Scale the physical canvas memory to match the screen's pixel density
                canvas.width = cssWidth * dpr;
                canvas.height = cssHeight * dpr;
                // Scale the drawing context so we can still use standard CSS pixel math
                ctx.scale(dpr, dpr);
            }
        });
        resizeObserver.observe(canvas);

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

        const draw = () => {
            rafRef.current = requestAnimationFrame(draw);
            
            if (!customAnalyserRef.current) {
                attemptAudioWireUp();
            }
            
            const analyser = customAnalyserRef.current;

            if (analyser) {
                analyser.getByteFrequencyData(dataArray); 
            } else {
                dataArray.fill(0);
            }

            // Wipe the previous frame
            ctx.clearRect(0, 0, cssWidth, cssHeight);

            // Calculate total width of all bars to center them horizontally
            const totalWidth = (visibleBins * barWidth) + ((visibleBins - 1) * gap);
            const startX = (cssWidth - totalWidth) / 2;
            const centerY = cssHeight / 2;

            for (let i = 0; i < visibleBins; i++) {
                const normalized = dataArray[i] / 255; 
                
                const scale = Math.max(1, Math.pow(normalized, 1.2) * maxScale);
                const height = baseHeight * scale;
                const opacity = 0.3 + (normalized * 0.7);

                const x = startX + i * (barWidth + gap);
                const y = centerY - (height / 2);

                ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(2)})`;
                ctx.beginPath();
                
                // roundRect creates perfect pill shapes (x, y, width, height, borderRadius)
                ctx.roundRect(x, y, barWidth, height, barWidth / 2); 
                ctx.fill();
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            // Give it the exact same dimensions as the old wrapper div
            className="w-full h-[10rem]" 
        />
    );
}