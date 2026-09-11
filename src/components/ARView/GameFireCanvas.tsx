import React, { useRef, useEffect } from 'react';

export interface GameFireCanvasProps {
  flameHeightScale: number; // 0 to 1 (1 = full raging inferno, 0 = extinguished)
  isExtinguished: boolean;
  isDischarging?: boolean; // P.A.S.S. extinguisher spraying
  sprayType?: 'water' | 'dcp' | 'co2';
  sweepProgress?: number; // 0 to 100
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  type: 'flame' | 'ember' | 'smoke' | 'chemical' | 'water' | 'steam' | 'splash';
  colorRamp: string[];
  rotation: number;
  vRot: number;
}

export const GameFireCanvas: React.FC<GameFireCanvasProps> = ({
  flameHeightScale,
  isExtinguished,
  isDischarging = false,
  sprayType = 'water',
  sweepProgress = 0,
  width = 380,
  height = 420
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    // Pre-calculated base center - right at ground floor level
    const baseX = width * 0.5;
    const baseY = height * 0.78; // Ground anchor level

    let tick = 0;

    // Helper to spawn a realistic flame particle rooted on the ground
    const spawnFlameParticle = (intensity: number) => {
      // Base spread across ground floor area
      const spread = (Math.random() - 0.5) * 110 * (0.4 + intensity * 0.6);
      const life = 28 + Math.random() * 38;
      const initialSize = 14 + Math.random() * 20 * intensity;

      particles.push({
        x: baseX + spread,
        y: baseY + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 2.2 + Math.sin(tick * 0.08) * 1.0, // turbulent draft
        vy: -(4.0 + Math.random() * 5.5 * intensity), // upward buoyant velocity
        size: initialSize,
        maxSize: initialSize * (1.8 + Math.random() * 0.7),
        life: 0,
        maxLife: life,
        type: 'flame',
        colorRamp: ['#ffffff', '#fff75c', '#ff8400', '#ff2200', '#630300'],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1
      });
    };

    // Helper to spawn floating flying ember sparks
    const spawnEmber = () => {
      const spread = (Math.random() - 0.5) * 90;
      particles.push({
        x: baseX + spread,
        y: baseY - 10,
        vx: (Math.random() - 0.5) * 4.0 + Math.sin(tick * 0.05) * 2.0,
        vy: -(5.5 + Math.random() * 6.5),
        size: 1.8 + Math.random() * 2.8,
        maxSize: 3.5,
        life: 0,
        maxLife: 50 + Math.random() * 45,
        type: 'ember',
        colorRamp: ['#ffffff', '#ffd043', '#ff6a00'],
        rotation: 0,
        vRot: 0
      });
    };

    // Helper to spawn dark billowing smoke puffs
    const spawnSmoke = (intensity: number) => {
      const spread = (Math.random() - 0.5) * 70;
      const life = 70 + Math.random() * 60;
      const initialSize = 18 + Math.random() * 24;

      particles.push({
        x: baseX + spread,
        y: baseY - 40 * intensity,
        vx: (Math.random() - 0.5) * 1.4 + Math.sin(tick * 0.03) * 1.2,
        vy: -(1.8 + Math.random() * 2.4),
        size: initialSize,
        maxSize: initialSize * 3.8,
        life: 0,
        maxLife: life,
        type: 'smoke',
        colorRamp: ['#1e293b', '#0f172a'],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04
      });
    };

    // Helper to spawn water jet stream from nozzle to the ground fire
    const spawnWaterSpray = () => {
      // Extinguisher / hose nozzle held at bottom right
      const nozzleX = width * 0.94;
      const nozzleY = height * 0.88;
      // Target is base of the flames with realistic sweeping variance
      const sweepOffset = Math.sin(tick * 0.12) * 45;
      const targetX = baseX + sweepOffset + (Math.random() - 0.5) * 35;
      const targetY = baseY + (Math.random() - 0.5) * 18;

      const angle = Math.atan2(targetY - nozzleY, targetX - nozzleX);
      const speed = 14 + Math.random() * 7;

      // Water droplet particles
      particles.push({
        x: nozzleX,
        y: nozzleY,
        vx: Math.cos(angle + (Math.random() - 0.5) * 0.18) * speed,
        vy: Math.sin(angle + (Math.random() - 0.5) * 0.18) * speed,
        size: 3 + Math.random() * 4,
        maxSize: 6 + Math.random() * 6,
        life: 0,
        maxLife: 26,
        type: 'water',
        colorRamp: ['#e0f2fe', '#38bdf8', '#0284c7'],
        rotation: 0,
        vRot: 0
      });

      // Massive collision steam cloud erupting at impact base
      if (Math.random() > 0.3) {
        particles.push({
          x: targetX + (Math.random() - 0.5) * 20,
          y: targetY - 10,
          vx: (Math.random() - 0.5) * 2.4,
          vy: -(3.0 + Math.random() * 4.5),
          size: 16,
          maxSize: 60 + Math.random() * 30,
          life: 0,
          maxLife: 45 + Math.random() * 20,
          type: 'steam',
          colorRamp: ['#ffffff', '#f8fafc', '#e2e8f0'],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.06
        });
      }

      // Ground water splash droplets bouncing off floor
      if (Math.random() > 0.4) {
        particles.push({
          x: targetX,
          y: targetY,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -(2.5 + Math.random() * 3.5),
          size: 2,
          maxSize: 4,
          life: 0,
          maxLife: 18,
          type: 'splash',
          colorRamp: ['#bae6fd', '#38bdf8'],
          rotation: 0,
          vRot: 0
        });
      }
    };

    // Helper to spawn chemical foam/powder stream (if DCP / CO2 chosen)
    const spawnChemicalCloud = () => {
      const nozzleX = width * 0.94;
      const nozzleY = height * 0.86;
      const sweepOffset = Math.sin(tick * 0.1) * 40;
      const targetX = baseX + sweepOffset + (Math.random() - 0.5) * 50;
      const targetY = baseY + (Math.random() - 0.5) * 20;

      const angle = Math.atan2(targetY - nozzleY, targetX - nozzleX);
      const speed = 12 + Math.random() * 6;

      particles.push({
        x: nozzleX,
        y: nozzleY,
        vx: Math.cos(angle + (Math.random() - 0.5) * 0.25) * speed,
        vy: Math.sin(angle + (Math.random() - 0.5) * 0.25) * speed,
        size: 8 + Math.random() * 10,
        maxSize: 36 + Math.random() * 20,
        life: 0,
        maxLife: 30,
        type: 'chemical',
        colorRamp: ['#ffffff', '#e0f2fe', '#bae6fd'],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2
      });

      // Steam puff on base contact
      if (Math.random() > 0.4) {
        particles.push({
          x: targetX,
          y: targetY,
          vx: (Math.random() - 0.5) * 2,
          vy: -(2.5 + Math.random() * 3.5),
          size: 16,
          maxSize: 50,
          life: 0,
          maxLife: 42,
          type: 'steam',
          colorRamp: ['#f8fafc', '#e2e8f0'],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05
        });
      }
    };

    // Main Game Render Loop
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const effectiveIntensity = isExtinguished ? 0 : flameHeightScale;

      // 1. Spawning Particles based on current fire status
      if (effectiveIntensity > 0.04) {
        const count = Math.ceil(7 * effectiveIntensity);
        for (let i = 0; i < count; i++) {
          spawnFlameParticle(effectiveIntensity);
        }

        // Embers
        if (Math.random() < 0.85 * effectiveIntensity) {
          spawnEmber();
        }

        // Smoke plumes
        if (Math.random() < 0.45) {
          spawnSmoke(effectiveIntensity);
        }
      }

      // If spraying extinguisher
      if (isDischarging) {
        if (sprayType === 'water') {
          for (let i = 0; i < 6; i++) {
            spawnWaterSpray();
          }
        } else {
          for (let i = 0; i < 5; i++) {
            spawnChemicalCloud();
          }
        }
      }

      // Residual cooling wisps if extinguished
      if (isExtinguished && tick % 12 === 0 && particles.length < 20) {
        particles.push({
          x: baseX + (Math.random() - 0.5) * 60,
          y: baseY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1.4,
          size: 10,
          maxSize: 28,
          life: 0,
          maxLife: 60,
          type: 'steam',
          colorRamp: ['#cbd5e1', '#94a3b8'],
          rotation: 0,
          vRot: 0.02
        });
      }

      // 2. Render 3D Floor Ground Scorched Mark & Glowing Coal Embers
      ctx.save();
      // Ground perspective ellipse
      ctx.beginPath();
      ctx.ellipse(baseX, baseY + 12, 110, 34, 0, 0, Math.PI * 2);
      const groundGrad = ctx.createRadialGradient(baseX, baseY + 12, 10, baseX, baseY + 12, 110);
      groundGrad.addColorStop(0, isExtinguished ? 'rgba(20, 20, 20, 0.85)' : 'rgba(50, 15, 0, 0.9)');
      groundGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.7)');
      groundGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = groundGrad;
      ctx.fill();

      // Glowing coal bed on ground if fire is burning
      if (effectiveIntensity > 0.05) {
        ctx.beginPath();
        ctx.ellipse(baseX, baseY + 8, 70 * effectiveIntensity, 18 * effectiveIntensity, 0, 0, Math.PI * 2);
        const coalGlow = ctx.createRadialGradient(baseX, baseY + 8, 5, baseX, baseY + 8, 70 * effectiveIntensity);
        coalGlow.addColorStop(0, `rgba(255, 120, 0, ${0.9 * effectiveIntensity})`);
        coalGlow.addColorStop(0.6, `rgba(220, 38, 38, ${0.6 * effectiveIntensity})`);
        coalGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coalGlow;
        ctx.fill();
      }
      ctx.restore();

      // 3. Render Ground & Ambient Thermal Heat Shimmer Glow
      if (effectiveIntensity > 0.05) {
        const glowRadius = (95 + Math.sin(tick * 0.15) * 18) * effectiveIntensity;
        const radGrad = ctx.createRadialGradient(baseX, baseY, 15, baseX, baseY, glowRadius);
        radGrad.addColorStop(0, `rgba(255, 140, 0, ${0.48 * effectiveIntensity})`);
        radGrad.addColorStop(0.5, `rgba(239, 68, 68, ${0.28 * effectiveIntensity})`);
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(baseX, baseY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Render Smoke & Steam (Background layer with normal alpha blending)
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type === 'smoke' || p.type === 'steam') {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          const progress = p.life / p.maxLife;
          const currentSize = p.size + (p.maxSize - p.size) * progress;
          const alpha = Math.max(0, (1 - progress) * (p.type === 'steam' ? 0.65 : 0.32));

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = p.type === 'steam' 
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(15, 23, 42, ${alpha})`;
          ctx.fill();
          ctx.restore();

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
          }
        }
      }
      ctx.restore();

      // 5. Render Extinguisher Chemical Cloud or Water Stream
      if (isDischarging || particles.some(p => p.type === 'chemical' || p.type === 'water' || p.type === 'splash')) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          if (p.type === 'chemical') {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            const progress = p.life / p.maxLife;
            const currentSize = p.size + (p.maxSize - p.size) * progress;
            const alpha = Math.max(0, (1 - progress) * 0.8);

            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 249, 255, ${alpha})`;
            ctx.fill();

            if (p.life >= p.maxLife) {
              particles.splice(i, 1);
            }
          } else if (p.type === 'water') {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // Gravity on water arc
            const progress = p.life / p.maxLife;
            const currentSize = p.size + (p.maxSize - p.size) * progress;
            const alpha = Math.max(0, (1 - progress) * 0.9);

            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.shadowColor = '#0284c7';
            ctx.shadowBlur = 4;
            ctx.fill();

            if (p.life >= p.maxLife) {
              particles.splice(i, 1);
            }
          } else if (p.type === 'splash') {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; // Gravity
            const progress = p.life / p.maxLife;
            const alpha = Math.max(0, (1 - progress) * 0.85);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
            ctx.fill();

            if (p.life >= p.maxLife) {
              particles.splice(i, 1);
            }
          }
        }
        ctx.restore();
      }

      // 6. Render Flame Particles & Embers (Game Additive Glow Blend Layer)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter'; // Blinding game fire effect

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type === 'flame') {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.06;
          p.vx += (Math.random() - 0.5) * 0.4;
          p.rotation += p.vRot;

          const progress = p.life / p.maxLife;
          const scaleProg = Math.sin(progress * Math.PI);
          const currentSize = p.size + (p.maxSize - p.size) * scaleProg;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
          if (progress < 0.25) {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
            grad.addColorStop(0.35, 'rgba(255, 234, 50, 0.9)');
            grad.addColorStop(0.7, 'rgba(255, 120, 0, 0.5)');
            grad.addColorStop(1, 'rgba(255, 40, 0, 0)');
          } else if (progress < 0.6) {
            grad.addColorStop(0, 'rgba(255, 220, 40, 0.95)');
            grad.addColorStop(0.4, 'rgba(255, 110, 0, 0.75)');
            grad.addColorStop(0.8, 'rgba(220, 30, 0, 0.35)');
            grad.addColorStop(1, 'rgba(100, 0, 0, 0)');
          } else {
            grad.addColorStop(0, 'rgba(230, 60, 0, 0.7)');
            grad.addColorStop(0.5, 'rgba(160, 20, 0, 0.3)');
            grad.addColorStop(1, 'rgba(40, 0, 0, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
          }
        } else if (p.type === 'ember') {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx += (Math.random() - 0.5) * 0.5;

          const progress = p.life / p.maxLife;
          const alpha = Math.max(0, 1 - progress);

          ctx.fillStyle = progress < 0.3 ? '#ffffff' : progress < 0.7 ? '#ffd043' : '#ff5500';
          ctx.shadowColor = '#ffaa00';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
          }
        }
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [flameHeightScale, isExtinguished, isDischarging, sprayType, sweepProgress, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none drop-shadow-2xl"
    />
  );
};
