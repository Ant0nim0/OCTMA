import React, { useState, useEffect } from 'react';
import SafeboxPopUp from './SafeboxPopUp';

interface GameAreaProps {
  gameState: {
    coinValue: number;
    coinsPerMinute: number;
    totalCoins: number;
    specialCoins: number;
    level: number;
    hearts: number;
    isPlaying: boolean;
    waitTime: number;
    playTime: number;
  };
  updateGameState: (updates: Partial<GameAreaProps['gameState']>) => void;
}

const GameArea: React.FC<GameAreaProps> = ({ gameState, updateGameState }) => {
  const [isSafeboxOpen, setIsSafeboxOpen] = useState(false);
  const [isPlayPopupOpen, setIsPlayPopupOpen] = useState(true);
  const [isWatchAdsPopupOpen, setIsWatchAdsPopupOpen] = useState(false);
  const [gameTimer, setGameTimer] = useState(gameState.playTime);
  const [waitTimer, setWaitTimer] = useState(gameState.waitTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying) {
      interval = setInterval(() => {
        setGameTimer((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!gameState.isPlaying && waitTimer > 0) {
      interval = setInterval(() => {
        setWaitTimer((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsPlayPopupOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, waitTimer]);

  const startGame = () => {
    updateGameState({ isPlaying: true });
    setIsPlayPopupOpen(false);
    setGameTimer(gameState.playTime);
  };

  const endGame = () => {
    updateGameState({ isPlaying: false });
    setIsWatchAdsPopupOpen(true);
    setWaitTimer(gameState.waitTime);
  };

  const watchAds = () => {
    // Implement ad watching logic here
    window.parent.postMessage({ playdeck: { method: "showAd" } }, '*');
    setIsWatchAdsPopupOpen(false);
    setIsPlayPopupOpen(true);
    setWaitTimer(0);
  };

  return (
    <div className="game-area p-4">
      <div className="flex justify-between mb-4">
        <div>Coin Value: {gameState.coinValue}</div>
        <button onClick={() => setIsSafeboxOpen(true)} className="bg-yellow-500 p-2 rounded">
          SAFEBOX
        </button>
        <div>Coins per Minute: {gameState.coinsPerMinute}</div>
      </div>
      <div className="flex justify-between mb-4">
        <div>Play Time: {Math.floor(gameTimer / 60)}:{gameTimer % 60}</div>
        <div>Wait Time: {Math.floor(waitTimer / 60)}:{waitTimer % 60}</div>
      </div>
      <div className="bg-gray-200 h-64 mb-4 relative">
        {/* Implement game logic here */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <img src={`/cohinito-nivel${gameState.level}.png`} alt="Piggy" className="w-16 h-16" />
        </div>
      </div>
      <div className="flex justify-center mb-4">
        {Array(gameState.hearts).fill(0).map((_, i) => (
          <span key={i} role="img" aria-label="heart" className="text-2xl">❤️</span>
        ))}
      </div>
      <div className="text-center mb-4">
        Total Coins: {gameState.totalCoins}
      </div>
      <div className="text-center">
        Level: {gameState.level}
      </div>
      <SafeboxPopUp
        isOpen={isSafeboxOpen}
        onClose={() => setIsSafeboxOpen(false)}
        onOpen={(reward) => updateGameState({ specialCoins: gameState.specialCoins + reward })}
      />
      {isPlayPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <img src="/moneda.png" alt="Coin" className="w-16 h-16 mx-auto mb-4" />
            <p className="mb-4">Tap button to start earning</p>
            <button onClick={startGame} className="bg-green-500 text-white p-2 rounded">
              Start Play
            </button>
          </div>
        </div>
      )}
      {isWatchAdsPopupOpen && (
        <div className="fixed inset-0 bg-pink-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <img src="/boost.png" alt="Boost" className="w-16 h-16 mx-auto mb-4" />
            <p className="mb-4">Watch ads for free time boost</p>
            <p className="mb-4">Wait Time: {Math.floor(waitTimer / 60)}:{waitTimer % 60}</p>
            <button onClick={watchAds} className="bg-blue-500 text-white p-2 rounded">
              Watch Ads
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameArea;