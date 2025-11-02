import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ConfettiProps {
  show: boolean;
  type: 'celebration' | 'tears';
}

export function Confetti({ show, type }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, rotate: particle.rotation, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: particle.rotation + 720,
            opacity: 0
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: 'linear'
          }}
          className="absolute"
        >
          {type === 'celebration' ? (
            <div className={`w-3 h-3 ${
              Math.random() > 0.5 ? 'bg-yellow-400' : 
              Math.random() > 0.5 ? 'bg-blue-400' : 
              'bg-red-400'
            } rounded-full`} />
          ) : (
            <div className="text-2xl">💧</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
