import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface LeaderboardEntry {
  name: string;
  score: number;
}

interface LeaderboardProps {
  currentScore?: number;
  show: boolean;
}

export function Leaderboard({ currentScore, show }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (show) {
      const apiUrl = import.meta.env.PROD ? 'https://tpo.collegeguide.me/scores' : '/api/scores';
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => setLeaderboard(data))
        .catch(error => console.error('Error fetching leaderboard:', error));
    }
  }, [show]);

  if (!show) return null;

  if (!show) return null;

  return (
    <>
      {collapsed ? (
        <div className="fixed left-4 top-20 z-50">
          <Button
            aria-label="Expand leaderboard"
            onClick={() => setCollapsed(false)}
            size="sm"
            variant="outline"
            className="shadow"
          >
            🏆 Show Leaderboard
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-4 top-20 z-40 max-w-sm"
        >
          <Card className="p-3 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base">🏆 Unemployment Leaderboard</h3>
              <Button
                aria-label="Collapse leaderboard"
                onClick={() => setCollapsed(true)}
                variant="outline"
                size="sm"
              >
                Minimize
              </Button>
            </div>

            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-2 rounded text-xs ${
                    currentScore === entry.score 
                      ? 'bg-yellow-100 border-2 border-yellow-400' 
                      : index < 3 
                      ? 'bg-green-50 border border-green-200' 
                      : index > 7 
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      {index === 0 ? '🥇' : 
                       index === 1 ? '🥈' : 
                       index === 2 ? '🥉' : 
                       index > 7 ? '💀' : `${index + 1}.`}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold truncate max-w-[10rem]">{entry.name}</span>
                        <span className="text-blue-600">{entry.score}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center italic">
                *Leaderboard shows unique best scores
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
}
