import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Volume2, Users, Megaphone } from 'lucide-react';

export interface AudiEvent {
  id: string;
  message: string;
  type: 'emergency' | 'chaos' | 'announcement' | 'confusion';
  icon: 'warning' | 'volume' | 'users' | 'megaphone';
}

// Based on actual VIT Pune Reddit chaos
const audiEvents: AudiEvent[] = [
  {
    id: 'random-audi',
    message: '🎭 URGENT: Random Audi event at 3 PM. Attendance compulsory. What event? Nobody knows!',
    type: 'emergency',
    icon: 'warning'
  },
  {
    id: 'another-audi',
    message: '📢 BREAKING: Another Audi session scheduled. Content: TBD. Time: Now. Reason: ¯\\_(ツ)_/¯',
    type: 'chaos',
    icon: 'megaphone'
  },
  {
    id: 'audi-overlap',
    message: '🎪 3 different audi events scheduled at same time. Choose your fighter!',
    type: 'confusion',
    icon: 'users'
  },
  {
    id: 'guest-lecture',
    message: '👔 Guest Lecture in Audi: "How to be successful" by person who got lucky',
    type: 'announcement',
    icon: 'volume'
  },
  {
    id: 'mandatory-fun',
    message: '🎉 MANDATORY FUN SESSION in Audi. Bunking = Backlog in random subject',
    type: 'emergency',
    icon: 'warning'
  },
  {
    id: 'cultural-fest',
    message: '🎭 Cultural Event Rehearsal - 7th time this week. Classes cancelled. Placements? What placements?',
    type: 'chaos',
    icon: 'megaphone'
  },
  {
    id: 'ac-not-working',
    message: '🥵 Audi AC not working. 2000 students + formal dress code = Human microwave',
    type: 'emergency',
    icon: 'warning'
  },
  {
    id: 'motivational',
    message: '💪 Motivational Speaker in Audi: "Follow your dreams!" Meanwhile placements running parallel',
    type: 'announcement',
    icon: 'volume'
  },
  {
    id: 'surprise-test',
    message: '📝 Plot Twist: Audi event was surprise test announcement. You should have attended.',
    type: 'confusion',
    icon: 'warning'
  },
  {
    id: 'placement-talk',
    message: '💼 Placement Talk in Audi: "You need 9 CGPA" - Speaker with 6.5 CGPA and 50 LPA',
    type: 'chaos',
    icon: 'megaphone'
  },
  {
    id: 'dean-special',
    message: '👨‍💼 Dean\'s Special Address: "Students should focus on studies" at 9 PM on Sunday',
    type: 'announcement',
    icon: 'volume'
  },
  {
    id: 'random-ceremony',
    message: '🏆 Random Award Ceremony. Awards given to people you\'ve never seen before',
    type: 'confusion',
    icon: 'users'
  },
  {
    id: 'startup-guy',
    message: '🚀 Startup Founder speaking: "I dropped out and made billions" - Crowd of engineering students with loans',
    type: 'chaos',
    icon: 'megaphone'
  },
  {
    id: 'yoga-audi',
    message: '🧘 Yoga session in Audi at 6 AM. Compulsory. In formal clothes. Make it make sense.',
    type: 'emergency',
    icon: 'warning'
  },
  {
    id: 'national-anthem',
    message: '🇮🇳 National Anthem in Audi. Standing for 30 mins because nobody knows when to sit.',
    type: 'confusion',
    icon: 'users'
  },
  {
    id: 'photoshoot',
    message: '📸 Mass photoshoot for brochure. Smile! (Depression mandatory after)',
    type: 'announcement',
    icon: 'volume'
  },
  {
    id: 'no-mic',
    message: '🎤 Audi event started. Mic not working. Speaker shouting. 2000 students can\'t hear.',
    type: 'chaos',
    icon: 'volume'
  },
  {
    id: 'triple-book',
    message: '📅 Audi triple-booked: Placement drive + Cultural event + Exam = Chaos Theory confirmed',
    type: 'emergency',
    icon: 'warning'
  },
  {
    id: 'late-notice',
    message: '⚡ Audi event announced 5 minutes before it starts. Location: Main Audi. Which one? Yes.',
    type: 'confusion',
    icon: 'megaphone'
  },
  {
    id: 'vip-guest',
    message: '🌟 VIP Guest visiting. Rehearsal for welcoming: 4 hours. Actual visit: 10 minutes',
    type: 'chaos',
    icon: 'users'
  },
  {
    id: 'random-dance',
    message: '💃 Cultural Committee dancing in Audi. Again. Exams next week? Irrelevant.',
    type: 'announcement',
    icon: 'megaphone'
  },
  {
    id: 'ppt-hell',
    message: '📊 Student presentation in Audi. PPT template from 2007. Comic Sans font. Everyone dies inside.',
    type: 'chaos',
    icon: 'volume'
  },
  {
    id: 'attendance-trap',
    message: '✅ Audi attendance being taken via face recognition, biometric, signatures, and blood sample',
    type: 'emergency',
    icon: 'warning'
  }
];

interface AudiEventsProps {
  active: boolean;
  onEvent?: (event: AudiEvent) => void;
}

export function AudiEvents({ active, onEvent }: AudiEventsProps) {
  const [currentEvent, setCurrentEvent] = useState<AudiEvent | null>(null);

  useEffect(() => {
    if (!active) return;

    const showRandomEvent = () => {
      const event = audiEvents[Math.floor(Math.random() * audiEvents.length)];
      setCurrentEvent(event);
      if (onEvent) onEvent(event);
      
      setTimeout(() => {
        setCurrentEvent(null);
      }, 5000);
    };

    // Show event every 10-20 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance
        showRandomEvent();
      }
    }, Math.random() * 10000 + 10000);

    // Show first event after 3 seconds
    const firstEvent = setTimeout(showRandomEvent, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstEvent);
    };
  }, [active, onEvent]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'warning': return AlertTriangle;
      case 'volume': return Volume2;
      case 'users': return Users;
      case 'megaphone': return Megaphone;
      default: return AlertTriangle;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'emergency': return 'from-red-500 to-orange-600';
      case 'chaos': return 'from-purple-500 to-pink-600';
      case 'announcement': return 'from-blue-500 to-cyan-600';
      case 'confusion': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨 URGENT AUDI EVENT';
      case 'chaos': return '🎪 AUDI CHAOS';
      case 'announcement': return '📢 AUDI ANNOUNCEMENT';
      case 'confusion': return '❓ AUDI CONFUSION';
      default: return '📍 AUDI UPDATE';
    }
  };

  return (
    <AnimatePresence>
      {currentEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-[60] max-w-2xl w-full px-4"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255,0,0,0.5)',
                '0 0 40px rgba(255,0,0,0.8)',
                '0 0 20px rgba(255,0,0,0.5)'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`bg-gradient-to-r ${getColors(currentEvent.type)} text-white rounded-lg shadow-2xl p-6 border-4 border-white/50`}
          >
            <div className="flex items-start gap-4">
              {(() => {
                const Icon = getIcon(currentEvent.icon);
                return (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="flex-shrink-0"
                  >
                    <div className="bg-white/30 p-3 rounded-full backdrop-blur">
                      <Icon className="w-8 h-8" />
                    </div>
                  </motion.div>
                );
              })()}
              <div className="flex-1">
                <p className="text-sm font-bold opacity-90 uppercase tracking-wider mb-2">
                  {getLabel(currentEvent.type)}
                </p>
                <p className="text-lg leading-relaxed">{currentEvent.message}</p>
                <p className="text-xs mt-3 opacity-80 italic">
                  *VIT Pune special - Check your phone for 15 group messages about this*
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
