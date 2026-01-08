import { useState, useRef, useEffect } from "react";
import { Visualizer } from "./Visualizer";
import { Controls } from "./Controls";
import "../index.css";

const BubbleSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const stopRef = useRef(false);

  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    if (isSorting) return;
    // Generate unique values 1..15
    const newArray = Array.from({ length: 15 }, (_, i) => i + 1);
    
    // Shuffle
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    setArray(newArray);
    setIsSorted(false);
    setIsSorting(false);
  };

  const startSort = async () => {
    if (isSorting || isSorted) return;
    setIsSorting(true);
    stopRef.current = false;
    
    const sortedArr = [...array];
    const n = sortedArr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (stopRef.current) {
                setIsSorting(false);
                return;
            }

            if (sortedArr[j] > sortedArr[j + 1]) {
                const temp = sortedArr[j];
                sortedArr[j] = sortedArr[j + 1];
                sortedArr[j + 1] = temp;
                swapped = true;
                setArray([...sortedArr]);
                await new Promise((resolve) => setTimeout(resolve, speed));
            }
        }
        if (!swapped) break;
    }

    setIsSorted(true);
    setIsSorting(false);
  };

  const stopSort = () => {
    stopRef.current = true;
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.5rem' }}>Bubble Sort</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        "Determined, but not efficient."
      </p>

      <div className="card">
        <Visualizer array={array} isSorted={isSorted} />
        <Controls 
          onStart={startSort}
          onStop={stopSort}
          onReset={generateRandomArray}
          isSorting={isSorting}
          isSorted={isSorted}
          speed={speed}
          setSpeed={setSpeed}
          startLabel="Start Bubble Sort"
        />
      </div>
    </div>
  );
};

export default BubbleSort;
