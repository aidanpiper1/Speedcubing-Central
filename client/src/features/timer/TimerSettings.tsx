import { Modal } from '../../components/Modal';
import { useSettings, type Sq1ColorScheme } from '../../store/settings';
import clsx from 'clsx';

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-10 h-6 rounded-full transition-colors shrink-0',
        checked ? 'bg-accent' : 'bg-card-hover',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform',
          checked && 'translate-x-4',
        )}
      />
    </button>
  );
}

function Row({ label, hint, children, disabled }: { label: string; hint?: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div className={clsx('flex items-center justify-between gap-4 py-2.5 border-b border-border/60 last:border-0', disabled && 'opacity-50')}>
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const selectCls = 'input max-w-[150px] py-1.5';

export function TimerSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSettings();

  return (
    <Modal open={open} onClose={onClose} title="Timer Settings" size="md">
      <div className="space-y-0.5">
        <Row label="Inspection" hint="15-second WCA inspection before each solve">
          <Toggle checked={s.inspection} onChange={(v) => s.set({ inspection: v })} />
        </Row>

        <Row label="Inspection counting" hint="Count down from 15 or up from 0" disabled={!s.inspection}>
          <select
            className={selectCls}
            disabled={!s.inspection}
            value={s.inspectionDirection}
            onChange={(e) => s.set({ inspectionDirection: e.target.value as 'down' | 'up' })}
          >
            <option value="down">Count down</option>
            <option value="up">Count up</option>
          </select>
        </Row>

        <Row label="Inspection voice alerts" hint='Speaks "8 seconds" and "12 seconds"' disabled={!s.inspection}>
          <Toggle checked={s.inspectionVoice} disabled={!s.inspection} onChange={(v) => s.set({ inspectionVoice: v })} />
        </Row>

        <Row label="Time entry" hint="Spacebar/touch timing or type your times">
          <select className={selectCls} value={s.entryMode} onChange={(e) => s.set({ entryMode: e.target.value as 'keyboard' | 'typing' })}>
            <option value="keyboard">Keyboard / touch</option>
            <option value="typing">Type times</option>
          </select>
        </Row>

        <Row label="Hold to start" hint="Require holding before the timer arms">
          <Toggle checked={s.holdToStart} onChange={(v) => s.set({ holdToStart: v })} />
        </Row>

        <Row label="Hold duration" hint="How long to hold before the timer turns green" disabled={!s.holdToStart}>
          <select
            className={selectCls}
            disabled={!s.holdToStart}
            value={s.holdDuration}
            onChange={(e) => s.set({ holdDuration: Number(e.target.value) })}
          >
            <option value={300}>0.3 s</option>
            <option value={550}>0.55 s</option>
            <option value={800}>0.8 s</option>
            <option value={1000}>1.0 s</option>
          </select>
        </Row>

        <Row label="Timer update" hint="Precision shown while the timer is running">
          <select className={selectCls} value={s.timerUpdate} onChange={(e) => s.set({ timerUpdate: e.target.value as never })}>
            <option value="centiseconds">0.00 (centiseconds)</option>
            <option value="deciseconds">0.0 (deciseconds)</option>
            <option value="seconds">0 (seconds)</option>
            <option value="hidden">Hidden while solving</option>
          </select>
        </Row>

        <Row label="Solve precision" hint="Decimals shown in the solves list & stats">
          <select className={selectCls} value={s.solvePrecision} onChange={(e) => s.set({ solvePrecision: Number(e.target.value) as 2 | 3 })}>
            <option value={2}>0.00</option>
            <option value={3}>0.000</option>
          </select>
        </Row>

        <Row label="Start sound" hint="Beep when the timer starts">
          <Toggle checked={s.startSound} onChange={(v) => s.set({ startSound: v })} />
        </Row>

        <div className="pt-3 mt-1">
          <div className="label">Square-1</div>
          <Row label="Color scheme" hint="Top color / bottom color of your physical puzzle">
            <select
              className={selectCls}
              value={s.sq1ColorScheme}
              onChange={(e) => s.set({ sq1ColorScheme: e.target.value as Sq1ColorScheme })}
            >
              <option value="white/yellow">White / Yellow</option>
              <option value="yellow/white">Yellow / White</option>
              <option value="black/white">Black / White</option>
              <option value="white/black">White / Black</option>
              <option value="black/yellow">Black / Yellow</option>
              <option value="yellow/black">Yellow / Black</option>
            </select>
          </Row>
        </div>

        <div className="pt-3 mt-1">
          <div className="label">Stats table columns</div>
          <Row label="Show BPA" hint="Best possible average of the current in-progress average">
            <Toggle checked={s.showBPA} onChange={(v) => s.set({ showBPA: v })} />
          </Row>
          <Row label="Show WPA" hint="Worst possible average">
            <Toggle checked={s.showWPA} onChange={(v) => s.set({ showWPA: v })} />
          </Row>
          <Row label="Show session-best target" hint="Single needed to beat your session best">
            <Toggle checked={s.showTarget} onChange={(v) => s.set({ showTarget: v })} />
          </Row>
        </div>
      </div>
    </Modal>
  );
}
