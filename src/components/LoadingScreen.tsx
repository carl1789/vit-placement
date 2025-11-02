import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import vitLogo from 'figma:asset/3328cfac246b7488fa985885ab7b7d5164730c36.png';

const loadingTips = [
  "📚 Loading placement criteria... (This might take longer than your interview)",
  "💼 Checking CGPA... (Rounding errors may occur)",
  "🎯 Analyzing resume... (Comic Sans detected! Abort!)",
  "📧 Sending rejection emails... (Oops, wrong screen)",
  "🔍 Scanning for backlogs... (Found 47 in database)",
  "💻 Updating LinkedIn... (Connection request to CEO pending)",
  "📊 Calculating package... (Converting dreams to reality)",
  "🎓 Verifying degree... (Is this even real?)",
  "📱 Enabling airplane mode... (To avoid parent calls)",
  "🌟 Generating fake experiences... (Netflix watching = Media expertise)",
  "🎪 Preparing interview room... (AC not working, as usual)",
  "📝 Printing offer letters... (Out of paper, sorry)",
  "🎭 Setting expectations... (Very low)",
  "💰 Counting bond amount... (Calculator broke)",
  "🚀 Launching career... (Launch delayed due to CGPA)",
  "🎭 VIT Pune: Scheduling random audi events... (3 at same time)",
  "🥵 Checking audi AC status... (Broken as expected)",
  "📸 Preparing photoshoot session... (Fake smiles loading)",
  "🎤 Testing audi microphone... (Won't work anyway)",
  "👔 Enforcing formal dress code... (For yoga session)",
  "📅 Triple-booking auditorium... (Chaos theory confirmed)",
  "🎪 Loading mandatory fun activities... (Fun not included)",
  "⚡ Generating VIT Pune chaos... (This is our specialty)"
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(tipInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <Card className="w-full max-w-2xl p-12 bg-white/95 backdrop-blur text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <img 
            src={vitLogo} 
            alt="VIT Logo" 
            className="w-32 h-auto mx-auto"
          />
        </motion.div>

        <h2 className="text-3xl mb-6">Initializing Placement Portal...</h2>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
        </div>

        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-[60px] flex items-center justify-center"
        >
          <p className="text-sm text-gray-700 italic">{loadingTips[currentTip]}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡
            </motion.div>
            <p>Bribing TPO</p>
          </div>
          <div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              📱
            </motion.div>
            <p>Updating Resume</p>
          </div>
          <div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            >
              💸
            </motion.div>
            <p>Paying Fees</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
