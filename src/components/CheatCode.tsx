import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CheatCodeProps {
  onCheatActivated: (cheat: string) => void;
}

const CHEAT_CODES = {
  'kartick': 'GOD MODE: All criteria met!',
  'tpo': 'Placement coordinator is now your friend',
  'cgpa': 'CGPA boosted to 10.0',
  'referral': 'Unlimited referrals unlocked',
  'leetcode': 'LeetCode God Mode activated',
  'vit': 'VIT Pride activated!'
};

export function CheatCode({ onCheatActivated }: CheatCodeProps) {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        setInput((prev) => (prev + e.key.toLowerCase()).slice(-10));
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  useEffect(() => {
    Object.entries(CHEAT_CODES).forEach(([code, msg]) => {
      if (input.endsWith(code)) {
        setMessage(msg);
        onCheatActivated(code);
        setInput('');
        
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    });
  }, [input, onCheatActivated]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-2xl p-8 border-4 border-yellow-400">
            <p className="text-2xl text-center">🎮 CHEAT ACTIVATED!</p>
            <p className="text-xl text-center mt-2">{message}</p>
            <p className="text-sm text-center mt-4 opacity-80">
              (Just kidding, cheating won't help in real placements)
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
