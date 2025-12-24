import { useEffect, useRef } from "react";

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number;
    let h: number;

    interface Circle {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      color: string;
    }

    let circles: Circle[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = 450; // Hero section height
    };

    const initCircles = () => {
      circles = Array.from({ length: 6 }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 150 + Math.random() * 150,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,

        // ⭐ STRIPE MULTI COLORS ⭐
        color: [
          "rgba(255, 75, 85, 0.35)",   // Pink-red
          "rgba(255, 150, 80, 0.35)",  // Orange
          "rgba(180, 80, 255, 0.35)",  // Purple
          "rgba(80, 140, 255, 0.35)",  // Blue
          "rgba(255, 220, 140, 0.35)", // Soft yellow-glow
        ][Math.floor(Math.random() * 5)],
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      circles.forEach((c) => {
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        grad.addColorStop(0, c.color);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();

        c.x += c.dx;
        c.y += c.dy;

        if (c.x < -200 || c.x > w + 200) c.dx *= -1;
        if (c.y < -200 || c.y > h + 200) c.dy *= -1;
      });

      requestAnimationFrame(animate);
    };

    resize();
    initCircles();
    animate();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
