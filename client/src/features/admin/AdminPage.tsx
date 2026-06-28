import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, EventSelector } from '../../components/ui';
import { api, apiError } from '../../lib/api';
import { toast } from '../../store/toast';
import { generateScramble } from '../../lib/scramble';

export default function AdminPage() {
  const [event, setEvent] = useState('333');
  const [scramble, setScramble] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data as { users: number; solves: number; sessions: number; rooms: number },
  });

  async function setDaily() {
    try {
      await api.post('/admin/daily', { eventId: event, scramble: scramble || generateScramble(event), date });
      toast.success('Daily scramble set');
      setScramble('');
    } catch (e) {
      toast.error(apiError(e, 'Failed to set daily scramble'));
    }
  }

  return (
    <div>
      <PageHeader title="Admin Panel" subtitle="Manage daily scrambles and view platform stats." />

      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Users" value={stats.data?.users} />
        <StatCard label="Solves" value={stats.data?.solves} />
        <StatCard label="Sessions" value={stats.data?.sessions} />
        <StatCard label="Battle rooms" value={stats.data?.rooms} />
      </div>

      <div className="card p-6 max-w-xl">
        <h3 className="font-bold text-lg mb-4">Set daily scramble</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="label">Event</label>
            <EventSelector value={event} onChange={setEvent} className="max-w-full" />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <label className="label">Scramble (leave blank to auto-generate)</label>
        <div className="flex gap-2">
          <input className="input font-mono" value={scramble} onChange={(e) => setScramble(e.target.value)} placeholder="auto" />
          <button className="btn-ghost" onClick={() => setScramble(generateScramble(event))}>
            Generate
          </button>
        </div>
        <button className="btn-primary w-full mt-4" onClick={setDaily}>
          Save daily scramble
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="card p-5">
      <div className="text-muted text-sm">{label}</div>
      <div className="text-3xl font-bold font-mono">{value ?? '—'}</div>
    </div>
  );
}
