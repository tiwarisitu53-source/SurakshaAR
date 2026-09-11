import React, { useRef, useEffect } from 'react';

export interface GameMachineryCanvasProps {
  beltSpeed: number; // 0 to 100
  eStopPulled: boolean;
  lotoApplied: boolean;
  width?: number;
  height?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const GameMachineryCanvas: React.FC<GameMachineryCanvasProps> = ({
  beltSpeed,
  eStopPulled,
  lotoApplied,
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
    let gearAngle = 0;
    let beltOffset = 0;
    const sparks: Spark[] = [];

    // Machinery layout anchors
    const beltX = 30;
    const beltY = height * 0.52;
    const beltWidth = width - 60;
    const beltHeight = 36;
    const gear1X = beltX + 45;
    const gear1Y = beltY + beltHeight * 0.5;
    const gear1Radius = 38;

    const gear2X = gear1X + 68;
    const gear2Y = gear1Y;
    const gear2Radius = 28;

    let tick = 0;

    // Helper to draw a gear with teeth
    const drawGear = (cx: number, cy: number, radius: number, angle: number, teeth: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const toothAngle = (i / teeth) * Math.PI * 2;
        const nextToothAngle = ((i + 0.5) / teeth) * Math.PI * 2;
        const nextBaseAngle = ((i + 1) / teeth) * Math.PI * 2;

        const innerR = radius - 7;
        const outerR = radius + 6;

        const x1 = Math.cos(toothAngle) * innerR;
        const y1 = Math.sin(toothAngle) * innerR;
        const x2 = Math.cos(toothAngle + 0.05) * outerR;
        const y2 = Math.sin(toothAngle + 0.05) * outerR;
        const x3 = Math.cos(nextToothAngle - 0.05) * outerR;
        const y3 = Math.sin(nextToothAngle - 0.05) * outerR;
        const x4 = Math.cos(nextToothAngle) * innerR;
        const y4 = Math.sin(nextToothAngle) * innerR;

        if (i === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Inner hub & keyway
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // Center axle shaft
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Bolt holes
      for (let b = 0; b < 4; b++) {
        const boltAngle = (b / 4) * Math.PI * 2;
        const bx = Math.cos(boltAngle) * (radius * 0.32);
        const by = Math.sin(boltAngle) * (radius * 0.32);
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#020617';
        ctx.fill();
      }

      ctx.restore();
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const currentSpeedFactor = beltSpeed / 100;
      gearAngle += 0.06 * currentSpeedFactor;
      beltOffset += 3.5 * currentSpeedFactor;

      // 1. Heavy Industrial Steel Machine Frame & Housing
      ctx.save();
      // Machine base plate
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(beltX - 10, beltY + beltHeight + 10, beltWidth + 20, 24);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(beltX - 10, beltY + beltHeight + 10, beltWidth + 20, 24);

      // Yellow/Black diagonal safety hazard striping on base
      ctx.save();
      ctx.beginPath();
      ctx.rect(beltX - 10, beltY + beltHeight + 10, beltWidth + 20, 10);
      ctx.clip();
      ctx.fillStyle = '#eab308';
      ctx.fillRect(beltX - 10, beltY + beltHeight + 10, beltWidth + 20, 10);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 7;
      for (let sx = -50; sx < width + 50; sx += 20) {
        ctx.beginPath();
        ctx.moveTo(sx, beltY + beltHeight + 25);
        ctx.lineTo(sx + 20, beltY + beltHeight + 5);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Conveyor Belt Track
      ctx.beginPath();
      ctx.roundRect(beltX, beltY, beltWidth, beltHeight, 18);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Conveyor rubber cleat ribs moving across
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(beltX, beltY, beltWidth, beltHeight, 18);
      ctx.clip();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      const ribSpacing = 28;
      const normalizedOffset = beltOffset % ribSpacing;
      for (let rx = beltX - ribSpacing + normalizedOffset; rx < beltX + beltWidth + ribSpacing; rx += ribSpacing) {
        ctx.beginPath();
        ctx.moveTo(rx, beltY + 2);
        ctx.lineTo(rx, beltY + beltHeight - 2);
        ctx.stroke();
      }

      // Raw coal / ore rocks tumbling on moving belt
      const rocks = [0.15, 0.35, 0.58, 0.78];
      rocks.forEach((posRatio, idx) => {
        const rockX = beltX + ((posRatio * beltWidth + beltOffset) % beltWidth);
        const rockY = beltY + 10 + (idx % 2) * 8;
        ctx.beginPath();
        ctx.arc(rockX, rockY, 5 + (idx % 3) * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b';
        ctx.fill();
      });
      ctx.restore();

      // 3. Rotating Drive Gears
      // Main drive gear (spinning clockwise)
      drawGear(gear1X, gear1Y, gear1Radius, gearAngle, 12, '#64748b');
      // Interlocking pinion gear (spinning counter-clockwise)
      drawGear(gear2X, gear2Y, gear2Radius, -gearAngle * (gear1Radius / gear2Radius), 9, '#94a3b8');

      // 4. In-Running Nip Point Pinch Zone Highlight
      const nipX = gear1X + (gear2X - gear1X) * 0.5;
      const nipY = gear1Y;
      ctx.save();
      ctx.beginPath();
      ctx.arc(nipX, nipY, 16, 0, Math.PI * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -tick * 0.5;
      ctx.stroke();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();

      // Danger icon at nip point
      if (beltSpeed > 0) {
        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CRUSH', nipX, nipY - 20);
      }
      ctx.restore();

      // 5. Emergency Pull Cord & Switch Box
      const cordY = beltY - 22;
      ctx.save();
      // Right trip switch box
      const switchX = beltX + beltWidth - 15;
      ctx.fillStyle = eStopPulled ? '#dc2626' : '#991b1b';
      ctx.fillRect(switchX, cordY - 14, 24, 28);
      ctx.strokeStyle = '#fca5a5';
      ctx.strokeRect(switchX, cordY - 14, 24, 28);

      // Red pull cord wire along conveyor
      ctx.beginPath();
      ctx.moveTo(beltX, cordY);
      if (eStopPulled) {
        // Slacked / pulled kinked cord
        ctx.lineTo(switchX - 35, cordY + 12);
        ctx.lineTo(switchX, cordY + 4);
      } else {
        // Taut straight cord with slight vibration
        const vibr = beltSpeed > 0 ? Math.sin(tick * 0.4) * 1.5 : 0;
        ctx.lineTo(switchX, cordY + vibr);
      }
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pull handle in middle
      const handleX = beltX + beltWidth * 0.5;
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(handleX, eStopPulled ? cordY + 8 : cordY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 6. LOTO Padlock & Tag if isolated
      if (lotoApplied) {
        ctx.save();
        const lotoX = switchX + 8;
        const lotoY = cordY + 28;

        // Padlock body (Red safety lock)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(lotoX - 8, lotoY, 16, 18);
        ctx.strokeStyle = '#fef2f2';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(lotoX - 8, lotoY, 16, 18);

        // Padlock shackle (Steel curved loop)
        ctx.beginPath();
        ctx.arc(lotoX, lotoY, 7, Math.PI, 0);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        // Lockout Danger Tag (Flapping in breeze)
        ctx.save();
        ctx.translate(lotoX + 10, lotoY + 8);
        ctx.rotate(Math.sin(tick * 0.08) * 0.15);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 20, 28);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, 20, 28);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, 20, 7);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DANGER', 10, 5);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 5px sans-serif';
        ctx.fillText('DO NOT', 10, 15);
        ctx.fillText('OPERATE', 10, 22);
        ctx.restore();

        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [beltSpeed, eStopPulled, lotoApplied, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none drop-shadow-2xl"
    />
  );
};
