import React, { useRef, useEffect } from 'react';

export interface GameHeightCanvasProps {
  hooksConnected: number; // 0, 1, 2
  anchorTested: boolean;
  traumaStrapDeployed: boolean;
  width?: number;
  height?: number;
}

interface WindParticle {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export const GameHeightCanvas: React.FC<GameHeightCanvasProps> = ({
  hooksConnected,
  anchorTested,
  traumaStrapDeployed,
  width = 380,
  height = 380
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const windParticles: WindParticle[] = [];

    for (let i = 0; i < 20; i++) {
      windParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 3 + Math.random() * 5,
        length: 20 + Math.random() * 40,
        opacity: 0.15 + Math.random() * 0.25
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Wind streaks across high altitude
      ctx.save();
      windParticles.forEach(p => {
        p.x += p.speed;
        if (p.x > width + 50) {
          p.x = -50;
          p.y = Math.random() * height;
        }
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y);
        ctx.strokeStyle = `rgba(226, 232, 240, ${p.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.restore();

      // 2. High Altitude Scaffold Framework (Tubular Steel Poles & Walkway)
      ctx.save();
      const floorY = height * 0.72;
      const leftX = 40;
      const rightX = width - 40;

      // Vertical ledger uprights
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(leftX, 30);
      ctx.lineTo(leftX, height);
      ctx.moveTo(rightX, 30);
      ctx.lineTo(rightX, height);
      ctx.stroke();

      // Cross-bracing (X-brace)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leftX, 60);
      ctx.lineTo(rightX, floorY);
      ctx.moveTo(rightX, 60);
      ctx.lineTo(leftX, floorY);
      ctx.stroke();

      // Top handrail & midrail
      ctx.strokeStyle = '#eab308'; // High-visibility yellow safety rail
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(leftX, floorY - 50); // Handrail (1m)
      ctx.lineTo(rightX, floorY - 50);
      ctx.stroke();

      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leftX, floorY - 26); // Midrail (0.5m)
      ctx.lineTo(rightX, floorY - 26);
      ctx.stroke();

      // Scaffold wooden/steel plank deck (walkway)
      ctx.fillStyle = '#334155';
      ctx.fillRect(leftX - 10, floorY, (rightX - leftX) + 20, 14);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(leftX - 10, floorY, (rightX - leftX) + 20, 14);

      // Toe-board (kickboard prevents tools falling down)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(leftX - 8, floorY - 12, (rightX - leftX) + 16, 12);
      ctx.restore();

      // 3. Overhead Horizontal Lifeline Cable & Anchor Point (Top)
      ctx.save();
      const lifelineY = 55;
      const anchorCenterX = width * 0.5;

      // Heavy anchor D-ring bracket
      ctx.beginPath();
      ctx.arc(anchorCenterX, lifelineY - 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = anchorTested ? '#10b981' : '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Anchor tension test waves if tested
      if (anchorTested) {
        const pulseR = 14 + (tick % 25);
        ctx.beginPath();
        ctx.arc(anchorCenterX, lifelineY - 15, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${1 - (tick % 25) / 25})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Horizontal steel cable running across
      ctx.beginPath();
      ctx.moveTo(leftX, lifelineY);
      ctx.lineTo(rightX, lifelineY);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // 4. Dual-Lanyard Shock Absorbing Fall Arrest System
      ctx.save();
      const workerBodyX = width * 0.5;
      const workerDringY = floorY - 65;

      // Shock-absorber pouch (Dorsal D-ring on worker's back)
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(workerBodyX - 7, workerDringY, 14, 22);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(workerBodyX - 7, workerDringY, 14, 22);

      // Lanyard 1 (Yellow webbing)
      const hook1Connected = hooksConnected >= 1;
      const hook1X = workerBodyX - 35;
      const hook1Y = hook1Connected ? lifelineY : workerDringY + 30;

      ctx.beginPath();
      ctx.moveTo(workerBodyX, workerDringY);
      ctx.quadraticCurveTo(workerBodyX - 25, (workerDringY + hook1Y) * 0.5 + (hook1Connected ? -8 : 15), hook1X, hook1Y);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hook 1 (Scaffold snap karabiner)
      ctx.save();
      ctx.translate(hook1X, hook1Y);
      ctx.fillStyle = hook1Connected ? '#10b981' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (hook1Connected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('100%', -8, -10);
      }
      ctx.restore();

      // Lanyard 2 (Yellow webbing)
      const hook2Connected = hooksConnected >= 2;
      const hook2X = workerBodyX + 35;
      const hook2Y = hook2Connected ? lifelineY : workerDringY + 30;

      ctx.beginPath();
      ctx.moveTo(workerBodyX, workerDringY);
      ctx.quadraticCurveTo(workerBodyX + 25, (workerDringY + hook2Y) * 0.5 + (hook2Connected ? -8 : 15), hook2X, hook2Y);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hook 2
      ctx.save();
      ctx.translate(hook2X, hook2Y);
      ctx.fillStyle = hook2Connected ? '#10b981' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (hook2Connected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('PASS', -8, -10);
      }
      ctx.restore();

      // 5. Trauma Relief Suspension Strap (Drop loop below worker)
      if (traumaStrapDeployed) {
        const strapDropY = workerDringY + 50;
        ctx.beginPath();
        ctx.moveTo(workerBodyX - 8, workerDringY + 22);
        ctx.lineTo(workerBodyX - 12, strapDropY);
        // Foot loop
        ctx.arc(workerBodyX, strapDropY, 12, Math.PI, 0, true);
        ctx.lineTo(workerBodyX + 8, workerDringY + 22);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FOOT RELIEF LOOP', workerBodyX, strapDropY + 18);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hooksConnected, anchorTested, traumaStrapDeployed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none drop-shadow-2xl"
    />
  );
};
