import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { Confetti } from './Confetti';
import kartickPhoto from 'figma:asset/e4a8662aefcaa9c75e832fa3af1b33a65c2eee61.png';
import lonelyChairPhoto from 'figma:asset/18eeab4e9ab12818e11e56b01a305cb2f8bd0886.png';
import thronePhoto from 'figma:asset/e4a63b2115417e731751978725ddd670f8926c47.png';

interface GameOverScreenProps {
  score: number;
  rejectionReason: string;
  onRestart: () => void;
  audiEventsIgnored?: number;
}

export function GameOverScreen({ score, rejectionReason, onRestart, audiEventsIgnored = 0 }: GameOverScreenProps) {
  const getPerformanceMessage = () => {
    if (score === 0) return "You couldn't even dodge TCS? Seriously?";
    if (score < 3) return "Even your resume screener bot would reject this performance";
    if (score < 6) return "Placement coordinator is very disappointed";
    if (score < 10) return "Not bad, but still unemployed";
    if (score < 15) return "So close to Dream company! Try again!";
    return "You were literally one step away from FAANG!";
  };

  const getSalaryEquivalent = () => {
    return Math.min(3.6 + (score * 0.5), 45);
  };

  const isLegendary = score >= 15;
  const isFailure = score < 5;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Confetti show={isLegendary} type="celebration" />
      <Confetti show={isFailure} type="tears" />
      
      <Card className={`w-full max-w-3xl p-8 bg-white/95 backdrop-blur border-4 ${
        isLegendary ? 'border-yellow-400' : 'border-red-400'
      }`}>
        <div className="text-center mb-6">
          <motion.h1 
            className={`text-5xl mb-3 ${isLegendary ? 'text-yellow-600' : 'text-red-600'}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            {isLegendary ? '👑 PLACEMENT ROYALTY 👑' : '❌ REJECTED ❌'}
          </motion.h1>
          <h2 className="text-2xl text-orange-600">
            {isLegendary ? 'Status: DREAM COMPANY MATERIAL' : 'Application Status: NOT SHORTLISTED'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex-shrink-0 w-full max-w-sm mx-auto">
            <img 
              src={kartickPhoto} 
              alt="Placement Coordinator Kartick" 
              className="w-full h-auto rounded-lg shadow-2xl border-4 border-orange-400"
            />
            <div className="text-center mt-2">
              <p className="text-sm text-orange-700 italic">
                {isLegendary 
                  ? "\"Finally, a student who makes VIT proud!\"" 
                  : isFailure
                  ? "\"Beta, tumse na ho payega...\"" 
                  : "\"Disappointing, but expected\""}
              </p>
              <p className="text-xs text-gray-500 mt-1">- Placement Coordinator</p>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="bg-red-50 border-3 border-red-400 rounded-lg p-6 shadow-lg text-center">
              <p className="text-xl mb-2 text-gray-700">📧 <strong>Rejected by:</strong></p>
              <p className="text-3xl text-red-700 mb-3">{rejectionReason}</p>
              <p className="text-2xl font-bold text-red-800">Tunse nahi ho payga</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Companies Dodged</p>
                <p className="text-4xl text-blue-700">{score}</p>
              </div>
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Potential CTC</p>
                <p className="text-4xl text-green-700">{getSalaryEquivalent().toFixed(1)}</p>
                <p className="text-xs text-gray-500">LPA</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Performance Review:</strong>
              </p>
              <p className="text-gray-700 italic">"{getPerformanceMessage()}"</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 space-y-4">
          <Button 
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl px-10 py-6"
          >
            🔄 Retry Placements
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Rejection count updated in placement portal. Parents have been notified. 📱
          </p>
        </div>
      </Card>
    </div>
  );
}
