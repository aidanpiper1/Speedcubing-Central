import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { PageHeader, Badge } from '../../components/ui';
import { OllDiagram, PllDiagram, CollDiagram, F2LDiagram, RotatingCaseDiagram, invertAlg } from '../../components/CubeDiagram';
import { ALG_SETS, getSet, type AlgCase, type AlgSet } from '../../data/algSets';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <span className="text-sm text-muted">{c.group} · {c.probability}</span>
          </div>
          <button onClick={onClose} className="btn-ghost text-lg leading-none px-2 py-1">✕</button>
        </div>

        {/* Rotating viewer */}
        <div className="flex justify-center">
          <RotatingCaseDiagram alg={c.moves} size={280} defaultLat={set.kind === 'f2l' ? 15 : 30} />
        </div>

        {/* Setup algorithm */}
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Setup (apply to solved cube)</div>
          <AlgChip alg={setup} />
        </div>

        {/* Main algorithm */}
        <div>
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Main Algorithm</div>
          <AlgChip alg={c.moves} />
        </div>

        {/* Alternates */}
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

export default function AlgTrainerPage() {
  const [setId, setSetId] = useState('OLL');
  const set = getSet(setId)!;

  const groups = useMemo(() => ['All', ...Array.from(new Set(set.cases.map((c) => c.group)))], [set]);
  const [group, setGroup] = useState('All');
  const [selected, setSelected] = useState<AlgCase | null>(null);

  const handleSetChange = (id: string) => {
    setSetId(id);
    setGroup('All');
    setSelected(null);
  };

  const cases = group === 'All' ? set.cases : set.cases.filter((c) => c.group === group);

  return (
    <div>
      <PageHeader title="Algorithm Library" subtitle="Browse OLL, PLL, F2L, and COLL cases." />

      {/* Set selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ALG_SETS.map((s) => (
          <button key={s.id} onClick={() => handleSetChange(s.id)} className={setId === s.id ? 'btn-primary' : 'btn-ghost'}>
            {s.name} <span className="opacity-60">({s.cases.length})</span>
          </button>
        ))}
      </div>

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

      {/* Cases grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} set={set} onSelect={setSelected} />
        ))}
      </div>

      {selected && <CaseModal c={selected} set={set} onClose={() => setSelected(null)} />}
    </div>
  );
}
