import { useEffect, useRef, useCallback } from "react";

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "square" | "circle" | "triangle";
}

const DEFAULT_COLORS = [
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#f97316", // orange
];

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 100,
  colors = DEFAULT_COLORS,
  onComplete,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const shapes: ("square" | "circle" | "triangle")[] = ["square", "circle", "triangle"];
    return {
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -15 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  }, [colors]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;

    switch (particle.shape) {
      case "square":
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(0, -particle.size / 2);
        ctx.lineTo(particle.size / 2, particle.size / 2);
        ctx.lineTo(-particle.size / 2, particle.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Apply gravity
      particle.vy += 0.3;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      // Fade out towards the end
      if (progress > 0.7) {
        particle.opacity = 1 - (progress - 0.7) / 0.3;
      }

      // Draw if visible
      if (particle.opacity > 0 && particle.y < canvas.height + 50) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });

    if (progress < 1 && particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }, [duration, drawParticle, onComplete]);

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(canvas)
    );

    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, particleCount, createParticle, animate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

// Simple burst effect for smaller celebrations
export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  return <Confetti isActive={trigger} duration={2000} particleCount={50} />;
}

export default Confetti;
