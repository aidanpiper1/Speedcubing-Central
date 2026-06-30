import { useCallback, useEffect, useRef, useState } from 'react';
import { getScramble } from '../../lib/scramble';

// Manages the current scramble and prefetches the next one so the wait for
// slow random-state events (4x4+) is hidden while the user is solving.
export function useScrambler(eventId: string) {
  const [scramble, setScramble] = useState('');
  const [loading, setLoading] = useState(true);
  const nextRef = useRef<Promise<string> | null>(null);
  const reqId = useRef(0);

  const prefetch = useCallback(() => {
    nextRef.current = getScramble(eventId);
  }, [eventId]);

  // Fetch a fresh current scramble (and queue a next one).
  const refresh = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    const s = await getScramble(eventId);
    if (id === reqId.current) {
      setScramble(s);
      setLoading(false);
      prefetch();
    }
  }, [eventId, prefetch]);

  // Advance to the prefetched next scramble (instant), then queue another.
  const advance = useCallback(async () => {
    const id = ++reqId.current;
    const pending = nextRef.current ?? getScramble(eventId);
    setLoading(true);
    const s = await pending;
    if (id === reqId.current) {
      setScramble(s);
      setLoading(false);
      prefetch();
    }
  }, [eventId, prefetch]);

  // (Re)initialise whenever the event changes.
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return { scramble, loading, refresh, advance };
}
