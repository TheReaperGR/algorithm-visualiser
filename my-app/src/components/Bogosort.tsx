import { useState, useRef, useEffect } from 'react';
import { Visualizer } from './Visualizer';
import { Controls } from './Controls';
import '../index.css';

export default function Bogosort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [speed, setSpeed] = useState(100);
  const stopRef = useRef(false);

  // Initialize array
  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: 7 }, (_, i) => i + 1); // Small array for Bogosort
    // Shuffle initially just to be sure it's not sorted
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setArray(newArray);
    setIsSorted(checkSorted(newArray));
    setIsSorting(false);
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

    // Helper to delay
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    let currentArray = [...array];

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
      
      await sleep(speed);
    }

    setIsSorted(true);
    setIsSorting(false);
  };

  const stopSort = () => {
    if (isSorting) {
      stopRef.current = true;
    }
  };

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.5rem' }}>Bogosort Visualizer</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        "Quantum computing? No. Infinite patience."
      </p>

      <div className="card">
        <Visualizer array={array} isSorted={isSorted} />
        <Controls 
          onStart={startSort} 
          onStop={stopSort} 
          onReset={generateArray} 
          isSorting={isSorting} 
          isSorted={isSorted}
          speed={speed}
          setSpeed={handleSpeedChange}
          startLabel="Start Bogosort"
        />
      </div>
    </div>
  );
}
