import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const quotes = [
  { text: "Beta, CGPA toh dekho pehle", author: "- Every Placement Coordinator" },
  { text: "Bro just do LeetCode", author: "- That one senior" },
  { text: "Off-campus mein try karo", author: "- Unplaced friend" },
  { text: "LinkedIn pe post daalo", author: "- Career advisor" },
  { text: "Referral hai kya?", author: "- Desperate student" },
  { text: "Attendance issue hai kya?", author: "- Faculty" },
  { text: "Sir, placement form kab khulega?", author: "- Anxious final year" },
  { text: "Dream company toh gaya", author: "- Reality check" },
  { text: "Package matter nahi karta", author: "- Person with 40 LPA offer" },
  { text: "Work-life balance dekhna chahiye", author: "- Unplaced student" },
  { text: "Startup join kar lo", author: "- Entrepreneurship cell" },
  { text: "Higher studies best hai", author: "- Failed interview candidate" },
  { text: "Audi event hai bhai, placements baad mein", author: "- VIT Pune Admin" },
  { text: "AC nahi chal raha, par event mandatory hai", author: "- Event coordinator" },
  { text: "Formal dress compulsory for yoga in audi", author: "- VIT Pune Special" },
  { text: "Attendance lo pehle, content baad mein", author: "- Every audi event" },
  { text: "3 events same time? You choose", author: "- Scheduling committee" },
  { text: "Mic not working but keep talking", author: "- Guest speaker" },
  { text: "Rehearsal more important than exam prep", author: "- Cultural committee" },
  { text: "Photoshoot for brochure, smile mandatory", author: "- PR Team" },
  { text: "VIP coming, practice welcoming for 4 hours", author: "- Protocol office" },
  { text: "Audi event = surprise test announcement", author: "- Plot twist faculty" },
  { text: "National anthem playing, nobody knows when to sit", author: "- Confused student" },
  { text: "Classes cancelled for random ceremony", author: "- Academic calendar" }
];

interface PlacementQuotesProps {
  show: boolean;
}

export function PlacementQuotes({ show }: PlacementQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 max-w-md"
    >
      <div className="bg-black/70 backdrop-blur text-white rounded-lg p-4 text-center">
        <p className="text-sm italic">"{currentQuote.text}"</p>
        <p className="text-xs mt-1 text-gray-300">{currentQuote.author}</p>
      </div>
    </motion.div>
  );
}
