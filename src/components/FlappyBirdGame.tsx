import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { getRandomFact } from './PlacementFacts';
import { RandomEvents } from './RandomEvents';
import { AudiEvents } from './AudiEvents';
import { RedditMoments } from './RedditMoments';

interface FlappyBirdGameProps {
  onGameOver: (score: number, reason: string, audiEvents?: number) => void;
  playerName: string;
}

interface Obstacle {
  x: number;
  gapY: number;
  passed: boolean;
  company: string;
  tier: 'dream' | 'super-dream' | 'mass';
}

const companiesData = [
  { name: 'NVIDIA', tier: 'dream' as const },
  { name: 'Microsoft', tier: 'dream' as const },
  { name: 'Barclays', tier: 'super-dream' as const },
  { name: 'EATON', tier: 'super-dream' as const },
  { name: 'Citi Bank', tier: 'super-dream' as const },
  { name: 'Mastercard', tier: 'super-dream' as const },
  { name: 'Vesteron', tier: 'super-dream' as const },
  { name: 'IBM', tier: 'super-dream' as const },
  { name: 'HSBC', tier: 'super-dream' as const },
  { name: 'PhonePe', tier: 'super-dream' as const },
  { name: 'TCS', tier: 'mass' as const },
  { name: 'Infosys', tier: 'mass' as const },
  { name: 'Wipro', tier: 'mass' as const },
  { name: 'Cognizant', tier: 'mass' as const },
  { name: 'Accenture', tier: 'mass' as const }
];

const rejectionReasons = [
  '12th criteria failed (89.9% when they needed 90%)',
  'CGPA not met (You have 7.49, they need 7.5)',
  '10th criteria not met',
  "Company didn't like ur vibe",
  'HACKATHON criteria not met',
  'Active backlogs detected',
  'Resume font was Comic Sans',
  'LinkedIn profile not optimized',
  'Attendance below 75%',
  'No DSA in resume',
  'Leetcode rating too low',
  'Failed the "cultural fit" test',
  'Placement coordinator blocked you',
  'Your GitHub has 0 contributions',
  'Not enough "synergy" in your answers',
  'Bond amount too high for you to sign',
  'They saw your Twitter account',
  'Previous arrear in semester 3',
  'Wrong resume template',
  'Email ID was not professional enough',
  'Too many spelling mistakes in resume',
  'Lack of "leadership qualities"',
  'No projects to show (calculator app doesnt count)',
  'Your CGPA rounded down instead of up'
];

export function FlappyBirdGame({ onGameOver, playerName }: FlappyBirdGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [placementFact] = useState(getRandomFact());
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number | null>(null);
  const spawnAccumulatorRef = useRef<number>(0);
  const cloudAccumulatorRef = useRef<number>(0);
  const [showNearMissEffect, setShowNearMissEffect] = useState(false);
  const nearMissTimerRef = useRef<NodeJS.Timeout>();
  const [audiEventsIgnored, setAudiEventsIgnored] = useState(0);

  const birdRef = useRef({
    y: 250,
    velocity: 0,
    x: 100
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ORIGINAL_WIDTH = 800;
    const ORIGINAL_HEIGHT = 600;

    let scale = 1;

    const resizeCanvas = () => {
      const { width: containerWidth } = container.getBoundingClientRect();
      const maxHeight = Math.max(300, window.innerHeight * 0.6);
      const scaleByWidth = containerWidth / ORIGINAL_WIDTH;
      const scaleByHeight = maxHeight / ORIGINAL_HEIGHT;
      scale = Math.min(scaleByWidth, scaleByHeight);
      canvas.width = Math.floor(ORIGINAL_WIDTH * scale);
      canvas.height = Math.floor(ORIGINAL_HEIGHT * scale);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const BIRD_SIZE = 40;
    const GRAVITY = 0.35; // tuned for 60fps baseline
    const JUMP_STRENGTH = -8; // tuned for 60fps baseline
    const OBSTACLE_WIDTH = 90;
    const GAP_SIZE = 200;
    const OBSTACLE_SPEED = 2; // px per frame at 60fps baseline

    const handleJump = () => {
      if (!gameStarted) {
        setGameStarted(true);
      }
      birdRef.current.velocity = JUMP_STRENGTH;
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleJump();
    };

    canvas.addEventListener('click', handleJump);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = (time: number) => {
      if (!ctx || !canvas) return;

      // Compute frame delta normalized to 60fps
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const deltaMs = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const delta = Math.min(Math.max(deltaMs / (1000 / 60), 0.2), 2); // clamp
      const deltaForClouds = Math.min(Math.max(deltaMs / (1000 / 60), 0), 3);

      ctx.save();
      ctx.scale(scale, scale);

      // Clear canvas with gradient sky
      const gradient = ctx.createLinearGradient(0, 0, 0, ORIGINAL_HEIGHT);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F2FE');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

      // Draw ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, ORIGINAL_HEIGHT - 20, ORIGINAL_WIDTH, 20);
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, ORIGINAL_HEIGHT - 25, ORIGINAL_WIDTH, 5);

      // Draw clouds (VIT stress clouds)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      cloudAccumulatorRef.current += deltaForClouds;
      const cloudX = (cloudAccumulatorRef.current * 0.5) % (ORIGINAL_WIDTH + 100);
      ctx.beginPath();
      ctx.arc(cloudX, 80, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 15, 80, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 30, 80, 20, 0, Math.PI * 2);
      ctx.fill();

      // Random floating text (VIT chaos)
      if (frameCountRef.current % 200 < 100) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = '12px sans-serif';
        ctx.fillText('CGPA?', 200, 100);
        ctx.fillText('Audi Event!', 500, 150);
        ctx.fillText('Referral pls', 300, 250);
      }

      if (gameStarted) {
        // Update bird physics
        birdRef.current.velocity += GRAVITY * delta;
        birdRef.current.y += birdRef.current.velocity * delta;

        // Generate obstacles (slower spawn rate)
        spawnAccumulatorRef.current += delta; // accumulate virtual frames
        if (spawnAccumulatorRef.current >= 150) { // roughly every 2.5s at 60fps
          spawnAccumulatorRef.current -= 150;
          const gapY = Math.random() * (ORIGINAL_HEIGHT - GAP_SIZE - 100) + 50;
          const companyData = companiesData[Math.floor(Math.random() * companiesData.length)];
          obstaclesRef.current.push({
            x: ORIGINAL_WIDTH,
            gapY,
            passed: false,
            company: companyData.name,
            tier: companyData.tier
          });
        }

        // Update and draw obstacles
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obstacle = obstaclesRef.current[i];
          obstacle.x -= OBSTACLE_SPEED * delta;

          // Draw top obstacle with tier color and patterns
          const tierColors = {
            'dream': '#ef4444',      // red - most dangerous
            'super-dream': '#f59e0b', // orange
            'mass': '#6b7280'         // gray
          };
          const tierBorderColors = {
            'dream': '#991b1b',
            'super-dream': '#92400e',
            'mass': '#374151'
          };
          
          // Main obstacle with gradient effect
          ctx.fillStyle = tierColors[obstacle.tier];
          ctx.fillRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.gapY);
          ctx.fillRect(
            obstacle.x,
            obstacle.gapY + GAP_SIZE,
            OBSTACLE_WIDTH,
            ORIGINAL_HEIGHT - obstacle.gapY - GAP_SIZE
          );

          // Border/outline
          ctx.strokeStyle = tierBorderColors[obstacle.tier];
          ctx.lineWidth = 3;
          ctx.strokeRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.gapY);
          ctx.strokeRect(
            obstacle.x,
            obstacle.gapY + GAP_SIZE,
            OBSTACLE_WIDTH,
            ORIGINAL_HEIGHT - obstacle.gapY - GAP_SIZE
          );

          // Add warning stripes for dream companies
          if (obstacle.tier === 'dream') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < obstacle.gapY; i += 20) {
              ctx.fillRect(obstacle.x, i, OBSTACLE_WIDTH, 10);
            }
            for (let i = obstacle.gapY + GAP_SIZE; i < ORIGINAL_HEIGHT; i += 20) {
              ctx.fillRect(obstacle.x, i, OBSTACLE_WIDTH, 10);
            }
          }

          // Danger symbols for obstacles
          ctx.fillStyle = '#fff';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          const dangerSymbol = obstacle.tier === 'dream' ? '⚠️' : obstacle.tier === 'super-dream' ? '🔥' : '📄';
          ctx.fillText(dangerSymbol, obstacle.x + OBSTACLE_WIDTH / 2, 30);
          ctx.fillText(dangerSymbol, obstacle.x + OBSTACLE_WIDTH / 2, ORIGINAL_HEIGHT - 30);

          // Draw company name on obstacles
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          
          // Top obstacle label
          ctx.save();
          ctx.translate(obstacle.x + OBSTACLE_WIDTH / 2, obstacle.gapY / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(obstacle.company, 0, -5);
          ctx.font = '10px sans-serif';
          const tierLabels = {
            'dream': '45L+',
            'super-dream': '15L+',
            'mass': '3.6L'
          };
          ctx.fillText(tierLabels[obstacle.tier], 0, 10);
          ctx.restore();

          // Bottom obstacle label
          ctx.save();
          ctx.translate(
            obstacle.x + OBSTACLE_WIDTH / 2,
            obstacle.gapY + GAP_SIZE + (ORIGINAL_HEIGHT - obstacle.gapY - GAP_SIZE) / 2
          );
          ctx.rotate(-Math.PI / 2);
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(obstacle.company, 0, -5);
          ctx.font = '10px sans-serif';
          ctx.fillText(tierLabels[obstacle.tier], 0, 10);
          ctx.restore();

          // Check collision
          const birdLeft = birdRef.current.x - BIRD_SIZE / 2;
          const birdRight = birdRef.current.x + BIRD_SIZE / 2;
          const birdTop = birdRef.current.y - BIRD_SIZE / 2;
          const birdBottom = birdRef.current.y + BIRD_SIZE / 2;

          if (
            birdRight > obstacle.x &&
            birdLeft < obstacle.x + OBSTACLE_WIDTH &&
            (birdTop < obstacle.gapY || birdBottom > obstacle.gapY + GAP_SIZE)
          ) {
            const reason = obstacle.company; // Use company name as rejection reason
            onGameOver(score, reason, audiEventsIgnored);
            return;
          }

          // Check if passed
          if (!obstacle.passed && obstacle.x + OBSTACLE_WIDTH < birdRef.current.x) {
            obstacle.passed = true;
            setScore(s => s + 1);
            
            // Near miss check for visual effect
            const birdTop = birdRef.current.y - BIRD_SIZE / 2;
            const birdBottom = birdRef.current.y + BIRD_SIZE / 2;
            const nearMissThreshold = 30;
            
            if (Math.abs(birdTop - obstacle.gapY) < nearMissThreshold || 
                Math.abs(birdBottom - (obstacle.gapY + GAP_SIZE)) < nearMissThreshold) {
              setShowNearMissEffect(true);
              if (nearMissTimerRef.current) clearTimeout(nearMissTimerRef.current);
              nearMissTimerRef.current = setTimeout(() => setShowNearMissEffect(false), 500);
            }
          }

          // Remove off-screen obstacles
          if (obstacle.x + OBSTACLE_WIDTH < 0) {
            obstaclesRef.current.splice(i, 1);
          }
        }

        // Keep bird within bounds instead of dying on edges
        const half = BIRD_SIZE / 2;
        if (birdRef.current.y + half > ORIGINAL_HEIGHT) {
          birdRef.current.y = ORIGINAL_HEIGHT - half;
          birdRef.current.velocity = 0; // stop falling at the ground
        } else if (birdRef.current.y - half < 0) {
          birdRef.current.y = half;
          birdRef.current.velocity = 0; // stop moving above the ceiling
        }
      }

      // Draw bird (more detailed and funny)
      ctx.save();
      
      // Bird body (stressed VIT student)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(birdRef.current.x, birdRef.current.y, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Stressed face
      ctx.fillStyle = '#000';
      
      // Eyes (worried eyes)
      ctx.beginPath();
      ctx.arc(birdRef.current.x - 5, birdRef.current.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(birdRef.current.x + 5, birdRef.current.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      // Worried mouth
      ctx.beginPath();
      ctx.arc(birdRef.current.x, birdRef.current.y + 5, 4, 0, Math.PI);
      ctx.stroke();

      // Sweat drop when falling fast
      if (birdRef.current.velocity > 3) {
        ctx.fillStyle = '#4299e1';
        ctx.beginPath();
        ctx.arc(birdRef.current.x - 12, birdRef.current.y - 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Graduation cap
      ctx.fillStyle = '#1a202c';
      ctx.fillRect(birdRef.current.x - 12, birdRef.current.y - 18, 24, 3);
      ctx.fillRect(birdRef.current.x - 8, birdRef.current.y - 22, 16, 4);
      
      // Resume in hand (small rectangle)
      ctx.fillStyle = '#fff';
      ctx.fillRect(birdRef.current.x - 18, birdRef.current.y + 5, 8, 10);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(birdRef.current.x - 18, birdRef.current.y + 5, 8, 10);
      
      ctx.restore();

      // Draw score and status
      ctx.fillStyle = '#000';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Companies Dodged: ${score}`, 20, 45);
      
      // Draw player name
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Player: ${playerName}`, 20, 75);
      
      // Draw stress meter
      ctx.font = '14px sans-serif';
      ctx.fillText('Stress Level:', 20, 100);
      const stressLevel = Math.min(score * 5 + 30, 100);
      const stressColor = stressLevel > 70 ? '#ef4444' : stressLevel > 40 ? '#f59e0b' : '#22c55e';
      ctx.fillStyle = '#ddd';
      ctx.fillRect(120, 88, 150, 15);
      ctx.fillStyle = stressColor;
      ctx.fillRect(120, 88, (stressLevel / 100) * 150, 15);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(120, 88, 150, 15);
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${stressLevel}%`, 275, 99);
      
      // Draw motivational/demotivational message based on score
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#666';
      if (score >= 15) {
        ctx.fillText('🔥 FAANG MATERIAL! Parents proud!', 20, 125);
      } else if (score >= 10) {
        ctx.fillText('💎 Dream Company Zone!', 20, 125);
      } else if (score >= 5) {
        ctx.fillText('📈 Service Based Territory', 20, 125);
      } else if (score > 0) {
        ctx.fillText('😰 Mass Recruiter Level', 20, 125);
      } else {
        ctx.fillText('🆘 Send Help (and referrals)', 20, 125);
      }

      // CGPA indicator (joke)
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#444';
      const fakeCGPA = Math.max(10 - (score * 0.1), 6.5).toFixed(2);
      ctx.fillText(`Current CGPA: ${fakeCGPA} (dropping...)`, ORIGINAL_WIDTH - 200, 30);

      // Draw instructions
      if (!gameStarted) {
        // Semi-transparent background with pulsing effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(ORIGINAL_WIDTH / 2 - 320, ORIGINAL_HEIGHT / 2 - 150, 640, 280);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎓 VIT PLACEMENT SURVIVAL GUIDE 🎓', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 - 100);
        
        ctx.font = 'bold 22px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('⚠️ WARNING: Highly Stressful Ahead ⚠️', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 - 60);
        
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('Click or Press SPACE to Jump', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 - 20);
        ctx.fillText('Navigate through company rejections!', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 + 10);
        
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#22c55e';
        ctx.fillText('💚 Green Gap = Safe passage (for now)', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 + 45);
        
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('🔴 Red Towers = Dream Companies (Instant Death)', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 + 70);
        
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('⚫ Gray Towers = Mass Recruiters (Still Death)', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 + 95);
        
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#ffeb3b';
        ctx.fillText('(P.S. - Random audi events will interrupt you)', ORIGINAL_WIDTH / 2, ORIGINAL_HEIGHT / 2 + 120);
      }

      ctx.restore();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop(performance.now());

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleJump);
      canvas.removeEventListener('touchstart', handleTouchStart as EventListener);
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, score, onGameOver]);

  const getScoreTitle = () => {
    if (score < 3) return "Struggling Fresher 😰";
    if (score < 6) return "Average VITian 📚";
    if (score < 10) return "Placement Champ 🏆";
    if (score < 15) return "Dream Company Material 💎";
    return "Unicorn Recruit 🦄";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden sm:overflow-visible">
      <RandomEvents active={gameStarted} />
      <AudiEvents 
        active={gameStarted} 
        onEvent={() => setAudiEventsIgnored(prev => prev + 1)}
      />
      <RedditMoments show={gameStarted} />
      
      <Card className="w-full max-w-[840px] p-3 sm:p-6 bg-white/95 backdrop-blur">
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1" />
            <h2 className="text-3xl">🎯 VIT Placement Gauntlet 🎯</h2>
            <div className="flex-1 flex justify-end">
              <div className="bg-purple-100 border border-purple-300 rounded px-2 py-1 text-xs">
                🔊 Sound: *whoosh* *boing*
              </div>
            </div>
          </div>
          <p className="text-orange-600 mb-1">Don't hit any company or you'll get rejected!</p>
          <p className="text-sm text-gray-600">Current Status: <strong className="text-blue-600">{getScoreTitle()}</strong></p>
          <p className="text-xs text-gray-500 mt-2 italic">
            "May the CGPA be ever in your favor"
          </p>
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs text-gray-600">{placementFact}</p>
          </div>
          {gameStarted && (
            <div className="mt-2 flex gap-2 justify-center flex-wrap text-xs">
              <div className="bg-purple-100 border border-purple-300 px-3 py-1 rounded">
                🎪 Audi Chaos Mode: ACTIVE
              </div>
              <div className="bg-orange-100 border border-orange-300 px-3 py-1 rounded">
                ⚡ VIT Pune Special Edition
              </div>
              {audiEventsIgnored > 0 && (
                <div className="bg-red-100 border border-red-300 px-3 py-1 rounded animate-pulse">
                  ⚠️ Audi Events Ignored: {audiEventsIgnored} (Backlogs incoming!)
                </div>
              )}
            </div>
          )}
        </div>
        <canvas
          ref={canvasRef}
          className="border-4 border-blue-900 rounded-lg shadow-2xl mx-auto block touch-none select-none"
          style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
          draggable={false}
        />
        <div className="mt-4 space-y-2">
          <div className="hidden sm:grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-red-100 border-2 border-red-400 p-2 rounded">
              <p className="text-red-800">🔴 Dream: 45+ LPA</p>
              <p className="text-red-600 text-xs">(Impossible)</p>
            </div>
            <div className="bg-orange-100 border-2 border-orange-400 p-2 rounded">
              <p className="text-orange-800">🟠 Super: 15+ LPA</p>
              <p className="text-orange-600 text-xs">(Very Hard)</p>
            </div>
            <div className="bg-gray-100 border-2 border-gray-400 p-2 rounded">
              <p className="text-gray-800">⚫ Mass: 3.6 LPA</p>
              <p className="text-gray-600 text-xs">(Still Hard)</p>
            </div>
          </div>
          
          {showNearMissEffect && (
            <div className="bg-yellow-200 border-2 border-yellow-500 p-2 rounded text-center animate-pulse">
              <p className="text-yellow-900">😱 CLOSE CALL! Heart rate: 180 BPM!</p>
            </div>
          )}
          
          {score > 0 && score % 5 === 0 && (
            <div className="bg-blue-100 border border-blue-300 p-2 rounded text-center">
              <p className="text-blue-800 text-xs">🎉 Milestone: {score} companies dodged! Parents slightly less disappointed!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
