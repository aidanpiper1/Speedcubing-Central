import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { PageHeader, Badge } from '../../components/ui';
import { OllDiagram, PllDiagram, CollDiagram, F2LDiagram, RotatingCaseDiagram, invertAlg } from '../../components/CubeDiagram';
import { ALG_SETS, getSet, type AlgCase, type AlgSet } from '../../data/algSets';
import { Icon } from '../../components/Icon';

// ---------------------------------------------------------------------------
// Puzzle SVG icons (WCA-style front-face views)
// ---------------------------------------------------------------------------

function Icon3x3({ size = 64 }: { size?: number }) {
  const s = size;
  const gap = s * 0.04;
  const cell = (s - gap * 4) / 3;
  const colors = ['#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000'];
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {colors.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = gap + col * (cell + gap);
        const y = gap + row * (cell + gap);
        return <rect key={i} x={x} y={y} width={cell} height={cell} rx={cell * 0.12} fill={c} />;
      })}
    </svg>
  );
}

function Icon2x2({ size = 64 }: { size?: number }) {
  const s = size;
  const gap = s * 0.05;
  const cell = (s - gap * 3) / 2;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {[0,1,2,3].map(i => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = gap + col * (cell + gap);
        const y = gap + row * (cell + gap);
        return <rect key={i} x={x} y={y} width={cell} height={cell} rx={cell * 0.12} fill="#ff0000" />;
      })}
    </svg>
  );
}

function IconSq1({ size = 64 }: { size?: number }) {
  const s = size;
  const cx = s / 2, cy = s / 2, r = s * 0.44;
  // Square-1 top face: 8 pieces — 4 corners (60°) + 4 edges (30°)
  // Alternating wedges: corner=60deg, edge=30deg
  const pieces: { start: number; span: number; fill: string }[] = [];
  const fills = ['#ff0000','#ff7700','#ff0000','#ff7700','#ff0000','#ff7700','#ff0000','#ff7700'];
  let angle = -90;
  const spans = [60, 30, 60, 30, 60, 30, 60, 30];
  spans.forEach((span, i) => {
    pieces.push({ start: angle, span, fill: fills[i] });
    angle += span;
  });
  function wedge(start: number, span: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(start + span));
    const y2 = cy + r * Math.sin(toRad(start + span));
    const large = span > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={cx} cy={cy} r={r} fill="#1a1a1a" />
      {pieces.map((p, i) => (
        <path key={i} d={wedge(p.start, p.span)} fill={p.fill} stroke="#1a1a1a" strokeWidth={s * 0.025} />
      ))}
    </svg>
  );
}

function IconMegaminx({ size = 64 }: { size?: number }) {
  const s = size;
  const cx = s / 2, cy = s / 2, r = s * 0.44;
  const toRad = (d: number) => (d * Math.PI) / 180;
  // Pentagon + 5 surrounding pentagons (simplified as a dodecahedron face)
  function pentagon(cx2: number, cy2: number, r2: number, rot = 0) {
    const pts = Array.from({ length: 5 }, (_, i) => {
      const a = toRad(rot + i * 72 - 90);
      return `${cx2 + r2 * Math.cos(a)},${cy2 + r2 * Math.sin(a)}`;
    });
    return pts.join(' ');
  }
  const innerR = r * 0.38;
  const outerR = r * 0.36;
  const dist = r * 0.6;
  const fills = ['#ff0000','#ff7700','#ffff00','#00bb00','#0000ff','#ffffff'];
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={cx} cy={cy} r={r} fill="#1a1a1a" />
      {/* 5 outer faces */}
      {[0,1,2,3,4].map(i => {
        const a = toRad(i * 72 - 90);
        const fx = cx + dist * Math.cos(a);
        const fy = cy + dist * Math.sin(a);
        return <polygon key={i} points={pentagon(fx, fy, outerR, i * 72)} fill={fills[i + 1]} stroke="#1a1a1a" strokeWidth={s * 0.025} />;
      })}
      {/* Center face */}
      <polygon points={pentagon(cx, cy, innerR)} fill={fills[0]} stroke="#1a1a1a" strokeWidth={s * 0.025} />
    </svg>
  );
}

function IconPyraminx({ size = 64 }: { size?: number }) {
  const s = size;
  const pad = s * 0.06;
  // Equilateral triangle subdivided 3×3
  const top = { x: s / 2, y: pad };
  const bl  = { x: pad, y: s - pad };
  const br  = { x: s - pad, y: s - pad };
  function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  // 9 upward triangles + 3 inverted (4 rows)
  const tris: { pts: string; fill: string }[] = [];
  const red = '#ff0000';
  for (let row = 0; row < 3; row++) {
    const t0 = row / 3, t1 = (row + 1) / 3;
    for (let col = 0; col <= row * 2; col++) {
      const isUp = col % 2 === 0;
      const subCol = Math.floor(col / 2);
      const tLeft0 = lerp(lerp(top, bl, t0), lerp(top, br, t0), subCol / (row || 1));
      const tRight0 = lerp(lerp(top, bl, t0), lerp(top, br, t0), (subCol + 1) / (row || 1));
      const bLeft1 = lerp(lerp(top, bl, t1), lerp(top, br, t1), subCol / (row + 1));
      const bRight1 = lerp(lerp(top, bl, t1), lerp(top, br, t1), (subCol + 1) / (row + 1));
      let pts: string;
      if (isUp) {
        const tl = row === 0 ? top : tLeft0;
        const tr = row === 0 ? top : tRight0;
        pts = `${tl.x},${tl.y} ${bLeft1.x},${bLeft1.y} ${bRight1.x},${bRight1.y}`;
      } else {
        pts = `${tLeft0.x},${tLeft0.y} ${tRight0.x},${tRight0.y} ${bRight1.x},${bRight1.y}`;
      }
      tris.push({ pts, fill: red });
    }
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {tris.map((t, i) => (
        <polygon key={i} points={t.pts} fill={t.fill} stroke="#1a1a1a" strokeWidth={s * 0.025} />
      ))}
    </svg>
  );
}

function IconSkewb({ size = 64 }: { size?: number }) {
  const s = size;
  const pad = s * 0.06;
  const w = s - pad * 2;
  // Skewb face: 1 center diamond + 4 corner triangles
  const cx = s / 2, cy = s / 2;
  const half = w / 2;
  // Corners: top, right, bottom, left
  const corners = [
    { pts: `${cx},${pad} ${cx - half},${cy} ${cx + half},${cy}` },           // top
    { pts: `${s - pad},${cy} ${cx},${cy - half} ${cx},${cy + half}` },        // right
    { pts: `${cx},${s - pad} ${cx - half},${cy} ${cx + half},${cy}` },        // bottom
    { pts: `${pad},${cy} ${cx},${cy - half} ${cx},${cy + half}` },            // left
  ];
  const diamond = `${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {corners.map((c, i) => (
        <polygon key={i} points={c.pts} fill="#ff0000" stroke="#1a1a1a" strokeWidth={s * 0.03} />
      ))}
      <polygon points={diamond} fill="#ff0000" stroke="#1a1a1a" strokeWidth={s * 0.03} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Puzzle landing screen
// ---------------------------------------------------------------------------

const PUZZLES = [
  { id: '3x3', label: '3×3', Icon: Icon3x3, available: true },
  { id: '2x2', label: '2×2', Icon: Icon2x2, available: false },
  { id: 'sq1', label: 'Square-1', Icon: IconSq1, available: false },
  { id: 'minx', label: 'Megaminx', Icon: IconMegaminx, available: false },
  { id: 'pyram', label: 'Pyraminx', Icon: IconPyraminx, available: false },
  { id: 'skewb', label: 'Skewb', Icon: IconSkewb, available: false },
];

function PuzzleLanding({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <PageHeader title="Algorithm Library" subtitle="Select a puzzle to browse algorithms." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PUZZLES.map((p) => (
          <button
            key={p.id}
            onClick={() => p.available && onSelect(p.id)}
            className={clsx(
              'card p-6 flex flex-col items-center gap-4 transition-colors text-center relative',
              p.available
                ? 'hover:border-accent/50 cursor-pointer'
                : 'opacity-60 cursor-not-allowed',
            )}
          >
            <p.Icon size={64} />
            <div>
              <div className="font-bold text-base">{p.label}</div>
              {!p.available && (
                <div className="text-xs text-muted mt-1 font-medium">Coming Soon</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3×3 set picker
// ---------------------------------------------------------------------------

const SET_CARDS = [
  {
    id: 'OLL',
    label: 'OLL',
    description: 'Orient the Last Layer',
    count: 57,
    preview: <OllDiagram alg="R U2 R2 F R F' U2 R' F R F'" size={80} />,
  },
  {
    id: 'PLL',
    label: 'PLL',
    description: 'Permute the Last Layer',
    count: 21,
    preview: <PllDiagram alg="R U R' U' R' F R2 U' R' U' R U R' F'" size={80} />,
  },
  {
    id: 'F2L',
    label: 'F2L',
    description: 'First Two Layers',
    count: 41,
    preview: <F2LDiagram alg="U R U' R'" size={80} />,
  },
  {
    id: 'COLL',
    label: 'COLL',
    description: 'Corners of the Last Layer',
    count: 40,
    preview: <CollDiagram alg="R U R' U R U2 R'" size={80} />,
  },
];

function ThreeByThreePicker({ onSelect, onBack }: { onSelect: (setId: string) => void; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <Icon name="arrowLeft" size={14} /> Puzzles
        </button>
        <span className="text-muted">/</span>
        <span className="font-semibold">3×3</span>
      </div>
      <PageHeader title="3×3 Algorithm Sets" subtitle="Choose a set to browse and learn." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SET_CARDS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="card p-6 flex flex-col items-center gap-4 hover:border-accent/50 transition-colors cursor-pointer text-center"
          >
            <div className="w-20 h-20 flex items-center justify-center">{s.preview}</div>
            <div>
              <div className="font-bold text-lg">{s.label}</div>
              <div className="text-xs text-muted mt-0.5">{s.description}</div>
              <div className="text-xs text-accent font-semibold mt-1">{s.count} cases</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case browser (unchanged logic, new breadcrumb nav)
// ---------------------------------------------------------------------------

function CaseImage({ c, set, size = 80 }: { c: AlgCase; set: AlgSet; size?: number }) {
  if (set.kind === 'pll') return <PllDiagram alg={c.moves} size={size} />;
  if (set.kind === 'oll') return <OllDiagram alg={c.moves} size={size} />;
  if (set.kind === 'coll') return <CollDiagram alg={c.moves} size={size} />;
  return <F2LDiagram alg={c.moves} size={size} />;
}

function CaseCard({ c, set, onSelect }: { c: AlgCase; set: AlgSet; onSelect: (c: AlgCase) => void }) {
  const startPos = useRef({ x: 0, y: 0 });
  const dragged = useRef(false);
  return (
    <div
      className="card p-4 flex gap-4 items-center text-left hover:border-accent/50 transition-colors cursor-pointer"
      onPointerDown={(e) => { startPos.current = { x: e.clientX, y: e.clientY }; dragged.current = false; }}
      onPointerMove={(e) => {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        if (Math.sqrt(dx * dx + dy * dy) > 6) dragged.current = true;
      }}
      onClick={() => { if (!dragged.current) onSelect(c); }}
    >
      <div className="shrink-0"><CaseImage c={c} set={set} size={80} /></div>
      <div className="min-w-0">
        <div className="font-semibold text-sm flex items-center gap-2">
          {c.name} <Badge color="gray">{c.probability}</Badge>
        </div>
        <div className="font-mono text-xs text-muted mt-1 break-words">{c.moves}</div>
      </div>
    </div>
  );
}

function AlgChip({ alg }: { alg: string }) {
  return (
    <div className="font-mono text-sm bg-card-hover rounded px-3 py-2 break-all leading-relaxed">
      {alg}
    </div>
  );
}

function CaseModal({ c, set, onClose }: { c: AlgCase; set: AlgSet; onClose: () => void }) {
  const setup = invertAlg(c.moves);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <span className="text-sm text-muted">{c.group} · {c.probability}</span>
          </div>
          <button onClick={onClose} className="btn-ghost text-lg leading-none px-2 py-1">✕</button>
        </div>
        <div className="flex justify-center">
          <RotatingCaseDiagram alg={c.moves} size={280} defaultLat={set.kind === 'f2l' ? 15 : 30} />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Setup (apply to solved cube)</div>
          <AlgChip alg={setup} />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Main Algorithm</div>
          <AlgChip alg={c.moves} />
        </div>
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Alternates {c.alts?.length ? `(${c.alts.length})` : ''}
          </div>
          {c.alts && c.alts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {c.alts.map((a, i) => <AlgChip key={i} alg={a} />)}
            </div>
          ) : (
            <p className="text-sm text-muted italic">No alternates on file.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseBrowser({ setId, onBack }: { setId: string; onBack: () => void }) {
  const set = getSet(setId)!;
  const groups = useMemo(() => ['All', ...Array.from(new Set(set.cases.map((c) => c.group)))], [set]);
  const [group, setGroup] = useState('All');
  const [selected, setSelected] = useState<AlgCase | null>(null);
  const cases = group === 'All' ? set.cases : set.cases.filter((c) => c.group === group);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1">
          <Icon name="arrowLeft" size={14} /> Sets
        </button>
        <span className="text-muted">/</span>
        <span className="font-semibold">{set.name}</span>
      </div>

      <PageHeader title={set.name} subtitle={set.description} />

      {/* Group filter */}
      {groups.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={clsx('px-2.5 py-1 rounded text-xs font-semibold', group === g ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 dark:bg-card-hover dark:text-muted')}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} set={set} onSelect={setSelected} />
        ))}
      </div>

      {selected && <CaseModal c={selected} set={set} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root page — manages view state
// ---------------------------------------------------------------------------

type View =
  | { screen: 'puzzles' }
  | { screen: 'sets'; puzzle: string }
  | { screen: 'cases'; puzzle: string; setId: string };

export default function AlgTrainerPage() {
  const [view, setView] = useState<View>({ screen: 'puzzles' });

  if (view.screen === 'puzzles') {
    return (
      <PuzzleLanding
        onSelect={(puzzle) => setView({ screen: 'sets', puzzle })}
      />
    );
  }

  if (view.screen === 'sets') {
    return (
      <ThreeByThreePicker
        onBack={() => setView({ screen: 'puzzles' })}
        onSelect={(setId) => setView({ screen: 'cases', puzzle: view.puzzle, setId })}
      />
    );
  }

  return (
    <CaseBrowser
      setId={view.setId}
      onBack={() => setView({ screen: 'sets', puzzle: view.puzzle })}
    />
  );
}
