// Last-layer and F2L case diagrams using cubing.js twisty-player.
// Each component takes the algorithm that SOLVES the case; we display the
// inverse (the unsolved state). OLL/PLL/COLL use 2D flat view; F2L uses 3D.
import { useEffect, useRef, useState } from 'react';
import 'cubing/twisty';

// Legacy types kept so existing data files compile without changes.
export interface OllPattern { u: boolean[]; top: boolean[]; right: boolean[]; bottom: boolean[]; left: boolean[]; }
export interface PllArrow { from: number; to: number; kind?: 'corner' | 'edge'; }

type TwistyEl = HTMLElement & {
  experimentalSetupAlg: string;
  alg: string;
  puzzle: string;
  visualization: string;
};

export function invertAlg(alg: string): string {
  return alg
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .map((move) => {
      if (move.endsWith("'")) return move.slice(0, -1);
      if (move.endsWith('2')) return move;
      return move + "'";
    })
    .join(' ');
}

function spawn3D(container: HTMLDivElement, alg: string, size: number, lat: number, lon: number, puzzle = '3x3x3', diagramPrefix = '', stickering = 'full') {
  while (container.firstChild) container.removeChild(container.firstChild);
  if (!alg) return;
  const el = document.createElement('twisty-player') as TwistyEl;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.setAttribute('background', 'none');
  el.setAttribute('control-panel', 'none');
  el.setAttribute('hint-facelets', 'none');
  el.setAttribute('visualization', 'PG3D');
  el.setAttribute('camera-latitude', String(lat));
  el.setAttribute('camera-longitude', String(lon));
  el.setAttribute('experimental-stickering', stickering);
  container.appendChild(el);
  el.puzzle = puzzle;
  el.visualization = 'PG3D';
  el.alg = '';
  el.experimentalSetupAlg = (diagramPrefix ? diagramPrefix + ' ' : '') + 'x2 ' + invertAlg(alg);
}

// OLL & COLL: top-down view — shows U-face orientation pattern + top-row side stickers.
export function OllDiagram({ alg, size = 80 }: { alg: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spawn3D(ref.current, alg, size, 72, 25, '3x3x3', '', 'OLL'); }, [alg, size]);
  return <div ref={ref} style={{ width: size, height: size }} />;
}

export function PllDiagram({ alg, size = 80 }: { alg: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spawn3D(ref.current, alg, size, 72, 25, '3x3x3', '', 'PLL'); }, [alg, size]);
  return <div ref={ref} style={{ width: size, height: size }} />;
}

export function CollDiagram({ alg, size = 80 }: { alg: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spawn3D(ref.current, alg, size, 72, 25, '3x3x3', '', 'COLL'); }, [alg, size]);
  return <div ref={ref} style={{ width: size, height: size }} />;
}

// F2L: front-right angled view to show the corner+edge slot.
export function F2LDiagram({ alg, size = 80 }: { alg: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spawn3D(ref.current, alg, size, 15, 35, '3x3x3', '', 'full'); }, [alg, size]);
  return <div ref={ref} style={{ width: size, height: size }} />;
}

// 2x2 top-down view (OLL / CLL / EG).
export function TwoByTwoDiagram({ alg, size = 80, diagramPrefix = '', stickering = 'full' }: { alg: string; size?: number; diagramPrefix?: string; stickering?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) spawn3D(ref.current, alg, size, 72, 25, '2x2x2', diagramPrefix, stickering); }, [alg, size, diagramPrefix, stickering]);
  return <div ref={ref} style={{ width: size, height: size }} />;
}

// Auto-rotating 3D viewer for the case detail modal.
// Slowly spins around the Y axis; dragging overrides rotation and snaps
// latitude back to the default angle on release.
export function RotatingCaseDiagram({ alg, size = 280, defaultLat = 30, puzzle = '3x3x3', diagramPrefix = '', stickering = 'full' }: { alg: string; size?: number; defaultLat?: number; puzzle?: string; diagramPrefix?: string; stickering?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<TwistyEl | null>(null);
  const lon = useRef(25);
  const lat = useRef(defaultLat);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const rotRaf = useRef<number | null>(null);
  const snapRaf = useRef<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const el = document.createElement('twisty-player') as TwistyEl;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.pointerEvents = 'none';
    el.setAttribute('background', 'none');
    el.setAttribute('control-panel', 'none');
    el.setAttribute('hint-facelets', 'none');
    el.setAttribute('visualization', 'PG3D');
    el.setAttribute('camera-latitude', String(lat.current));
    el.setAttribute('camera-longitude', String(lon.current));
    el.setAttribute('experimental-stickering', stickering);
    wrap.appendChild(el);
    elRef.current = el;
    el.puzzle = puzzle;
    el.visualization = 'PG3D';
    el.alg = '';
    el.experimentalSetupAlg = (diagramPrefix ? diagramPrefix + ' ' : '') + 'x2 ' + invertAlg(alg);

    const autoRotate = () => {
      if (!dragging.current) {
        lon.current += 0.25;
        el.setAttribute('camera-longitude', String(lon.current));
      }
      rotRaf.current = requestAnimationFrame(autoRotate);
    };
    rotRaf.current = requestAnimationFrame(autoRotate);

    return () => {
      if (rotRaf.current) cancelAnimationFrame(rotRaf.current);
      if (snapRaf.current) cancelAnimationFrame(snapRaf.current);
      wrap.innerHTML = '';
      elRef.current = null;
    };
  }, [alg, size, stickering]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setGrabbing(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (snapRaf.current) { cancelAnimationFrame(snapRaf.current); snapRaf.current = null; }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !elRef.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    lon.current -= dx * 0.5;
    lat.current = Math.max(-89, Math.min(89, lat.current + dy * 0.5));
    elRef.current.setAttribute('camera-longitude', String(lon.current));
    elRef.current.setAttribute('camera-latitude', String(lat.current));
  };

  const onPointerUp = () => {
    dragging.current = false;
    setGrabbing(false);
    const startLat = lat.current;
    const startTime = performance.now();
    const snap = (now: number) => {
      const t = Math.min((now - startTime) / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      lat.current = startLat + (defaultLat - startLat) * eased;
      elRef.current?.setAttribute('camera-latitude', String(lat.current));
      if (t < 1) snapRaf.current = requestAnimationFrame(snap);
      else snapRaf.current = null;
    };
    snapRaf.current = requestAnimationFrame(snap);
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div ref={wrapRef} />
      <div
        style={{ position: 'absolute', inset: 0, cursor: grabbing ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}
