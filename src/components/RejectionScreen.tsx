import { Button } from './ui/button';
import { Card } from './ui/card';
import { XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import lonelyChairPhoto from 'figma:asset/18eeab4e9ab12818e11e56b01a305cb2f8bd0886.png';

interface RejectionScreenProps {
  onRestart: () => void;
  rejectionReason: string;
}

export function RejectionScreen({ onRestart, rejectionReason }: RejectionScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl p-12 bg-white/95 backdrop-blur border-4 border-red-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <XCircle className="w-32 h-32 mx-auto mb-6 text-red-500" />
            </motion.div>
            
            <h1 className="text-5xl mb-4 text-red-600">NOT ELIGIBLE</h1>
            <h2 className="text-3xl mb-4">⚠️ BRANCH CRITERIA NOT MET ⚠️</h2>
            <p className="text-xl mb-2 text-gray-700">You chose:</p>
            <p className="text-4xl text-red-700 mb-4">{rejectionReason}</p>
            <p className="text-4xl font-bold text-red-800">Tunse nahi ho payga</p>
          </div>

          <div>
            <img 
              src={lonelyChairPhoto} 
              alt="Your Future" 
              className="w-full h-auto rounded-lg shadow-2xl border-4 border-gray-400"
            />
            <p className="text-center mt-3 text-sm text-gray-600 italic">
              POV: You after choosing the wrong branch
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
          >
            🔄 Restart & Choose CS/IT This Time
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          *This is a satirical game. All branches have equal potential in real life! 💪
        </p>
      </Card>
    </div>
  );
}
