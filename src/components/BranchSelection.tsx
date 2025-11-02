import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import vitLogo from 'figma:asset/3328cfac246b7488fa985885ab7b7d5164730c36.png';

interface BranchSelectionProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onBranchSelect: (branch: string, playerName: string) => void;
  onStartGame: () => void;
}

const branches = [
  'CS',
  'IT',
  'CSE(AIML)',
  'CSE(AI)',
  'AIDS',
  'MECH',
  'ENTC',
  'INSTR'
];

export function BranchSelection({
  playerName,
  onPlayerNameChange,
  onBranchSelect,
  onStartGame,
}: BranchSelectionProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerNameChange(event.target.value);
  };

  const handleBranchClick = (branch: string) => {
    if (playerName.trim()) {
      setSelectedBranch(branch);
      onBranchSelect(branch, playerName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-8 bg-white/95 backdrop-blur">
        <div className="text-center mb-8">
          <img 
            src={vitLogo} 
            alt="VIT Logo" 
            className="w-48 h-auto mx-auto mb-6"
          />
          <h1 className="text-4xl mb-2">VIT Placement Simulator 2024</h1>
          <p className="text-gray-600">Enter Your Name & Select Your Branch</p>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Enter Your Name"
            value={playerName}
            onChange={handleNameChange}
            className="w-full text-center text-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((branch) => {
            const isGoodBranch = ['CS', 'IT', 'CSE(AIML)', 'CSE(AI)', 'AIDS'].includes(branch);
            
            return (
              <Button
                key={branch}
                onClick={() => handleBranchClick(branch)}
                variant="outline"
                disabled={!playerName.trim()}
                className={`h-20 transition-all ${
                  selectedBranch === branch
                    ? 'bg-blue-500 text-white'
                    : isGoodBranch 
                    ? 'hover:bg-green-600 hover:text-white border-green-200 hover:scale-105' 
                    : 'hover:bg-red-600 hover:text-white border-red-200 hover:shake'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">{branch}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {selectedBranch === 'ENTC' && (
          <div className="mt-4 text-center">
            <p className="text-red-600 text-sm font-medium">Consider life choices.</p>
          </div>
        )}

        {selectedBranch && playerName.trim() && (
          <div className="mt-6 text-center">
            <Button
              onClick={onStartGame}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xl px-10 py-6 animate-pulse"
            >
              Start Game
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Choose wisely... Placement Coordinator is watching 👀
        </p>
      </Card>
    </div>
  );
}
