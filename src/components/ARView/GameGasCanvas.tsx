import React, { useRef, useEffect, useCallback } from 'react';

export interface GameGasCanvasProps {
  stepIndex: number;
  isVentilated: boolean;
  probeDepth: number; // 0.1 (surface), 0.35 (top CH4), 0.65 (mid O2), 0.95 (bottom H2S)
  isTesting?: boolean;
  isBlowerRunning?: boolean;
  currentStratum?: 'surface' | 'top' | 'mid' | 'bottom';
  testedLevels?: { top: boolean; mid: boolean; bottom: boolean };
  onProbeClick?: () => void;
  onBlowerClick?: () => void;
  width?: number;
  height?: number;
}

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  colorType: 'h2s' | 'ch4' | 'co_deficient' | 'fresh_air' | 'exhaust';
}

export const GameGasCanvas: React.FC<GameGasCanvasProps> = ({
  stepIndex,
  isVentilated = false,
  probeDepth = 0.2,
  isTesting = false,
  isBlowerRunning = false,
  currentStratum = 'surface',
  testedLevels = { top: false, mid: false, bottom: false },
  onProbeClick,
  onBlowerClick,
  width = 390,
  height = 360
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentDepthRef = useRef<number>(probeDepth);
  const fanAngleRef = useRef<number>(0);
  const pulseScanRef = useRef<number>(0);

  // Keep ref up to date for smooth interpolation in animation loop
  useEffect(() => {
    currentDepthRef.current = probeDepth;
  }, [probeDepth]);

  // Click & hover detection on 3D elements inside canvas
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const shaftX = width * 0.5;
      const shaftY = height * 0.64;
      const blowerX = shaftX - 110;
      const blowerY = shaftY - 20;

      // Check hit on Blower (around blowerX, blowerY)
      const distToBlower = Math.hypot(clickX - (blowerX + 25), clickY - (blowerY + 15));
      if (distToBlower < 55) {
        onBlowerClick?.();
        return;
      }

      // Check hit on Sniffer Probe Wand (from cable top to probe tip)
      const probeTargetY = shaftY - 40 + currentDepthRef.current * 135;
      const distToProbe = Math.hypot(clickX - shaftX, clickY - probeTargetY);
      if (distToProbe < 55 || (Math.abs(clickX - shaftX) < 35 && clickY >= 30 && clickY <= probeTargetY + 20)) {
        onProbeClick?.();
        return;
      }
    },
    [width, height, onBlowerClick, onProbeClick]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const shaftX = width * 0.5;
      const shaftY = height * 0.64;
      const blowerX = shaftX - 110;
      const blowerY = shaftY - 20;

      const distToBlower = Math.hypot(mouseX - (blowerX + 25), mouseY - (blowerY + 15));
      const probeTargetY = shaftY - 40 + currentDepthRef.current * 135;
      const distToProbe = Math.hypot(mouseX - shaftX, mouseY - probeTargetY);

      if (distToBlower < 50 || distToProbe < 45) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    },
    [width, height]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: GasParticle[] = [];

    // Shaft dimensions and coordinates
    const shaftX = width * 0.5;
    const shaftY = height * 0.64;
    const shaftRadiusX = 80;
    const shaftRadiusY = 36;
    const shaftDepth = 135; // Pit depth

    // Blower coordinates
    const blowerX = shaftX - 110;
    const blowerY = shaftY - 20;

    let tick = 0;
    let animatedProbeY = shaftY - 40 + currentDepthRef.current * shaftDepth;

    // Spawn Stratified Toxic Gas Particle
    const spawnGasParticle = () => {
      // Stratified layers:
      // 0 to 0.35: CH4 Methane (light, rises to top)
      // 0.35 to 0.7: CO / O2 Deficient (middle)
      // 0.7 to 1.0: H2S Hydrogen Sulfide (heavy, dense, pools in bottom sump)
      const layerType = Math.random();
      let colorType: 'h2s' | 'ch4' | 'co_deficient' = 'h2s';
      let spawnDepthFactor = 0.8;
      let vy = -0.6;
      let size = 18 + Math.random() * 16;

      if (layerType < 0.35) {
        // CH4: Top layer, buoyant, drifts toward lip
        colorType = 'ch4';
        spawnDepthFactor = 0.2 + Math.random() * 0.3;
        vy = -(1.2 + Math.random() * 1.5);
      } else if (layerType < 0.65) {
        // Mid layer CO / Asphyxiating haze
        colorType = 'co_deficient';
        spawnDepthFactor = 0.45 + Math.random() * 0.3;
        vy = -(0.7 + Math.random() * 0.9);
      } else {
        // Bottom H2S: heavy sulfur vapors hovering in sump
        colorType = 'h2s';
        spawnDepthFactor = 0.75 + Math.random() * 0.25;
        vy = -(0.3 + Math.random() * 0.6);
        size = 22 + Math.random() * 20;
      }

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (shaftRadiusX * 0.7);
      const spawnX = shaftX + Math.cos(angle) * dist;
      const spawnY = shaftY + Math.sin(angle) * (shaftRadiusY * 0.6) + spawnDepthFactor * (shaftDepth * 0.65);

      particles.push({
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 1.2 + Math.cos(tick * 0.04 + angle) * 0.8,
        vy,
        size,
        maxSize: size * (2.2 + Math.random() * 0.8),
        life: 0,
        maxLife: 60 + Math.random() * 45,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        colorType
      });
    };

    // Spawn Fresh Air Jet from Ventilation Duct Sump Nozzle
    const spawnFreshAirJet = () => {
      // Duct discharges at bottom right of shaft
      const ductTipX = shaftX - 15;
      const ductTipY = shaftY + shaftDepth - 10;

      particles.push({
        x: ductTipX + (Math.random() - 0.5) * 12,
        y: ductTipY,
        vx: 3.5 + Math.random() * 4.5,
        vy: -(2.5 + Math.random() * 3.5),
        size: 12 + Math.random() * 14,
        maxSize: 45 + Math.random() * 25,
        life: 0,
        maxLife: 38,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
        colorType: 'fresh_air'
      });
    };

    // Spawn Purged Exhaust Billows out of shaft mouth
    const spawnExhaustPurge = () => {
      particles.push({
        x: shaftX + (Math.random() - 0.5) * (shaftRadiusX * 0.8),
        y: shaftY - 10,
        vx: 4 + Math.random() * 5, // Blown to the right by ambient wind
        vy: -(2.5 + Math.random() * 3),
        size: 20 + Math.random() * 18,
        maxSize: 60 + Math.random() * 30,
        life: 0,
        maxLife: 30,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        colorType: 'exhaust'
      });
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth probe descent interpolation
      const targetProbeY = shaftY - 40 + currentDepthRef.current * shaftDepth;
      animatedProbeY += (targetProbeY - animatedProbeY) * 0.12;

      // Update fan angle if blower running
      if (isBlowerRunning) {
        fanAngleRef.current += 0.48;
      }
      pulseScanRef.current = (pulseScanRef.current + 0.05) % 1;

      // -------------------------------------------------------------
      // 1. SUBTERRANEAN CONFINED SPACE PIT & MANHOLE FRAME
      // -------------------------------------------------------------
      ctx.save();

      // Outer concrete ground apron
      ctx.beginPath();
      ctx.ellipse(shaftX, shaftY, shaftRadiusX + 28, shaftRadiusY + 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // High-visibility yellow & black hazard safety perimeter border
      ctx.beginPath();
      ctx.ellipse(shaftX, shaftY, shaftRadiusX + 16, shaftRadiusY + 9, 0, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#eab308';
      ctx.setLineDash([12, 8]);
      ctx.lineDashOffset = -tick * 0.3;
      ctx.stroke();
      ctx.setLineDash([]);

      // Subterranean Concrete Chamber Walls (Receding cylindrical pit)
      const chamberGrad = ctx.createLinearGradient(shaftX, shaftY, shaftX, shaftY + shaftDepth);
      if (isVentilated) {
        chamberGrad.addColorStop(0, '#091e28');
        chamberGrad.addColorStop(0.6, '#062826');
        chamberGrad.addColorStop(1, '#041718');
      } else {
        chamberGrad.addColorStop(0, '#0f172a');
        chamberGrad.addColorStop(0.4, '#19170e');
        chamberGrad.addColorStop(1, '#1b1202');
      }

      ctx.beginPath();
      ctx.ellipse(shaftX, shaftY + shaftDepth, shaftRadiusX * 0.85, shaftRadiusY * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = chamberGrad;
      ctx.fill();

      // Side casing drop shadow
      ctx.beginPath();
      ctx.moveTo(shaftX - shaftRadiusX, shaftY);
      ctx.lineTo(shaftX - shaftRadiusX * 0.85, shaftY + shaftDepth);
      ctx.ellipse(shaftX, shaftY + shaftDepth, shaftRadiusX * 0.85, shaftRadiusY * 0.8, 0, Math.PI, 0, true);
      ctx.lineTo(shaftX + shaftRadiusX, shaftY);
      ctx.ellipse(shaftX, shaftY, shaftRadiusX, shaftRadiusY, 0, 0, Math.PI, false);
      ctx.fillStyle = chamberGrad;
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Stratified Depth Markings on pit wall
      const strata = [
        { depth: 0.3, label: '-1.0m (CH4)', color: '#f59e0b' },
        { depth: 0.6, label: '-2.5m (O2)', color: '#38bdf8' },
        { depth: 0.9, label: '-4.0m (H2S)', color: '#ef4444' }
      ];

      strata.forEach(s => {
        const yPos = shaftY + s.depth * shaftDepth;
        ctx.beginPath();
        ctx.ellipse(shaftX, yPos, shaftRadiusX * (1 - s.depth * 0.12), shaftRadiusY * (1 - s.depth * 0.12), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `${s.color}33`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = s.color;
        ctx.fillText(s.label, shaftX + shaftRadiusX * 0.5, yPos - 3);
      });

      // Receding Steel Ladder Rungs along rear shaft wall
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      for (let r = 1; r <= 5; r++) {
        const rungY = shaftY + r * 22;
        const rungWidth = shaftRadiusX * 0.45 * (1 - r * 0.05);
        ctx.beginPath();
        ctx.moveTo(shaftX - rungWidth + 15, rungY);
        ctx.lineTo(shaftX + rungWidth + 15, rungY);
        ctx.stroke();
      }

      // Incoming Gas Supply Pipe & LOTO Valve on left wall
      const pipeY = shaftY + shaftDepth * 0.75;
      ctx.fillStyle = '#475569';
      ctx.fillRect(shaftX - shaftRadiusX * 0.85, pipeY - 6, 25, 12);
      // Valve handwheel
      ctx.fillStyle = isVentilated ? '#15803d' : '#dc2626';
      ctx.beginPath();
      ctx.arc(shaftX - shaftRadiusX * 0.85 + 12, pipeY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Red LOTO Lock Clamped onto Valve
      if (isVentilated) {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(shaftX - shaftRadiusX * 0.85 + 7, pipeY - 14, 10, 10);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(shaftX - shaftRadiusX * 0.85 + 9, pipeY - 18, 6, 5);
        ctx.font = 'bold 7px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('LOTO', shaftX - shaftRadiusX * 0.85 + 4, pipeY - 15);
        ctx.restore();
      }

      ctx.restore();

      // -------------------------------------------------------------
      // 2. PARTICLES ENGINE (TOXIC GAS VS FRESH AIR)
      // -------------------------------------------------------------
      if (!isVentilated) {
        for (let i = 0; i < 3; i++) spawnGasParticle();
      } else {
        if (isBlowerRunning) {
          for (let i = 0; i < 4; i++) spawnFreshAirJet();
          if (tick % 2 === 0) spawnExhaustPurge();
        }
      }

      ctx.save();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (isVentilated && p.colorType !== 'fresh_air' && p.colorType !== 'exhaust') {
          p.vx += 0.35;
          p.vy -= 0.25;
        }

        const progress = p.life / p.maxLife;
        const currentSize = p.size + (p.maxSize - p.size) * progress;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.colorType === 'fresh_air') {
          const alpha = Math.max(0, (1 - progress) * 0.45);
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fill();
        } else if (p.colorType === 'exhaust') {
          const alpha = Math.max(0, (1 - progress) * 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.fill();
        } else {
          // Toxic Clouds
          const alpha = Math.max(0, (1 - progress) * 0.38);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
          if (p.colorType === 'h2s') {
            // Sickly dense yellow-orange sulfur cloud
            grad.addColorStop(0, `rgba(234, 179, 8, ${alpha * 1.3})`);
            grad.addColorStop(0.5, `rgba(202, 138, 4, ${alpha * 0.85})`);
            grad.addColorStop(1, 'rgba(161, 98, 7, 0)');
          } else if (p.colorType === 'ch4') {
            // Combustible orange-amber vapor
            grad.addColorStop(0, `rgba(249, 115, 22, ${alpha * 1.2})`);
            grad.addColorStop(0.5, `rgba(217, 119, 6, ${alpha * 0.7})`);
            grad.addColorStop(1, 'rgba(180, 83, 9, 0)');
          } else {
            // Deficient murky green
            grad.addColorStop(0, `rgba(34, 197, 94, ${alpha * 1.1})`);
            grad.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.6})`);
            grad.addColorStop(1, 'rgba(5, 150, 105, 0)');
          }
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (p.life >= p.maxLife || p.x > width + 60 || p.y < -30) {
          particles.splice(i, 1);
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 3. INDUSTRIAL AXIAL VENTILATION BLOWER & FLEXIBLE SPIRAL DUCT
      // -------------------------------------------------------------
      ctx.save();

      // Blower chassis vibration if running
      const vibX = isBlowerRunning ? (Math.random() - 0.5) * 1.8 : 0;
      const vibY = isBlowerRunning ? (Math.random() - 0.5) * 1.8 : 0;
      ctx.translate(blowerX + vibX, blowerY + vibY);

      // Steel mounting frame feet
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(5, 48, 14, 6);
      ctx.fillRect(38, 48, 14, 6);

      // Main safety orange cylindrical barrel
      ctx.fillStyle = '#ea580c'; // Safety high-vis orange
      ctx.beginPath();
      ctx.roundRect(0, 8, 56, 42, 6);
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Metal intake finger-guard circular ring
      ctx.beginPath();
      ctx.arc(28, 29, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spinning 6-blade axial fan impeller
      ctx.save();
      ctx.translate(28, 29);
      ctx.rotate(fanAngleRef.current);
      ctx.strokeStyle = isBlowerRunning ? '#60a5fa' : '#cbd5e1';
      ctx.lineWidth = 3.5;
      for (let b = 0; b < 6; b++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((b * Math.PI) / 3) * 15, Math.sin((b * Math.PI) / 3) * 15);
        ctx.stroke();
      }
      // Center fan hub
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.restore();

      // Carrying Handle on top
      ctx.beginPath();
      ctx.moveTo(14, 8);
      ctx.lineTo(14, 0);
      ctx.lineTo(42, 0);
      ctx.lineTo(42, 8);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Power Toggle Switch & LED
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(44, 12, 10, 14);
      // LED indicator
      ctx.beginPath();
      ctx.arc(49, 18, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isBlowerRunning ? '#22c55e' : '#ef4444';
      ctx.shadowColor = isBlowerRunning ? '#22c55e' : '#ef4444';
      ctx.shadowBlur = isBlowerRunning ? 8 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Stencil label
      ctx.font = 'black 6px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('4500 CFM', 6, 20);

      ctx.restore();

      // -------------------------------------------------------------
      // 4. BRIGHT YELLOW FLEXIBLE SPIRAL VENTILATION DUCT
      // -------------------------------------------------------------
      ctx.save();
      const ductStartX = blowerX + 54;
      const ductStartY = blowerY + 28;
      const ductMidX = shaftX - 35;
      const ductMidY = shaftY + 10;
      const ductBottomX = shaftX - 20;
      const ductBottomY = shaftY + shaftDepth - 10;

      // Outer yellow corrugated body
      ctx.beginPath();
      ctx.moveTo(ductStartX, ductStartY - 8);
      ctx.quadraticCurveTo(ductMidX - 10, ductMidY, ductBottomX - 8, ductBottomY);
      ctx.lineTo(ductBottomX + 8, ductBottomY);
      ctx.quadraticCurveTo(ductMidX + 10, ductMidY, ductStartX, ductStartY + 8);
      ctx.closePath();
      ctx.fillStyle = '#eab308'; // High-vis yellow flexible PVC duct
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Black spiral wire reinforcement ribs along duct length
      const ribCount = 14;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let r = 1; r < ribCount; r++) {
        const t = r / ribCount;
        // Quadratic bezier point
        const ribX = (1 - t) * (1 - t) * ductStartX + 2 * (1 - t) * t * ductMidX + t * t * ductBottomX;
        const ribY = (1 - t) * (1 - t) * ductStartY + 2 * (1 - t) * t * ductMidY + t * t * ductBottomY;
        ctx.beginPath();
        ctx.ellipse(ribX, ribY, 7, 3, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Air jet discharge nozzle at bottom
      ctx.beginPath();
      ctx.ellipse(ductBottomX, ductBottomY, 9, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // -------------------------------------------------------------
      // 5. 3D MULTI-GAS SNIFFER PROBE & TELESCOPING SAMPLING CABLE
      // -------------------------------------------------------------
      ctx.save();
      const cableTopX = shaftX + 28;
      const cableTopY = 18;
      const probeTargetX = shaftX;
      const probeTargetY = animatedProbeY;

      // Overhead Winch / Tripod Pulley
      ctx.fillStyle = '#475569';
      ctx.fillRect(cableTopX - 6, cableTopY - 8, 12, 12);
      ctx.beginPath();
      ctx.arc(cableTopX, cableTopY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Heavy Reinforced Sampling Cable (with yellow meter tick marks)
      ctx.beginPath();
      ctx.moveTo(cableTopX, cableTopY);
      // Slight physics catenary sway
      const sway = Math.sin(tick * 0.06) * 3;
      ctx.quadraticCurveTo(cableTopX + sway, (cableTopY + probeTargetY) * 0.5, probeTargetX, probeTargetY);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Meter markings along cable
      const marks = 6;
      for (let m = 1; m <= marks; m++) {
        const frac = m / (marks + 1);
        const my = cableTopY + frac * (probeTargetY - cableTopY);
        const mx = cableTopX + (probeTargetX - cableTopX) * frac;
        ctx.fillStyle = '#eab308';
        ctx.fillRect(mx - 2, my - 1.5, 4, 3);
      }

      // Sniffer Probe Sensor Body
      ctx.save();
      ctx.translate(probeTargetX, probeTargetY);

      // Probe Housing
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-10, -16, 20, 32, 4);
      ctx.fill();
      ctx.strokeStyle = isTesting ? '#38bdf8' : '#eab308';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rubber corner bumpers
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-10, -16, 20, 4);
      ctx.fillRect(-10, 12, 20, 4);

      // Sintered stainless steel filter intake tip
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-6, 16, 12, 7);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(-6, 16, 12, 7);

      // Flashing 360-degree Alert Strobe LED
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      let ledColor = '#ef4444';
      if (isVentilated) {
        ledColor = '#22c55e';
      } else if (currentStratum === 'surface') {
        ledColor = '#38bdf8';
      }
      ctx.fillStyle = ledColor;
      ctx.shadowColor = ledColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3D Animated Sonar / Laser Cone when testing actively
      if (isTesting || stepIndex === 1) {
        ctx.save();
        // Pulsing atmospheric scanning cone
        const coneRadius = 45 * pulseScanRef.current;
        const coneAlpha = 1 - pulseScanRef.current;

        ctx.beginPath();
        ctx.arc(0, 22, coneRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${coneAlpha * 0.9})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Laser scan sweeps downward
        ctx.beginPath();
        ctx.moveTo(0, 22);
        ctx.lineTo(-30, 50);
        ctx.lineTo(30, 50);
        ctx.closePath();
        ctx.fillStyle = `rgba(56, 189, 248, ${0.12 * Math.sin(tick * 0.15) + 0.12})`;
        ctx.fill();
        ctx.restore();
      }

      // Live 3D Floating Telemetry HUD tag anchored next to probe
      ctx.save();
      ctx.translate(16, -14);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(0, 0, 84, 28, 6);
      ctx.fill();
      ctx.strokeStyle = isVentilated ? '#22c55e' : '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Telemetry Text
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = '#94a3b8';
      const depthText = `-${((animatedProbeY - (shaftY - 40)) / 30).toFixed(1)}m`;
      ctx.fillText(depthText, 6, 11);

      ctx.font = 'bold 9px monospace';
      if (isVentilated) {
        ctx.fillStyle = '#4ade80';
        ctx.fillText('20.9% O2 OK', 6, 22);
      } else if (currentStratum === 'bottom' || currentDepthRef.current > 0.8) {
        ctx.fillStyle = '#f87171';
        ctx.fillText('H2S: 24 PPM!', 6, 22);
      } else if (currentStratum === 'top' || (currentDepthRef.current > 0.2 && currentDepthRef.current < 0.5)) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('CH4: 22% LEL', 6, 22);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('O2: 16.8% DEF', 6, 22);
      }
      ctx.restore();

      ctx.restore(); // probe translate
      ctx.restore(); // probe save

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVentilated, isTesting, isBlowerRunning, currentStratum, width, height, stepIndex]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      className="drop-shadow-2xl transition-all select-none"
    />
  );
};
