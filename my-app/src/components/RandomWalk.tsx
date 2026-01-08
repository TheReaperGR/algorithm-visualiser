import { useEffect, useRef, useState } from 'react';
import type { Point } from '../types';
import '../index.css'; // Ensure global styles are available, though usually imported in App

// Canvas dimensions and step size for each move
const WIDTH = 600;
const HEIGHT = 400;
const STEP = 5;

const RandomWalk = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [path, setPath] = useState<Point[]>([{ x: WIDTH / 2, y: HEIGHT / 2 }]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50); // Add speed control

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPath(prev => {
        const current = prev[prev.length - 1];
        const direction = Math.floor(Math.random() * 4);
        
        let x = current.x;
        let y = current.y;
        
        if (direction === 0) y -= STEP;
        if (direction === 1) x += STEP;
        if (direction === 2) y += STEP;
        if (direction === 3) x -= STEP;
        
        // Bounce logic
        if (x < 0) x = -x;
        if (x > WIDTH) x = WIDTH - (x - WIDTH);
        if (y < 0) y = -y;
        if (y > HEIGHT) y = HEIGHT - (y - HEIGHT);
        
        x = Math.max(0, Math.min(WIDTH, x));
        y = Math.max(0, Math.min(HEIGHT, y));
        
        return [...prev, { x, y }];
      });
    }, speed); // Use dynamic speed

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw background (optional, for card feeling)
    // ctx.fillStyle = '#1e293b'; 
    // ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.strokeStyle = '#10b981'; // Success green from theme
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
    
    const last = path[path.length - 1];
    ctx.fillStyle = '#ef4444'; // Red from theme
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [path]);

  const reset = () => {
    setPath([{ x: WIDTH / 2, y: HEIGHT / 2 }]);
    setIsRunning(false);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.5rem' }}>Random Walk</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        "Not all those who wander are lost."
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ 
          border: '1px solid #334155', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            style={{ display: 'block', backgroundColor: '#0f172a' }}
          />
        </div>

        <p className="stats" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          Steps: {path.length - 1}
        </p>

        <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={() => setIsRunning(!isRunning)} style={{ 
               backgroundColor: isRunning ? '#ef4444' : 'var(--accent)', 
               color: 'white',
               minWidth: '100px'
             }}>
              {isRunning ? 'Stop' : 'Start Walk'}
            </button>
            <button onClick={reset}>Reset</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Speed ({speed}ms)</span>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomWalk;
