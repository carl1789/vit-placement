import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Skull, Zap, Target } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'skull' | 'zap' | 'target';
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const icons = {
    trophy: Trophy,
    skull: Skull,
    zap: Zap,
    target: Target
  };

  const Icon = icons[achievement.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.5 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-2xl p-4 min-w-[300px] border-4 border-yellow-600">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs opacity-90">🏆 ACHIEVEMENT UNLOCKED</p>
            <p className="text-xl">{achievement.title}</p>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const achievements: Record<string, Achievement> = {
  firstBlood: {
    id: 'firstBlood',
    title: 'First Blood',
    description: 'Got rejected instantly. Impressive speed!',
    icon: 'skull'
  },
  survivor: {
    id: 'survivor',
    title: 'Survivor',
    description: 'Dodged 5 companies. Service-based material!',
    icon: 'target'
  },
  dreamChaser: {
    id: 'dreamChaser',
    title: 'Dream Chaser',
    description: 'Dodged 10 companies. You have potential!',
    icon: 'zap'
  },
  placementKing: {
    id: 'placementKing',
    title: 'Placement Royalty',
    description: 'Dodged 15 companies. FAANG incoming!',
    icon: 'trophy'
  },
  legend: {
    id: 'legend',
    title: 'VIT Legend',
    description: 'Dodged 20+ companies. You broke the system!',
    icon: 'trophy'
  },
  massReject: {
    id: 'massReject',
    title: 'Mass Recruiter Victim',
    description: 'Hit TCS/Infosys/Wipro. Classic VITian move.',
    icon: 'skull'
  }
};
