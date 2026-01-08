import { motion } from 'framer-motion';

interface VisualizerProps {
  array: number[];
  isSorted: boolean;
}

export function Visualizer({ array, isSorted }: VisualizerProps) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-end', 
      height: '300px', 
      gap: '12px',
      marginBottom: '2rem',
      padding: '20px',
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {array.map((value) => (
        <motion.div
          key={value} // Use value as key for FLIP animation if unique, or index if we want bars to just grow/shrink. 
          // Since it's a permutation 1..N, 'value' is unique and perfect for tracking the specific "card" moving around.
          layout
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          style={{
            height: `${value * 10 + 20}px`, // Scale for visibility
            width: '40px',
            backgroundColor: isSorted ? 'var(--bar-success)' : 'var(--bar-default)',
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            paddingBottom: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {value}
        </motion.div>
      ))}
    </div>
  );
}
