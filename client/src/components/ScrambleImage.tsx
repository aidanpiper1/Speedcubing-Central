import { useEffect, useRef } from 'react';
import 'cubing/twisty';

const PUZZLE_MAP: Record<string, string> = {
  '222': '2x2x2', '222bf': '2x2x2',
  '333': '3x3x3', '333oh': '3x3x3', '333bf': '3x3x3', '333fm': '3x3x3', '333ft': '3x3x3', '333mbf': '3x3x3',
  '444': '4x4x4', '444bf': '4x4x4',
  '555': '5x5x5', '555bf': '5x5x5',
  '666': '6x6x6', '666bf': '6x6x6',
  '777': '7x7x7', '777bf': '7x7x7',
  minx: 'megaminx', pyram: 'pyraminx', skewb: 'skewb', clock: 'clock', sq1: 'square1',
  kilominx: 'kilominx', fto: 'fto', redi_cube: 'redi_cube',
};

const SIZE_MAP: Record<string, number> = {
  '222': 220, '222bf': 220,
  '333': 250, '333oh': 250, '333bf': 250, '333fm': 250, '333ft': 250, '333mbf': 250,
  '444': 270, '444bf': 270,
  '555': 270, '555bf': 270,
  '666': 270, '666bf': 270,
  '777': 270, '777bf': 270,

  minx: 270, kilominx: 270,
  pyram: 250, skewb: 250, fto: 250, redi_cube: 250,
  sq1: 280,
};

type TwistyEl = HTMLElement & {
  experimentalSetupAlg: string;
  alg: string;
  puzzle: string;
  visualization: string;
};

function spawnPlayer(
  container: HTMLDivElement,
  puzzle: string,
  scramble: string,
  w: number,
  h: number,
  viz = '2D',
  cameraLatitude?: number,
  cameraLongitude?: number,
) {
  while (container.firstChild) container.removeChild(container.firstChild);
  const el = document.createElement('twisty-player') as TwistyEl;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.setAttribute('background', 'none');
  el.setAttribute('control-panel', 'none');
  el.setAttribute('hint-facelets', 'none');
  // Set visualization as an HTML attribute before connecting so connectedCallback reads it.
  el.setAttribute('visualization', viz);
  if (cameraLatitude !== undefined) el.setAttribute('camera-latitude', String(cameraLatitude));
  if (cameraLongitude !== undefined) el.setAttribute('camera-longitude', String(cameraLongitude));
  container.appendChild(el);
  el.puzzle = puzzle;
  el.visualization = viz;
  el.alg = '';
  el.experimentalSetupAlg = scramble || '';
}

function ClockImage({ scramble }: { scramble: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const RENDER_W = 430;
  const RENDER_H = 260;

  useEffect(() => {
    if (containerRef.current) spawnPlayer(containerRef.current, 'clock', scramble, RENDER_W, RENDER_H);
  }, [scramble]);

  return <div ref={containerRef} style={{ width: RENDER_W, height: RENDER_H }} />;
}

export function ScrambleImage({
  eventId,
  scramble,
  size,
}: {
  eventId: string;
  scramble: string;
  size?: number;
}) {
  if (eventId === 'clock') {
    return <ClockImage scramble={scramble} />;
  }

  const resolvedSize = size ?? SIZE_MAP[eventId] ?? 160;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const viz = eventId === 'sq1' ? 'PG3D' : '2D';
    const lat = eventId === 'sq1' ? 25 : undefined;
    const lon = eventId === 'sq1' ? 30 : undefined;
    spawnPlayer(container, PUZZLE_MAP[eventId] ?? '3x3x3', scramble, resolvedSize, resolvedSize, viz, lat, lon);
  }, [eventId, scramble, resolvedSize]);

  return <div ref={containerRef} style={{ width: resolvedSize, height: resolvedSize }} />;
}
