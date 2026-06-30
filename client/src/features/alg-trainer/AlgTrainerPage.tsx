import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import '@cubing/icons';
import { PageHeader, Badge } from '../../components/ui';
import { OllDiagram, PllDiagram, CollDiagram, F2LDiagram, TwoByTwoDiagram, RotatingCaseDiagram, invertAlg, type StickeringKind } from '../../components/CubeDiagram';
import { ALG_SETS, getSet, type AlgCase, type AlgSet } from '../../data/algSets';
import { Icon } from '../../components/Icon';

// ---------------------------------------------------------------------------
// Puzzle landing screen
// ---------------------------------------------------------------------------

function CubingIcon({ event, className }: { event: string; className?: string }) {
  return <span className={clsx('cubing-icon', `event-${event}`, className)} />;
}

const PUZZLES = [
  { id: '3x3', label: '3×3', event: '333', available: true },
  { id: '2x2', label: '2×2', event: '222', available: true },
  { id: 'sq1', label: 'Square-1', event: 'sq1', available: false },
  { id: 'minx', label: 'Megaminx', event: 'minx', available: false },
  { id: 'pyram', label: 'Pyraminx', event: 'pyram', available: false },
  { id: 'skewb', label: 'Skewb', event: 'skewb', available: false },
];

function PuzzleLanding({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <PageHeader title="Algorithms" subtitle="Select a puzzle to browse algorithms." />
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
            <CubingIcon event={p.event} className="text-[64px]" />
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
// 2×2 set picker
// ---------------------------------------------------------------------------

const TWO_BY_TWO_SET_CARDS = [
  { id: 'OrtegaOLL', label: 'OLL', description: 'Ortega OLL', count: 7 },
  { id: 'OrtegaPBL', label: 'PBL', description: 'Ortega PBL', count: 6 },
  { id: 'CLL', label: 'CLL', description: 'Corners of the Last Layer', count: 42 },
  { id: 'EG1', label: 'EG-1', description: 'EG-1 (one solved bottom corner)', count: 42 },
  { id: 'EG2', label: 'EG-2', description: 'EG-2 (two solved bottom corners)', count: 42 },
];

function TwoByTwoPicker({ onSelect, onBack }: { onSelect: (setId: string) => void; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <Icon name="arrowLeft" size={14} /> Puzzles
        </button>
        <span className="text-muted">/</span>
        <span className="font-semibold">2×2</span>
      </div>
      <PageHeader title="2×2 Algorithm Sets" subtitle="Choose a set to browse and learn." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TWO_BY_TWO_SET_CARDS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="card p-6 flex flex-col items-center gap-4 hover:border-accent/50 transition-colors cursor-pointer text-center"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <CubingIcon event="222" className="text-[48px]" />
            </div>
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

function twoByTwoStickering(kind: AlgSet['kind']): StickeringKind {
  return kind === '2x2-oll' ? '2x2-oll' : 'full';
}

function rotatingStickering(kind: AlgSet['kind']): StickeringKind {
  if (kind === 'oll') return 'oll';
  if (kind === 'pll') return 'pll';
  if (kind === 'coll') return 'coll';
  if (kind === 'f2l') return 'f2l';
  if (kind === '2x2-oll') return '2x2-oll';
  return 'full';
}

function CaseImage({ c, set, size = 80 }: { c: AlgCase; set: AlgSet; size?: number }) {
  if (set.kind === 'pll') return <PllDiagram alg={c.moves} size={size} />;
  if (set.kind === 'oll') return <OllDiagram alg={c.moves} size={size} />;
  if (set.kind === 'coll') return <CollDiagram alg={c.moves} size={size} />;
  if (['2x2-oll', '2x2-pbl', 'cll', 'eg1', 'eg2'].includes(set.kind)) {
    return <TwoByTwoDiagram alg={c.moves} size={size} diagramPrefix={c.diagramPrefix} stickering={twoByTwoStickering(set.kind)} />;
  }
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
          {c.name}
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

function SlotTabs({ slotAlts }: { slotAlts: Record<string, string[]> }) {
  const slots = Object.keys(slotAlts);
  const [active, setActive] = useState(slots[0] ?? '');
  const algs = slotAlts[active] ?? [];
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-3">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={clsx(
              'px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              active === s ? 'bg-accent text-white' : 'bg-card-hover text-muted hover:text-primary',
            )}
          >
            {s}
          </button>
        ))}
      </div>
      {algs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {algs.map((a, i) => <AlgChip key={i} alg={a} />)}
        </div>
      ) : (
        <p className="text-sm text-muted italic">No algorithms on file.</p>
      )}
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
            <span className="text-sm text-muted">{c.group}</span>
          </div>
          <button onClick={onClose} className="btn-ghost text-lg leading-none px-2 py-1">✕</button>
        </div>
        <div className="flex justify-center">
          <RotatingCaseDiagram
            alg={c.moves}
            size={280}
            defaultLat={30}
            puzzle={['2x2-oll', '2x2-pbl', 'cll', 'eg1', 'eg2'].includes(set.kind) ? '2x2x2' : '3x3x3'}
            diagramPrefix={c.diagramPrefix}
            stickering={rotatingStickering(set.kind)}
          />
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
          {c.slotAlts && Object.keys(c.slotAlts).length > 0 ? (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Alternates by Slot</div>
              <SlotTabs slotAlts={c.slotAlts} />
            </>
          ) : c.alts && c.alts.length > 0 ? (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Alternates ({c.alts.length})
              </div>
              <div className="flex flex-col gap-2">
                {c.alts.map((a, i) => <AlgChip key={i} alg={a} />)}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Alternates</div>
              <p className="text-sm text-muted italic">No alternates on file.</p>
            </>
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

  if (view.screen === 'sets' && view.puzzle === '3x3') {
    return (
      <ThreeByThreePicker
        onBack={() => setView({ screen: 'puzzles' })}
        onSelect={(setId) => setView({ screen: 'cases', puzzle: view.puzzle, setId })}
      />
    );
  }

  if (view.screen === 'sets' && view.puzzle === '2x2') {
    return (
      <TwoByTwoPicker
        onBack={() => setView({ screen: 'puzzles' })}
        onSelect={(setId) => setView({ screen: 'cases', puzzle: view.puzzle, setId })}
      />
    );
  }

  // At this point view.screen must be 'cases'
  const casesView = view as { screen: 'cases'; puzzle: string; setId: string };
  return (
    <CaseBrowser
      setId={casesView.setId}
      onBack={() => setView({ screen: 'sets', puzzle: casesView.puzzle })}
    />
  );
}
