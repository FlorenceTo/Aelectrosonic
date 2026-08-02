// components/FrequencyWave.jsx
import { useEffect, useRef } from "react";

export default function FrequencyWave({ bandName, primaryColor, theme }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0; // in seconds
    let width, height;

    // --- Map each band to a VISUAL cycle range ---
    // These numbers represent how many full waves appear across the canvas.
    const getCycleRange = () => {
      if (bandName.includes("L-Band")) return { minCycles: 1.5, maxCycles: 3.0 };
      if (bandName.includes("S-Band")) return { minCycles: 3.0, maxCycles: 5.5 };
      if (bandName.includes("C-Band")) return { minCycles: 5.5, maxCycles: 8.5 };
      if (bandName.includes("X-Band")) return { minCycles: 8.5, maxCycles: 12.5 };
      if (bandName.includes("Ku-Band")) return { minCycles: 12.5, maxCycles: 18.0 };
      if (bandName.includes("UHF")) return { minCycles: 0.8, maxCycles: 2.0 };
      // Fallback for any unexpected band names
      return { minCycles: 2.0, maxCycles: 5.0 };
    };

    const { minCycles, maxCycles } = getCycleRange();
    const amplitude = 22; // wave height (kept constant for a clean look)

    // --- Canvas resize handler ---
    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      // Use getBoundingClientRect for precise pixel dimensions
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      width = rect.width;
      height = rect.height;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };

    // --- Main draw loop ---
    const draw = () => {
      if (!ctx || width === 0 || height === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // --- 1. Continuous sweep (0 → 1 → 0 → 1 ...) forever ---
      // Using Math.sin gives a super smooth, organic "ecological" oscillation.
      const sweepProgress = (Math.sin(time * 0.65) + 1) / 2;

      // --- 2. Interpolate the visual cycles based on the sweep ---
      const currentCycles = minCycles + sweepProgress * (maxCycles - minCycles);

      // --- 3. Drift speed scales slightly with frequency for realism ---
      const driftSpeed = 0.25 + currentCycles * 0.04;

      // --- 4. Draw the wave ---
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const progress = x / width; // 0 to 1
        // Angle incorporates: cycles across screen + time-based drift
        const angle = progress * Math.PI * 2 * currentCycles + time * driftSpeed;
        const y = height / 2 + Math.sin(angle) * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Set color: fallback to green if primaryColor is missing
      const isLight = theme === "light";
      ctx.strokeStyle = primaryColor || (isLight ? "#2c6e2c" : "#9afc97");
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Optional: Tiny label showing the sweep position (educational) ---
      ctx.fillStyle = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)";
      ctx.font = "9px monospace";
      const freqLabel = `${(minCycles + sweepProgress * (maxCycles - minCycles)).toFixed(1)}x`;
      ctx.fillText(`λ: ${freqLabel}`, 8, height - 8);

      // --- 5. Increment time for the next frame ---
      time += 0.016; // roughly 60fps
      animationId = requestAnimationFrame(draw);
    };

    // --- Setup and start ---
    window.addEventListener("resize", resize);
    resize(); // initial setup
    
    // Small delay to ensure parent layout is settled (prevents zero-height errors)
    const startTimeout = setTimeout(() => {
      resize();
      draw();
    }, 50);

    // --- Cleanup ---
    return () => {
      clearTimeout(startTimeout);
      window.removeEventListener("resize", resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [bandName, primaryColor, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
    />
  );
}