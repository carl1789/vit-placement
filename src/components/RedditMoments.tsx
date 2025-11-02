import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, TrendingUp, Laugh } from 'lucide-react';

interface RedditMoment {
  id: string;
  title: string;
  content: string;
  upvotes: number;
}

// Based on actual VIT Pune Reddit vibes
const redditMoments: RedditMoment[] = [
  {
    id: '1',
    title: 'Audi event during placement prep',
    content: 'Just when I was about to practice DSA, got notification for mandatory audi event. Classic VIT Pune moment.',
    upvotes: 420
  },
  {
    id: '2',
    title: 'AC broke during formal event',
    content: 'They said "formal dress mandatory". AC said "I don\'t think so". 2000 students slowly melting in audi.',
    upvotes: 666
  },
  {
    id: '3',
    title: 'Triple booked auditorium',
    content: 'Placement talk, cultural rehearsal, and exam all in same audi at same time. Admin playing 4D chess.',
    upvotes: 999
  },
  {
    id: '4',
    title: 'Guest lecture during placements',
    content: '"Follow your passion" says speaker. Meanwhile dream company registration closing in 5 mins. Peak timing.',
    upvotes: 777
  },
  {
    id: '5',
    title: 'Photoshoot for brochure',
    content: 'Forced to smile for 2 hours for college brochure. Depression levels still at 100%. They Photoshopped happiness anyway.',
    upvotes: 555
  },
  {
    id: '6',
    title: 'Random audi attendance',
    content: 'Bunked random audi event. Now have backlog in subject I never enrolled in. VIT Pune magic.',
    upvotes: 888
  },
  {
    id: '7',
    title: 'Mic not working',
    content: 'Speaker talking for 1 hour. Mic dead. 2000 students nodding pretending they can hear. Oscar-worthy performance.',
    upvotes: 432
  },
  {
    id: '8',
    title: 'Event announced 2 mins ago',
    content: 'Got message: "Audi event started 10 minutes ago. Attendance compulsory." Time travel confirmed.',
    upvotes: 690
  },
  {
    id: '9',
    title: 'National anthem confusion',
    content: 'National anthem in audi. Been standing for 30 minutes. Nobody knows protocol. Send help.',
    upvotes: 512
  },
  {
    id: '10',
    title: 'Rehearsal > Exam prep',
    content: 'Have exam tomorrow. Cultural committee: "4 hour rehearsal mandatory". Priorities = sorted.',
    upvotes: 756
  }
];

interface RedditMomentsProps {
  show: boolean;
}

export function RedditMoments({ show }: RedditMomentsProps) {
  const [currentMoment, setCurrentMoment] = useState<RedditMoment | null>(null);

  useEffect(() => {
    if (!show) return;

    const showMoment = () => {
      const moment = redditMoments[Math.floor(Math.random() * redditMoments.length)];
      setCurrentMoment(moment);
      
      setTimeout(() => {
        setCurrentMoment(null);
      }, 6000);
    };

    // Show every 15-25 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        showMoment();
      }
    }, Math.random() * 10000 + 15000);

    return () => clearInterval(interval);
  }, [show]);

  return (
    <AnimatePresence>
      {currentMoment && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed bottom-24 left-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-2xl p-4 border-2 border-white/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs font-bold">r/VITPune</span>
                  <span className="text-white/70 text-xs">• Hot 🔥</span>
                </div>
                <h4 className="text-white font-bold text-sm">{currentMoment.title}</h4>
              </div>
            </div>

            <p className="text-white/90 text-sm leading-relaxed mb-3">
              {currentMoment.content}
            </p>

            <div className="flex items-center gap-4 text-white/80 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{currentMoment.upvotes} upvotes</span>
              </div>
              <div className="flex items-center gap-1">
                <Laugh className="w-4 h-4" />
                <span>Very Relatable</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-white/60 text-xs italic">
                *Based on true events from VIT Pune Reddit*
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
