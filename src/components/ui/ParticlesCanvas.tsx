import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  type: 'heart' | 'sparkle' | 'petal';
  angle: number;
  spin: number;
}

export const ParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particlesCount = Math.min(35, Math.floor(width / 35));
    const particles: Particle[] = [];

    const types: ('heart' | 'sparkle' | 'petal')[] = ['heart', 'sparkle', 'petal', 'sparkle'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        type: types[Math.floor(Math.random() * types.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.01
      });
    }

    function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
      c.save();
      c.beginPath();
      c.fillStyle = `rgba(244, 63, 94, ${opacity})`;
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      // top left curve
      c.bezierCurveTo(
        x, y,
        x - size / 2, y,
        x - size / 2, y + topCurveHeight
      );
      // bottom left curve
      c.bezierCurveTo(
        x - size / 2, y + (size + topCurveHeight) / 2,
        x, y + size,
        x, y + size
      );
      // bottom right curve
      c.bezierCurveTo(
        x, y + size,
        x + size / 2, y + (size + topCurveHeight) / 2,
        x + size / 2, y + topCurveHeight
      );
      // top right curve
      c.bezierCurveTo(
        x + size / 2, y,
        x, y,
        x, y + topCurveHeight
      );
      c.fill();
      c.restore();
    }

    function drawSparkle(c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
      c.save();
      c.fillStyle = `rgba(255, 235, 175, ${opacity * 1.2})`;
      c.shadowBlur = 8;
      c.shadowColor = 'rgba(255, 215, 0, 0.6)';
      c.beginPath();
      c.arc(x, y, size * 0.25, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function drawPetal(c: CanvasRenderingContext2D, p: Particle) {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.angle);
      c.fillStyle = `rgba(225, 29, 72, ${p.opacity * 0.7})`;
      c.beginPath();
      c.ellipse(0, 0, p.size * 0.3, p.size * 0.7, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.opacity);
        } else {
          drawPetal(ctx, p);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};
