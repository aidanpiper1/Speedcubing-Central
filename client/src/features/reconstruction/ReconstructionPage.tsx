import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { getEvent, type ReconstructionDTO } from '@scc/shared';
import { PageHeader, EventSelector, EmptyState, Skeleton } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { ReconstructionPlayer, type ReconstructionHandle, type ReconstructionProgress } from '../../components/CubeDiagram';
import { api, apiError } from '../../lib/api';
import { getScramble } from '../../lib/scramble';
import { copyText } from '../../lib/clipboard';
import { useAuth } from '../../store/auth';
import { toast } from '../../store/toast';

// Maps a WCA/unofficial event id to the cubing.js puzzle identifier used by
// <twisty-player puzzle="...">. BF/OH events share their base puzzle's shape.
const EVENT_TO_PUZZLE: Record<string, string> = {
  '222': '2x2x2', '333': '3x3x3', '444': '4x4x4', '555': '5x5x5', '666': '6x6x6', '777': '7x7x7',
  '333oh': '3x3x3', '333bf': '3x3x3', '444bf': '4x4x4', '555bf': '5x5x5',
  minx: 'megaminx', pyram: 'pyraminx', clock: 'clock', skewb: 'skewb', sq1: 'square1',
  kilominx: 'kilominx', fto: 'fto', redi_cube: 'redi_cube',
};
function puzzleForEvent(eventId: string): string {
  return EVENT_TO_PUZZLE[eventId] ?? '3x3x3';
}

const SPEEDS = [0.5, 1, 1.5, 2];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReconstructionPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('333');
  const [scramble, setScramble] = useState('');
  const [solution, setSolution] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loadingShared, setLoadingShared] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [mine, setMine] = useState<ReconstructionDTO[]>([]);
  const [minePending, setMinePending] = useState(false);

  const [progress, setProgress] = useState<ReconstructionProgress>({ index: 0, total: 0, playing: false, fraction: 0 });
  const [speed, setSpeed] = useState(1);
  const [scrambling, setScrambling] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleRef = useRef<ReconstructionHandle>(null);

  // Load a saved reconstruction by id — this is the shareable-by-link path.
  useEffect(() => {
    if (!id) return;
    setLoadingShared(true);
    setNotFound(false);
    api
      .get<ReconstructionDTO>(`/reconstructions/${id}`)
      .then((r) => {
        setTitle(r.data.title);
        setEventId(r.data.eventId);
        setScramble(r.data.scramble);
        setSolution(r.data.solution);
        setSavedId(r.data.id);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingShared(false));
  }, [id]);

  // Prefill from an ad-hoc share link, e.g. /reconstruction?scramble=...&solution=...
  useEffect(() => {
    if (id) return;
    const s = searchParams.get('scramble');
    const sol = searchParams.get('solution');
    if (!s && !sol) return;
    if (s) setScramble(s);
    if (sol) setSolution(sol);
    const ev = searchParams.get('event');
    if (ev) setEventId(ev);
    const t = searchParams.get('title');
    if (t) setTitle(t);
    // Only ever consume the initial URL once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMine = useCallback(() => {
    if (!user) {
      setMine([]);
      return;
    }
    setMinePending(true);
    api
      .get<ReconstructionDTO[]>('/reconstructions')
      .then((r) => setMine(r.data))
      .catch(() => {})
      .finally(() => setMinePending(false));
  }, [user]);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const canPlay = scramble.trim().length > 0 && solution.trim().length > 0;
  const puzzle = puzzleForEvent(eventId);
  const moves = useMemo(() => solution.trim().split(/\s+/).filter(Boolean), [solution]);

  const handleGenerateScramble = async () => {
    setScrambling(true);
    try {
      setScramble(await getScramble(eventId));
    } finally {
      setScrambling(false);
    }
  };

  const handleShare = () => {
    const origin = window.location.origin;
    if (savedId) {
      copyText(`${origin}/reconstruction/${savedId}`, 'Share link copied');
      return;
    }
    const params = new URLSearchParams();
    params.set('scramble', scramble);
    params.set('solution', solution);
    params.set('event', eventId);
    if (title) params.set('title', title);
    copyText(`${origin}/reconstruction?${params.toString()}`, 'Share link copied');
  };

  const handleSave = async () => {
    if (!user || !canPlay) return;
    setSaving(true);
    try {
      const { data } = await api.post<ReconstructionDTO>('/reconstructions', { title, eventId, scramble, solution });
      setSavedId(data.id);
      toast.success('Reconstruction saved');
      navigate(`/reconstruction/${data.id}`, { replace: true });
      fetchMine();
    } catch (e) {
      toast.error(apiError(e, 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSaved = (r: ReconstructionDTO) => {
    setTitle(r.title);
    setEventId(r.eventId);
    setScramble(r.scramble);
    setSolution(r.solution);
    setSavedId(r.id);
    navigate(`/reconstruction/${r.id}`);
  };

  const handleDelete = async (r: ReconstructionDTO, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${r.title || 'Untitled'}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/reconstructions/${r.id}`);
      setMine((m) => m.filter((x) => x.id !== r.id));
      if (savedId === r.id) {
        setSavedId(null);
        navigate('/reconstruction', { replace: true });
      }
    } catch (e2) {
      toast.error(apiError(e2, 'Failed to delete'));
    }
  };

  return (
    <div>
      <PageHeader title="Reconstruction" subtitle="3D playback of any scramble + solution, move by move." />

      {notFound && (
        <EmptyState title="Reconstruction not found" hint="This link may be invalid, or the reconstruction was deleted." />
      )}

      {!notFound && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-6 min-w-0">
            {loadingShared ? (
              <div className="card p-5 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10" />
                <Skeleton className="h-20" />
              </div>
            ) : (
              <div className="card p-5 space-y-4">
                <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className="label">Title (optional)</label>
                    <input
                      className="input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Sub-10 single"
                      maxLength={80}
                    />
                  </div>
                  <div>
                    <label className="label">Event</label>
                    <EventSelector value={eventId} onChange={setEventId} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label mb-0">Scramble</label>
                    <button
                      onClick={handleGenerateScramble}
                      disabled={scrambling}
                      className="text-xs text-accent font-semibold flex items-center gap-1 hover:text-accent-hover disabled:opacity-50"
                    >
                      <Icon name="refresh" size={13} className={scrambling ? 'animate-spin' : ''} />
                      Generate
                    </button>
                  </div>
                  <textarea
                    className="input font-mono text-sm"
                    rows={2}
                    value={scramble}
                    onChange={(e) => setScramble(e.target.value)}
                    placeholder="R U R' U' F2 ..."
                  />
                </div>

                <div>
                  <label className="label">Solution</label>
                  <textarea
                    className="input font-mono text-sm"
                    rows={4}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Paste or type the moves that solve the scramble above..."
                  />
                </div>
              </div>
            )}

            {canPlay ? (
              <div className="card p-6 flex flex-col items-center gap-5">
                {title && <h2 className="font-bold text-lg text-center">{title}</h2>}

                <ReconstructionPlayer
                  ref={handleRef}
                  scramble={scramble}
                  solution={solution}
                  puzzle={puzzle}
                  size={320}
                  onProgress={setProgress}
                />

                <div className="flex items-center gap-2">
                  <button className="btn-ghost !p-2" title="Jump to start" onClick={() => handleRef.current?.jumpToStart()}>
                    <Icon name="skipBack" size={18} />
                  </button>
                  <button className="btn-ghost !p-2" title="Previous move" onClick={() => handleRef.current?.stepBackward()}>
                    <Icon name="arrowLeft" size={18} />
                  </button>
                  <button
                    className="btn-primary !px-5 !py-2.5"
                    title={progress.playing ? 'Pause' : 'Play'}
                    onClick={() => handleRef.current?.togglePlay()}
                  >
                    <Icon name={progress.playing ? 'pause' : 'play'} size={20} />
                  </button>
                  <button className="btn-ghost !p-2" title="Next move" onClick={() => handleRef.current?.stepForward()}>
                    <Icon name="arrowRight" size={18} />
                  </button>
                  <button className="btn-ghost !p-2" title="Jump to end" onClick={() => handleRef.current?.jumpToEnd()}>
                    <Icon name="skipForward" size={18} />
                  </button>
                </div>

                <div className="w-full max-w-md flex items-center gap-3">
                  <span className="text-xs text-muted font-mono w-12 text-right shrink-0">
                    {progress.index}/{progress.total}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={Math.round(progress.fraction * 1000)}
                    onChange={(e) => handleRef.current?.seekFraction(Number(e.target.value) / 1000)}
                    className="flex-1 accent-accent"
                  />
                  <select
                    className="input !w-auto !py-1 text-xs shrink-0"
                    value={speed}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setSpeed(s);
                      handleRef.current?.setTempo(s);
                    }}
                  >
                    {SPEEDS.map((s) => (
                      <option key={s} value={s}>
                        {s}×
                      </option>
                    ))}
                  </select>
                </div>

                {moves.length > 0 && (
                  <div className="w-full max-h-28 overflow-y-auto flex flex-wrap gap-1.5 justify-center px-1">
                    {moves.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => handleRef.current?.jumpToMoveIndex(i)}
                        className={clsx(
                          'font-mono text-xs px-2 py-1 rounded transition-colors',
                          i === progress.index
                            ? 'bg-accent text-white'
                            : i < progress.index
                              ? 'bg-card-hover text-muted'
                              : 'bg-card-hover text-gray-300 hover:bg-border',
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-border w-full justify-center flex-wrap">
                  <button className="btn-ghost" onClick={handleShare}>
                    <Icon name="copy" size={16} />
                    Share
                  </button>
                  {user ? (
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                      <Icon name="check" size={16} />
                      {savedId ? 'Save as new' : saving ? 'Saving…' : 'Save to my account'}
                    </button>
                  ) : (
                    <span className="text-xs text-muted">
                      <Link to="/login" className="text-accent font-semibold">
                        Log in
                      </Link>{' '}
                      to save reconstructions to your account.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState title="Enter a scramble and solution" hint="Fill in both fields above to load the 3D playback." />
            )}
          </div>

          {user && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">My Reconstructions</h3>
              {minePending && (
                <div className="space-y-2">
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                </div>
              )}
              {!minePending && mine.length === 0 && <p className="text-sm text-muted">Nothing saved yet.</p>}
              <div className="space-y-2">
                {mine.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleLoadSaved(r)}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg border transition-colors flex items-start justify-between gap-2',
                      savedId === r.id ? 'border-accent bg-accent/10' : 'border-border hover:bg-card-hover',
                    )}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{r.title || 'Untitled'}</div>
                      <div className="text-xs text-muted mt-0.5">
                        {getEvent(r.eventId)?.name ?? r.eventId} · {formatDate(r.createdAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(r, e)}
                      className="text-muted hover:text-red-400 shrink-0"
                      title="Delete"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
