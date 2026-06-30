import { Router } from 'express';
import { getScramble } from '../scramble.js';
import { EVENT_IDS } from '@scc/shared';

const router = Router();

router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  if (!EVENT_IDS.includes(eventId)) {
    res.status(400).json({ error: 'Unknown event' });
    return;
  }
  const result = await getScramble(eventId);
  res.json(result);
});

export default router;
