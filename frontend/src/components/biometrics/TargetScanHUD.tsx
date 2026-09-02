import React, { useState, useEffect } from 'react';
import { Crosshair, Sparkles, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface TargetScanHUDProps {
  imageSrc?: string | null;
  searching: boolean;
  confidence?: number;
  distance?: number;
  citizenName?: string;
  citizenId?: string | number;
  onRetriggerScan?: () => void;
}

interface LandmarkTarget {
  id: string;
  name: string;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  delay: string;
  color: string;
}

export const TargetScanHUD: React.FC<TargetScanHUDProps> = ({
  imageSrc,
  searching,
  confidence = 100.0,
  distance = 0.0,
  citizenName,
  citizenId = '1009',
  onRetriggerScan
}) => {
  const [impactActive, setImpactActive] = useState<boolean>(true);
  const [reticleAngle, setReticleAngle] = useState<number>(0);

  // Rotate reticle continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setReticleAngle(prev => (prev + 1.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // When searching starts or finishes, trigger active impact pulse
  useEffect(() => {
    setImpactActive(true);
    const timer = setTimeout(() => {
      if (!searching) setImpactActive(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, [searching, citizenId]);

  // 8 Directional Arrow Projectile Vectors converging onto facial landmarks
  const landmarkTargets: LandmarkTarget[] = [
    { id: 'left_eye', name: 'Left Ocular Vector', targetX: 195, targetY: 185, originX: 40, originY: 50, delay: '0s', color: '#10b981' },
    { id: 'right_eye', name: 'Right Ocular Vector', targetX: 305, targetY: 185, originX: 460, originY: 50, delay: '0.15s', color: '#10b981' },
    { id: 'forehead', name: 'Frontal Cranial Probe', targetX: 250, targetY: 130, originX: 250, originY: 20, delay: '0.3s', color: '#38bdf8' },
    { id: 'nose_bridge', name: 'Nasal Apex Coordinate', targetX: 250, targetY: 235, originX: 20, originY: 235, delay: '0.45s', color: '#f59e0b' },
    { id: 'mouth_left', name: 'Left Labial Vector', targetX: 210, targetY: 295, originX: 40, originY: 420, delay: '0.6s', color: '#10b981' },
    { id: 'mouth_right', name: 'Right Labial Vector', targetX: 290, targetY: 295, originX: 460, originY: 420, delay: '0.75s', color: '#10b981' },
    { id: 'chin_jaw', name: 'Mandibular Landmark', targetX: 250, targetY: 350, originX: 250, originY: 480, delay: '0.9s', color: '#a855f7' },
    { id: 'temporal', name: 'Zygomatic Arch Probe', targetX: 340, targetY: 235, originX: 480, originY: 235, delay: '1.05s', color: '#38bdf8' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#04060d] border border-emerald-500/40 shadow-2xl flex flex-col items-center">
      
      {/* Top HUD Header Banner */}
      <div className="w-full px-4 py-2.5 bg-[#090e1a]/95 border-b border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-extrabold text-white tracking-wider text-[11px]">
            BIOMETRIC VECTOR TRACKER &bull; IMPACT HUD
          </span>
          <span className="badge-glass badge-green text-[10px]">128D ResNet</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Probe: <strong className="text-amber-400 font-bold font-mono">#{citizenId}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${searching || impactActive ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-bold text-emerald-400">
              {searching ? 'TRACKING VECTORS...' : 'TARGET LOCKED'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Vector Arena */}
      <div className="relative w-full aspect-square max-h-[460px] flex items-center justify-center p-2 select-none overflow-hidden">
        
        {/* Background Ambient Grid & Radial Scanner */}
        <div className="absolute inset-0 bg-ambient-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Master SVG Canvas for Person Silhouette, Vector Arrows, and Impact Rings */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-h-[440px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Emerald Glow Filter */}
            <filter id="hudGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Intense Arrow Impact Glow */}
            <filter id="impactGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arrowhead Markers for Each Vector Color */}
            <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#10b981" />
            </marker>
            <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#38bdf8" />
            </marker>
            <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#f59e0b" />
            </marker>
            <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#a855f7" />
            </marker>

            {/* Linear Gradients for Dynamic Scanning Lines */}
            <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            {/* Radial Gradient for Target Impact Wave */}
            <radialGradient id="shockwaveGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0" />
            </radialGradient>

            {/* Clipping path for probe image */}
            <clipPath id="portraitCircleClip">
              <circle cx="250" cy="235" r="125" />
            </clipPath>
          </defs>

          {/* 1. Radar Circular Range Guides */}
          <circle cx="250" cy="235" r="210" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="235" r="160" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="250" cy="235" r="125" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <circle cx="250" cy="235" r="75" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="1" strokeDasharray="3 3" />

          {/* 2. Axis Crosshair Guide Lines */}
          <line x1="250" y1="10" x2="250" y2="490" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="10" y1="235" x2="490" y2="235" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="2 4" />

          {/* 3. Rotating Reticle Ring with Directional Ticks */}
          <g transform={`rotate(${reticleAngle} 250 235)`}>
            <circle cx="250" cy="235" r="185" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" strokeDasharray="25 60" />
            <circle cx="250" cy="235" r="145" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1" strokeDasharray="15 40" />
            {/* North, South, East, West Reticle Ticks */}
            <line x1="250" y1="45" x2="250" y2="55" stroke="#10b981" strokeWidth="3" />
            <line x1="250" y1="415" x2="250" y2="425" stroke="#10b981" strokeWidth="3" />
            <line x1="60" y1="235" x2="70" y2="235" stroke="#10b981" strokeWidth="3" />
            <line x1="430" y1="235" x2="440" y2="235" stroke="#10b981" strokeWidth="3" />
          </g>

          {/* 4. THE PERSON: Subject Image OR Stylized Futuristic Silhouette */}
          {imageSrc ? (
            <g>
              <image
                href={imageSrc}
                x="125"
                y="110"
                width="250"
                height="250"
                clipPath="url(#portraitCircleClip)"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.9"
              />
              {/* Green HUD Hologram Tint overlay */}
              <circle cx="250" cy="235" r="125" fill="rgba(16,185,129,0.08)" />
            </g>
          ) : (
            /* Cyber Person Silhouette */
            <g opacity="0.85" filter="url(#hudGlow)">
              {/* Shoulders & Torso */}
              <path
                d="M 130 440 C 145 360, 210 340, 250 340 C 290 340, 355 360, 370 440 Z"
                fill="rgba(18, 25, 42, 0.7)"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="2"
              />
              {/* Neck */}
              <path
                d="M 225 340 L 225 295 C 235 300, 265 300, 275 295 L 275 340 Z"
                fill="rgba(20, 30, 50, 0.8)"
                stroke="rgba(16, 185, 129, 0.5)"
                strokeWidth="1.5"
              />
              {/* Head Contour */}
              <path
                d="M 175 200 C 175 140, 210 115, 250 115 C 290 115, 325 140, 325 200 C 325 255, 295 300, 250 300 C 205 300, 175 255, 175 200 Z"
                fill="rgba(18, 25, 42, 0.85)"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Forehead Ridge Guide */}
              <path d="M 210 160 Q 250 150 290 160" fill="none" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Eye Level Guide */}
              <path d="M 190 190 Q 250 180 310 190" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="1" />
              {/* Nose Contour */}
              <path d="M 250 190 L 245 235 L 255 235 Z" fill="none" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" />
              {/* Mouth Curve */}
              <path d="M 220 265 Q 250 275 280 265" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
            </g>
          )}

          {/* 5. DELAUNAY FACIAL TRIANGULATION MESH (LOCKED NETWORK) */}
          <g stroke="rgba(16, 185, 129, 0.45)" strokeWidth="1.2" fill="rgba(16, 185, 129, 0.05)" filter="url(#hudGlow)">
            {/* Ocular & Nasal Mesh Triangles */}
            <polygon points="195,185 250,130 305,185" />
            <polygon points="195,185 250,235 305,185" />
            <polygon points="195,185 250,235 210,295" />
            <polygon points="305,185 250,235 290,295" />
            <polygon points="210,295 250,235 290,295" />
            <polygon points="210,295 250,350 290,295" />
            {/* Temporal Connections */}
            <line x1="195" y1="185" x2="160" y2="200" strokeDasharray="2 3" />
            <line x1="305" y1="185" x2="340" y2="200" strokeDasharray="2 3" />
          </g>

          {/* 6. DYNAMIC ANIMATED VECTOR ARROWS FLYING IN & IMPACTING THE FACE */}
          {landmarkTargets.map(t => {
            const markerId = t.color === '#10b981' ? 'arrowEmerald' : t.color === '#38bdf8' ? 'arrowCyan' : t.color === '#f59e0b' ? 'arrowGold' : 'arrowPurple';
            return (
              <g key={t.id}>
                {/* Vector Flight Path with Motion Animation */}
                <line
                  x1={t.originX}
                  y1={t.originY}
                  x2={t.targetX}
                  y2={t.targetY}
                  stroke={t.color}
                  strokeWidth="2"
                  strokeDasharray="14 8"
                  markerEnd={`url(#${markerId})`}
                  opacity={searching || impactActive ? 1 : 0.65}
                  filter="url(#hudGlow)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur="1.2s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                </line>

                {/* Flying Arrow Head Particle Trail (Pulsing Arrow Projectile) */}
                <circle cx={t.originX} cy={t.originY} r="3.5" fill={t.color} filter="url(#hudGlow)">
                  <animate
                    attributeName="cx"
                    values={`${t.originX};${t.targetX}`}
                    dur="0.8s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${t.originY};${t.targetY}`}
                    dur="0.8s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0"
                    dur="0.8s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* ARROW IMPACT SHOCKWAVE RING AT FACIAL COORDINATE */}
                <circle
                  cx={t.targetX}
                  cy={t.targetY}
                  r="0"
                  fill="none"
                  stroke={t.color}
                  strokeWidth="2"
                  filter="url(#impactGlow)"
                >
                  <animate
                    attributeName="r"
                    values="2;18;32"
                    dur="1.4s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0.6;0"
                    dur="1.4s"
                    begin={t.delay}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Second Concentric Impact Shockwave */}
                <circle
                  cx={t.targetX}
                  cy={t.targetY}
                  r="0"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1"
                >
                  <animate
                    attributeName="r"
                    values="0;10;20"
                    dur="1.4s"
                    begin={`${parseFloat(t.delay) + 0.15}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0.3;0"
                    dur="1.4s"
                    begin={`${parseFloat(t.delay) + 0.15}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Solid Coordinate Node Lock Dot */}
                <circle
                  cx={t.targetX}
                  cy={t.targetY}
                  r="4.5"
                  fill={t.color}
                  stroke="#fff"
                  strokeWidth="1.5"
                  filter="url(#hudGlow)"
                />

                {/* Coordinate Label Tag */}
                <text
                  x={t.targetX + 8}
                  y={t.targetY - 6}
                  fill="#cbd5e1"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [{t.targetX},{t.targetY}]
                </text>
              </g>
            );
          })}

          {/* 7. Central Head Lock Reticle Box */}
          <g>
            {/* 4 Corner Angle Brackets Locking Around Head [ ] */}
            <path d="M 140 140 L 120 140 L 120 160" fill="none" stroke="#10b981" strokeWidth="3" />
            <path d="M 360 140 L 380 140 L 380 160" fill="none" stroke="#10b981" strokeWidth="3" />
            <path d="M 140 330 L 120 330 L 120 310" fill="none" stroke="#10b981" strokeWidth="3" />
            <path d="M 360 330 L 380 330 L 380 310" fill="none" stroke="#10b981" strokeWidth="3" />

            {/* Sweeping Laser Beam Bar (Active during search) */}
            {searching && (
              <rect
                x="120"
                y="110"
                width="260"
                height="8"
                fill="url(#scanBeamGrad)"
                filter="url(#hudGlow)"
              >
                <animate
                  attributeName="y"
                  values="110;340;110"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
          </g>

          {/* 8. Active Lock Impact Center Pulse */}
          <circle cx="250" cy="235" r="12" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="250" cy="235" r="3" fill="#10b981" />
        </svg>

        {/* Live HUD Floating Corner Telemetry Readouts */}
        <div className="absolute top-3 left-3 text-[9px] font-mono text-emerald-400 bg-black/70 px-2 py-1 rounded border border-emerald-500/20 backdrop-blur-sm pointer-events-none">
          <div>LOC: [34.5244°N, 69.1764°E]</div>
          <div>MODE: 128D VECTOR DELAUNAY</div>
          <div>STATUS: {searching ? 'CALIBRATING VECTORS...' : 'ARROWS IMPACTED & LOCKED'}</div>
        </div>

        <div className="absolute top-3 right-3 text-[9px] font-mono text-cyan-300 bg-black/70 px-2 py-1 rounded border border-cyan-500/20 backdrop-blur-sm pointer-events-none text-right">
          <div>PROBE: RESNET-34</div>
          <div>EUCLIDEAN: d = {distance.toFixed(4)}</div>
          <div>CONFIDENCE: {confidence}%</div>
        </div>

        {/* Center Target Acquisition Alert Banner */}
        <div className="absolute bottom-3 inset-x-4 bg-[#05070d]/92 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {citizenName ? `TARGET: ${citizenName}` : `CITIZEN SUBJECT #${citizenId}`}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                {searching ? 'PROJECTING 8-POINT VECTOR ARROWS...' : '8 VECTOR ARROWS IMPACTED • 128D EMBEDDINGS MATCHED'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setImpactActive(true);
                if (onRetriggerScan) onRetriggerScan();
              }}
              className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-[10px] font-mono font-bold border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer"
              title="Retrigger animated arrow strike"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Strike</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Telemetry Metrics Strip */}
      <div className="w-full grid grid-cols-4 border-t border-white/10 bg-[#090e1a]/95 text-center text-xs font-mono py-2.5">
        <div className="border-r border-white/5">
          <span className="text-slate-500 block text-[9px] uppercase">Vectors Fired</span>
          <span className="text-white font-bold">8 Directions</span>
        </div>
        <div className="border-r border-white/5">
          <span className="text-slate-500 block text-[9px] uppercase">Target Coordinates</span>
          <span className="text-emerald-400 font-bold">8 Facial Points</span>
        </div>
        <div className="border-r border-white/5">
          <span className="text-slate-500 block text-[9px] uppercase">Euclidean Distance</span>
          <strong className="text-cyan-400">{distance.toFixed(4)}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase">Match Confidence</span>
          <strong className="text-amber-400 font-bold">{confidence}%</strong>
        </div>
      </div>

    </div>
  );
};
