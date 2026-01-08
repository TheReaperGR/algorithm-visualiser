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
  }
};

const SlotMachineBogosort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [speed, setSpeed] = useState(100);
  const stopRef = useRef(false);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    if (isSorting) return;
    // 4 Values, using 1-9 for slot aesthetics
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

  const startSort = async () => {
    if (isSorting || isSorted) return;
    setIsSorting(true);
    stopRef.current = false;

    let currentArray = [...array];

    // Bogosort Loop
    while (!checkSorted(currentArray)) {
      if (stopRef.current) {
        setIsSorting(false);
        return;
      }

      // Shuffle logic
      for (let i = currentArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentArray[i], currentArray[j]] = [currentArray[j], currentArray[i]];
      }

      setArray([...currentArray]);
      
      // Delay
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
      {/* Inject Keyframes for flicker */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); text-shadow: 0 0 20px #ffff00; }
        }
      `}</style>
      
      <h1 style={{ color: '#d4af37', textShadow: '2px 2px 0 #000' }}>🎰 Bogo Slots 🎰</h1>
      
      <div style={styles.machineContainer}>
        {isSorted && (
          <div style={styles.bigWin}>
            BIG WIN!<br/>
            <span style={{fontSize: '2rem', color: '#fff'}}>SORTED!</span>
          </div>
        )}

        <div style={styles.reelContainer}>
          {array.map((val, idx) => (
            <div key={idx} style={styles.column}>
              {/* Top Row (Prev Value Mock) */}
              <div style={styles.cell}>{(val + 1) % 9 + 1}</div>
              
              {/* Middle Row (Actual Value - Payline) */}
              <div style={{...styles.cell, ...styles.payline}}>
                {val}
              </div>
              
              {/* Bottom Row (Next Value Mock) */}
              <div style={styles.cell}>{(val + 7) % 9 + 1}</div>
            </div>
          ))}
        </div>

        <Controls 
          onStart={startSort}
          onStop={stopSort}
          onReset={generateArray}
          isSorting={isSorting}
          isSorted={isSorted}
          speed={speed}
          setSpeed={setSpeed}
          startLabel="SPIN!"
        />
      </div>
    </div>
  );
};

export default SlotMachineBogosort;
