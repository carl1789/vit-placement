import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const newsItems = [
  "🚨 BREAKING: VIT WiFi down during online test, students claim 'technical issues'",
  "📰 NEW: Placement cell announces 200% placement rate (counting multiple offers twice)",
  "⚡ ALERT: Student spotted with 10.0 CGPA, authorities investigating for cheating",
  "📢 UPDATE: Mass recruiter offering 3.6 LPA being called 'decent package' now",
  "🔥 TRENDING: '#PlacementSZN' overtakes '#StudyMotivation' on VIT Twitter",
  "💼 REPORT: 90% of placed students have 'SDE' in job title regardless of actual role",
  "📊 SURVEY: Students spend more time on LinkedIn than LeetCode",
  "🎯 NEWS: Dream company rejected 2000 students in 30 seconds (new record)",
  "⚠️ WARNING: Placement coordinator spotted, students advised to maintain 6ft distance",
  "🎪 EXCLUSIVE: Service-based companies now considered 'premium' after Dream Day",
  "📱 VIRAL: Student's 'Grateful to announce' post has more engagement than actual skills",
  "🏆 ACHIEVEMENT: VIT placements WhatsApp group crosses 10,000 unread messages",
  "💡 TIP: Saying 'I'll learn on the job' in interview not working anymore",
  "🎓 STATS: 85% of 'team projects' had only one person actually coding",
  "⏰ REMINDER: Placement registration closes in 5 mins, CGPA requirement increased to 11.0",
  "🌟 FEATURED: Alumni earning 50 LPA refuses to give referrals to juniors",
  "📈 MARKET: Job market crashes right before final year placements begin",
  "🎭 DRAMA: Two students claim same internship, both lying",
  "💰 ECONOMY: Parents wondering why they paid 18 lakhs for 3.6 LPA package",
  "🚀 INNOVATION: Student lists 'Netflix binging' as 'Media Analysis' on resume",
  "🎪 VIT PUNE SPECIAL: Random audi event called during placement prep - Nobody knows why",
  "📢 CHAOS: 3 different audi sessions scheduled simultaneously in same auditorium",
  "🥵 ALERT: Audi AC broken again. Students attending in formal wear slowly melting",
  "🎭 BREAKING: Cultural fest rehearsal cancelled placement talk. Priorities unclear.",
  "📸 UPDATE: Mass photoshoot for brochure. Everyone forced to smile. Depression levels rising.",
  "🏃 URGENT: Students running from one audi event to another. Marathon training unintentional.",
  "🎤 NEWS: Audi mic stopped working. 2000 students pretending they can hear the speaker.",
  "📅 DEVELOPING: Audi event announced 2 minutes ago. Started 5 minutes ago. Time is relative.",
  "🇮🇳 LIVE: National Anthem in audi. Been standing 20 mins. Nobody knows when to sit down.",
  "👔 EXCLUSIVE: Guest lecturer giving life advice while students check placement results",
  "🎯 PUNE UPDATE: VIT students mastering art of sleeping with eyes open during audi events",
  "🎪 SPECIAL: Mandatory fun activity in audi. Fun mandatory, happiness optional",
  "🏆 RECORD: 7th audi event this week. Classes? What classes?",
  "💀 TRAGEDY: Student bunked audi event. Found to have random backlog next semester"
];

export function NewsTicker() {
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="bg-white text-red-600 px-3 py-1 font-bold text-sm whitespace-nowrap">
          VIT NEWS
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-sm flex-1"
          >
            {newsItems[currentNews]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
