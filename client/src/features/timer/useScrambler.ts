import { useCallback, useEffect, useRef, useState } from 'react';
import { getScramble } from '../../lib/scramble';

// Manages the current scramble and prefetches the next one so the wait for
// slow random-state events (4x4+) is hidden while the user is solving.
export function useScrambler(eventId: string) {
  const [scramble, setScramble] = useState('');
  const [randomState, setRandomState] = useState(true);
  const [loading, setLoading] = useState(true);
  const nextRef = useRef<Promise<{ scramble: string; randomState: boolean }> | null>(null);
  const reqId = useRef(0);

  const prefetch = useCallback(() => {
    nextRef.current = getScramble(eventId);
  }, [eventId]);

  // Fetch a fresh current scramble (and queue a next one).
  const refresh = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    const result = await getScramble(eventId);
    if (id === reqId.current) {
      setScramble(result.scramble);
      setRandomState(result.randomState);
      setLoading(false);
      prefetch();
    }
  }, [eventId, prefetch]);

  // Advance to the prefetched next scramble (instant), then queue another.
  const advance = useCallback(async () => {
    const id = ++reqId.current;
    const pending = nextRef.current ?? getScramble(eventId);
    setLoading(true);
    const result = await pending;
    if (id === reqId.current) {
      setScramble(result.scramble);
      setRandomState(result.randomState);
      setLoading(false);
      prefetch();
    }
  }, [eventId, prefetch]);

  // (Re)initialise whenever the event changes.
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return { scramble, randomState, loading, refresh, advance };
}
