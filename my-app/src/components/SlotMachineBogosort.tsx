import { useState, useEffect, useRef } from 'react';
import { Controls } from './Controls';
import '../index.css';

// Styling for the slot machine
const styles = {
  machineContainer: {
    backgroundColor: '#1a1a1a',
    border: '10px solid #d4af37', // Gold border
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.8)',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  reelContainer: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#000',
    borderRadius: '10px',
    border: '2px solid #555',
    marginBottom: '20px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0px',
    width: '80px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
  },
  cell: {
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1px solid #ddd'
  },
  payline: {
    backgroundColor: '#fff7cc', // Light yellow highlight
    borderTop: '2px solid #d4af37',
    borderBottom: '2px solid #d4af37',
    color: '#d00000',
    fontSize: '2.5rem',
    transform: 'scale(1.1)',
    zIndex: 10,
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
  },
  bigWin: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '4rem',
    fontWeight: '900',
    color: '#ffd700',
    textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
    animation: 'flicker 0.5s infinite alternate',
    zIndex: 100,
    pointerEvents: 'none' as const,
    textAlign: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '20px',
    borderRadius: '10px',
    border: '5px solid #fff'
  },
  modePanel: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '10px',
    backgroundColor: '#333',
    padding: '5px',
    borderRadius: '8px'
  }
};

const SlotMachineBogosort = () => {
  const [slotSize, setSlotSize] = useState(4);
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const stopRef = useRef(false);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
    setIsSorted(false);
    setArray(newArray);
  };

  const checkSorted = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  };

  const shuffleOnce = (currentArray: number[]) => {
      const arr = [...currentArray];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
  }

  const handleManualSpin = () => {
    if (isSorting || isSorted) return;
    
    // Just one shuffle
    setIsSorting(true);
    // Add a tiny artificial delay for effect 
    setTimeout(() => {
        const nextArray = shuffleOnce(array);
        setArray(nextArray);
        if (checkSorted(nextArray)) {
            setIsSorted(true);
        }
        setIsSorting(false);
    }, 200);
  };

  const startAutoSort = async () => {
    if (isSorting || isSorted) return;
    setIsSorting(true);
    stopRef.current = false;

    let currentArray = [...array];

    while (!checkSorted(currentArray)) {
      if (stopRef.current) {
        setIsSorting(false);
        return;
      }

      currentArray = shuffleOnce(currentArray);
      setArray([...currentArray]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setIsSorted(true);
    setIsSorting(false);
  };

  const stopSort = () => {
    stopRef.current = true;
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes flicker {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); text-shadow: 0 0 20px #ffff00; }
        }
      `}</style>
      
      <h1 style={{ color: '#d4af37', textShadow: '2px 2px 0 #000' }}>🎰 Bogo Slots 🎰</h1>
      
      <div style={styles.machineContainer}>
        {/* BIG WIN OVERLAY */}
        {isSorted && (
          <div style={styles.bigWin}>
            BIG WIN!<br/>
            <span style={{fontSize: '2rem', color: '#fff'}}>SORTED!</span>
          </div>
        )}

        {/* CONTROLS BAR (Mode + Size) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', backgroundColor: '#333', padding: '10px', borderRadius: '10px' }}>
             {/* MODE SELECTOR */}
             <div style={styles.modePanel}>
                <button 
                    onClick={() => setMode('auto')} 
                    style={{ 
                        backgroundColor: mode === 'auto' ? '#d4af37' : '#555',
                        color: mode === 'auto' ? '#000' : '#ccc',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Auto
                </button>
                <button 
                    onClick={() => setMode('manual')} 
                    style={{ 
                        backgroundColor: mode === 'manual' ? '#d4af37' : '#555',
                        color: mode === 'manual' ? '#000' : '#ccc',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Manual
                </button>
             </div>

             {/* SIZE SLIDER */}
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                <span>Slots: {slotSize}</span>
                <input 
                    type="range" 
                    min="4" 
                    max="9" 
                    value={slotSize} 
                    onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setSlotSize(newSize);
                        // Regenerate array immediately when size changes
                        const newArray = Array.from({ length: newSize }, () => Math.floor(Math.random() * 9) + 1);
                        setIsSorted(false);
                        setArray(newArray);
                    }}
                    disabled={isSorting}
                />
             </div>
        </div>

        {/* REELS */}
        <div style={styles.reelContainer}>
          {array.map((val, idx) => (
            <div key={idx} style={styles.column}>
              <div style={styles.cell}>{(val + 1) % 9 + 1}</div>
              
              {/* Middle Row with Blur Effect */}
              <div style={{
                  ...styles.cell, 
                  ...styles.payline,
                  filter: (isSorting && mode === 'manual') ? 'blur(4px)' : 'blur(0px)',
                  transition: 'filter 0.1s ease-out'
              }}>
                {val}
              </div>
              
              <div style={styles.cell}>{(val + 7) % 9 + 1}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        {/* We wrap Controls or just use custom buttons for Manual Mode to simplify UX */}
        {mode === 'auto' ? (
            <Controls 
              onStart={startAutoSort}
              onStop={stopSort}
              onReset={generateArray}
              isSorting={isSorting}
              isSorted={isSorted}
              speed={speed}
              setSpeed={setSpeed}
              startLabel="AUTO SPIN!"
            />
        ) : (
             <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={handleManualSpin} 
                        disabled={isSorted || isSorting}
                        style={{ 
                            backgroundColor: '#d00000', 
                            color: 'white', 
                            fontSize: '1.2rem',
                            padding: '10px 30px',
                            border: '4px solid #fff'
                        }}
                    >
                        {isSorting ? '...' : (isSorted ? 'WINNER!' : 'SPIN ONCE')}
                    </button>
                    <button onClick={generateArray}>Reset</button>
                 </div>
                 <span style={{color: '#999'}}>Click to shuffle once. Good luck!</span>
             </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachineBogosort;
