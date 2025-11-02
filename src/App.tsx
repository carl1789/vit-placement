import { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { BranchSelection } from './components/BranchSelection';
import { FlappyBirdGame } from './components/FlappyBirdGame';
import { RejectionScreen } from './components/RejectionScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { AchievementPopup, Achievement, achievements } from './components/AchievementPopup';
import { PlacementQuotes } from './components/PlacementQuotes';
import { NewsTicker } from './components/NewsTicker';
import { CheatCode } from './components/CheatCode';
import { Leaderboard } from './components/Leaderboard';

export type GameState = 'loading' | 'branch-selection' | 'game' | 'rejection' | 'game-over';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('playerName') || '';
  });

  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [audiEventsIgnored, setAudiEventsIgnored] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/background-music.mp3');
    audioRef.current.loop = true;
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleStartGame = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setGameState('game');
  };

  const handleBranchSelect = (branch: string, name: string) => {
    setSelectedBranch(branch);
    setPlayerName(name);
    const validBranches = ['CS', 'IT', 'CSE(AIML)', 'CSE(AI)', 'AIDS'];
    
    if (!validBranches.includes(branch)) {
      setGameState('rejection');
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.has(achievementId)) {
      setUnlockedAchievements(new Set([...unlockedAchievements, achievementId]));
      setCurrentAchievement(achievements[achievementId]);
    }
  };

  const handleGameOver = (finalScore: number, reason: string, audiEvents: number = 0) => {
    setScore(finalScore);
    setRejectionReason(reason);
    setAudiEventsIgnored(audiEvents);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Post score to leaderboard
    if (playerName && finalScore > 0) {
      const apiUrl = import.meta.env.PROD ? 'https://tpo.collegeguide.me/scores' : '/api/scores';
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName, score: finalScore }),
      })
      .catch(error => console.error('Error posting score:', error));
    }

    // Check achievements
    if (finalScore === 0) {
      unlockAchievement('firstBlood');
    } else if (finalScore >= 20) {
      unlockAchievement('legend');
    } else if (finalScore >= 15) {
      unlockAchievement('placementKing');
    } else if (finalScore >= 10) {
      unlockAchievement('dreamChaser');
    } else if (finalScore >= 5) {
      unlockAchievement('survivor');
    }

    // Check if hit mass recruiter
    if (reason.toLowerCase().includes('tcs') || 
        reason.toLowerCase().includes('infosys') || 
        reason.toLowerCase().includes('wipro')) {
      unlockAchievement('massReject');
    }
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    setGameState('game-over');
  };

  const handleRestart = () => {
    setGameState('branch-selection');
    setSelectedBranch('');
    setRejectionReason('');
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 relative">
      <div className="absolute top-4 left-4 z-50">
        <Button onClick={toggleMute} variant="outline" size="sm">
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </div>
      {/* News Ticker */}
      {gameState === 'game' && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <NewsTicker />
        </div>
      )}

      {/* High Score Display */}
      {highScore > 0 && gameState !== 'loading' && (
        <div className={`absolute ${gameState === 'game' ? 'top-16' : 'top-4'} right-4 bg-white/90 backdrop-blur rounded-lg px-6 py-3 shadow-lg z-50`}>
          <p className="text-sm text-gray-600">🏆 Best Performance</p>
          <p className="text-2xl text-blue-600">{highScore} Companies</p>
        </div>
      )}

      {/* Cheat Code System */}
      <CheatCode onCheatActivated={(cheat) => console.log('Cheat activated:', cheat)} />

      {/* Achievement Popup */}
      <AchievementPopup 
        achievement={currentAchievement} 
        onClose={() => setCurrentAchievement(null)} 
      />

      {/* Placement Quotes during game */}
      <PlacementQuotes show={gameState === 'game'} />

      {/* Leaderboard */}
      <Leaderboard show={gameState === 'game' || gameState === 'branch-selection'} currentScore={score} />

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-40">
        <p className="text-white/70 text-xs">
          Disclaimer: This is a satirical game. All VIT branches are equally valuable! 
          <br />
          Made with 😅 for VITians by VITians | Achievements: {unlockedAchievements.size}/6
        </p>
      </div>

      {gameState === 'loading' && (
        <LoadingScreen onComplete={() => setGameState('branch-selection')} />
      )}
      {gameState === 'branch-selection' && (
        <BranchSelection
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onBranchSelect={handleBranchSelect}
          onStartGame={handleStartGame}
        />
      )}
      {gameState === 'game' && (
        <FlappyBirdGame onGameOver={handleGameOver} playerName={playerName} />
      )}
      {gameState === 'rejection' && (
        <RejectionScreen onRestart={handleRestart} rejectionReason={selectedBranch} />
      )}
      {gameState === 'game-over' && (
        <GameOverScreen 
          score={score} 
          rejectionReason={rejectionReason} 
          onRestart={handleRestart}
          audiEventsIgnored={audiEventsIgnored}
        />
      )}
    </div>
  );
}
