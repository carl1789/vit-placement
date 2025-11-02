import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Zap, Heart, Skull } from 'lucide-react';

export interface RandomEvent {
  id: string;
  message: string;
  type: 'good' | 'bad' | 'info' | 'chaos';
  icon: 'alert' | 'zap' | 'heart' | 'skull';
}

const events: RandomEvent[] = [
  {
    id: 'cgpa-drop',
    message: 'BREAKING: Your CGPA just dropped by 0.1!',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'linkedin-post',
    message: 'Someone posted "Grateful to announce..." on LinkedIn',
    type: 'chaos',
    icon: 'alert'
  },
  {
    id: 'placement-cell',
    message: 'Placement Cell: "Dress code violation detected!"',
    type: 'bad',
    icon: 'alert'
  },
  {
    id: 'referral',
    message: 'Your senior ignored your referral request!',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'leetcode',
    message: 'LeetCode streak broken! Interview chances -50%',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'resume',
    message: 'Grammar mistake found in resume!',
    type: 'bad',
    icon: 'alert'
  },
  {
    id: 'wifi',
    message: 'VIT WiFi disconnected during online assessment!',
    type: 'chaos',
    icon: 'skull'
  },
  {
    id: 'attendance',
    message: 'Attendance Warning: 74.9% (Need 75%)',
    type: 'bad',
    icon: 'alert'
  },
  {
    id: 'backlog',
    message: 'Previous semester backlog detected!',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'tpo-call',
    message: 'TPO wants to see you immediately!',
    type: 'chaos',
    icon: 'alert'
  },
  {
    id: 'friend-placed',
    message: 'Your friend got placed at Google (40 LPA)',
    type: 'chaos',
    icon: 'heart'
  },
  {
    id: 'github',
    message: 'Recruiter checked your GitHub: 3 repos, all forked',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'parent-call',
    message: 'Mom calling... "Beta, placement hua?"',
    type: 'chaos',
    icon: 'alert'
  },
  {
    id: 'cgpa-round',
    message: 'Company rounded your 7.49 down to 7.0',
    type: 'bad',
    icon: 'skull'
  },
  {
    id: 'power-cut',
    message: 'Hostel power cut during coding round!',
    type: 'bad',
    icon: 'skull'
  }
];

interface RandomEventsProps {
  active: boolean;
  onEvent?: (event: RandomEvent) => void;
}

export function RandomEvents({ active, onEvent }: RandomEventsProps) {
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);

  useEffect(() => {
    if (!active) return;

    const showRandomEvent = () => {
      const event = events[Math.floor(Math.random() * events.length)];
      setCurrentEvent(event);
      if (onEvent) onEvent(event);
      
      setTimeout(() => {
        setCurrentEvent(null);
      }, 3000);
    };

    // Show event every 8-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        showRandomEvent();
      }
    }, Math.random() * 7000 + 8000);

    return () => clearInterval(interval);
  }, [active, onEvent]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'alert': return AlertCircle;
      case 'zap': return Zap;
      case 'heart': return Heart;
      case 'skull': return Skull;
      default: return AlertCircle;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'good': return 'from-green-400 to-green-600';
      case 'bad': return 'from-red-400 to-red-600';
      case 'chaos': return 'from-purple-400 to-purple-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {currentEvent && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-32 right-4 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${getColors(currentEvent.type)} text-white rounded-lg shadow-2xl p-4 border-2 border-white/30`}>
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = getIcon(currentEvent.icon);
                return <Icon className="w-6 h-6 flex-shrink-0 mt-1" />;
              })()}
              <div>
                <p className="text-xs opacity-90 uppercase tracking-wider">
                  {currentEvent.type === 'good' ? '✨ Good News' : 
                   currentEvent.type === 'bad' ? '⚠️ Alert' : 
                   '🎪 Chaos Event'}
                </p>
                <p className="text-sm mt-1">{currentEvent.message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
