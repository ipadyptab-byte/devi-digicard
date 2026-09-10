import React from 'react';
import { motion } from 'motion/react';

const GoldDust: React.FC = () => {
  // Generate a random array of particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: p.opacity, 
            y: p.top, 
            x: p.left,
            scale: 0 
          }}
          animate={{
            y: [p.top, `calc(${p.top} - 100px)`, `calc(${p.top} - 200px)`],
            x: [
              p.left, 
              `calc(${p.left} + ${Math.random() * 40 - 20}px)`, 
              `calc(${p.left} + ${Math.random() * 40 - 20}px)`
            ],
            opacity: [0, p.opacity, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-[#b8860b]"
          style={{
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px rgba(184, 134, 11, 0.8)`,
          }}
        />
      ))}
    </div>
  );
};

export default GoldDust;
