import React, { useRef, useEffect } from 'react';

export interface GameArcCanvasProps {
  isArcActive: boolean;
  voltageTested?: boolean;
  rescueHookDeployed?: boolean;
  width?: number;
  height?: number;
}

interface ArcSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const GameArcCanvas: React.FC<GameArcCanvasProps> = ({
  isArcActive = true,
  voltageTested = false,
  rescueHookDeployed = false,
  width = 380,
  height = 360
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const sparks: ArcSpark[] = [];

    // Switchgear busbar positions
    const busbarY = height * 0.42;
    const busbar1X = width * 0.35;
    const busbar2X = width * 0.65;

    let tick = 0;

    // Helper to draw realistic branching lightning bolt between two points
    const drawLightningBolt = (x1: number, y1: number, x2: number, y2: number, segments: number, roughness: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);

      let currX = x1;
      let currY = y1;
      const dx = (x2 - x1) / segments;
      const dy = (y2 - y1) / segments;

      for (let i = 1; i < segments; i++) {
        const targetX = x1 + dx * i;
        const targetY = y1 + dy * i;
        const perpX = -dy;
        const perpY = dx;
        const norm = Math.hypot(perpX, perpY) || 1;
        const offset = (Math.random() - 0.5) * roughness;

        currX = targetX + (perpX / norm) * offset;
        currY = targetY + (perpY / norm) * offset;
        ctx.lineTo(currX, currY);

        // Branch off occasionally
        if (Math.random() < 0.28) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(currX, currY);
          ctx.lineTo(currX + (Math.random() - 0.5) * 30, currY + (Math.random() - 0.5) * 30);
          ctx.strokeStyle = '#a5f3fc';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.lineTo(x2, y2);
    };

    // Helper to spawn molten plasma sparks
    const spawnSpark = () => {
      const midX = (busbar1X + busbar2X) * 0.5 + (Math.random() - 0.5) * 20;
      sparks.push({
        x: midX,
        y: busbarY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 4 + 2, // Shower downwards
        size: 1.5 + Math.random() * 2.5,
        life: 0,
        maxLife: 25 + Math.random() * 20,
        color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#38bdf8' : '#f59e0b')
      });
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. High Voltage Switchgear Enclosure (Dark Steel Cabinet)
      ctx.save();
      const cabinetX = 35;
      const cabinetY = 40;
      const cabinetWidth = width - 70;
      const cabinetHeight = height - 70;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cabinetX, cabinetY, cabinetWidth, cabinetHeight);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(cabinetX, cabinetY, cabinetWidth, cabinetHeight);

      // Hazard High-Voltage Warning Decal on door
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(width * 0.5, cabinetY + 12);
      ctx.lineTo(width * 0.5 - 22, cabinetY + 45);
      ctx.lineTo(width * 0.5 + 22, cabinetY + 45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.font = 'black 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', width * 0.5, cabinetY + 40);

      // 3-Phase Copper Busbar Terminals (Phase A, Phase B, Phase C)
      const busbars = [
        { x: width * 0.35, label: 'L1 (R)' },
        { x: width * 0.5, label: 'L2 (Y)' },
        { x: width * 0.65, label: 'L3 (B)' }
      ];

      busbars.forEach(b => {
        // Red copper vertical bar
        ctx.fillStyle = '#b45309';
        ctx.fillRect(b.x - 7, busbarY - 30, 14, 60);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x - 7, busbarY - 30, 14, 60);

        // Porcelain insulator pedestal
        ctx.fillStyle = '#475569';
        ctx.fillRect(b.x - 11, busbarY + 30, 22, 16);
      });
      ctx.restore();

      // 2. Violent Electric Arc Flash & Plasma Lightning (if active)
      if (isArcActive) {
        // Spawn molten copper sparks
        if (Math.random() < 0.9) {
          for (let s = 0; s < 3; s++) spawnSpark();
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter'; // Electric glow

        // Core thick lightning plasma bolt between busbars
        const startX = width * 0.35;
        const endX = width * 0.65;
        const arcY = busbarY + (Math.random() - 0.5) * 15;

        // Outer violet/cyan atmospheric corona glow
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        drawLightningBolt(startX, arcY, endX, arcY, 7, 28);
        ctx.stroke();

        // Mid cyan arc
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#38bdf8';
        drawLightningBolt(startX, arcY, endX, arcY, 8, 22);
        ctx.stroke();

        // Intense blinding white inner core
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        drawLightningBolt(startX, arcY, endX, arcY, 8, 20);
        ctx.stroke();

        // Ambient flash strobe in cabinet
        const strobeGrad = ctx.createRadialGradient((startX + endX) * 0.5, arcY, 5, (startX + endX) * 0.5, arcY, 110);
        strobeGrad.addColorStop(0, 'rgba(186, 230, 253, 0.5)');
        strobeGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        strobeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = strobeGrad;
        ctx.beginPath();
        ctx.arc((startX + endX) * 0.5, arcY, 110, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Render Sparks Showering & Bouncing
      ctx.save();
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.35; // Gravity pull

        // Bounce on floor
        if (s.y > height - 40) {
          s.y = height - 40;
          s.vy = -s.vy * 0.4;
          s.vx *= 0.7;
        }

        const progress = s.life / s.maxLife;
        const alpha = Math.max(0, 1 - progress);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.fill();

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }
      ctx.restore();

      // 4. Non-Contact Voltage Detector Testing Wand (if step active)
      if (voltageTested) {
        ctx.save();
        const wandX = width * 0.5;
        const wandY = busbarY - 10;

        // Insulated yellow body
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(wandX - 4, wandY - 45, 8, 45);
        // Red sensing tip
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(wandX - 5, wandY - 3, 10, 6);

        // Green/Red illuminated test rings
        ctx.beginPath();
        ctx.arc(wandX, wandY - 20, 10, 0, Math.PI * 2);
        ctx.strokeStyle = isArcActive ? '#ef4444' : '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isArcActive ? '33kV LIVE' : '0V DEAD', wandX, wandY - 55);
        ctx.restore();
      }

      // 5. Insulated Rescue Hook (Fiberglass body hook extending in from left)
      if (rescueHookDeployed) {
        ctx.save();
        const hookTipX = width * 0.55;
        const hookTipY = height * 0.68;

        // Long yellow dielectric fiberglass pole
        ctx.beginPath();
        ctx.moveTo(10, height * 0.85);
        ctx.lineTo(hookTipX - 15, hookTipY);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Curved shepherd's crook body hook
        ctx.beginPath();
        ctx.arc(hookTipX, hookTipY - 14, 18, Math.PI * 0.4, Math.PI * 1.8, false);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RESCUE HOOK', hookTipX, hookTipY + 25);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isArcActive, voltageTested, rescueHookDeployed, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none drop-shadow-2xl"
    />
  );
};
