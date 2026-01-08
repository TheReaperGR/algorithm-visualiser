
interface ControlsProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  isSorting: boolean;
  isSorted: boolean;
  speed: number;
  setSpeed: (val: number) => void;
}

export function Controls({ 
  onStart, 
  onStop, 
  onReset, 
  isSorting, 
  isSorted,
  speed,
  setSpeed,
  startLabel = "Start Sorting"
}: ControlsProps & { startLabel?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!isSorting && !isSorted && (
          <button onClick={onStart} style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            {startLabel}
          </button>
        )}
        
        {isSorting && (
          <button onClick={onStop} style={{ backgroundColor: '#ef4444', color: 'white' }}>
            Stop
          </button>
        )}

        <button onClick={onReset} disabled={isSorting}>
          Shuffle New Array
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Speed (Delay: {speed}ms)</span>
        <input 
          type="range" 
          min="0" 
          max="500" 
          step="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isSorting}
        />
      </div>
    </div>
  );
}
