import { useState, useEffect } from 'react';

interface GameState {
  coinValue: number;
  coinsPerMinute: number;
  totalCoins: number;
  specialCoins: number;
  level: number;
  hearts: number;
  isPlaying: boolean;
  waitTime: number;
  playTime: number;
  friends: string[];
  rewards: {
    daily: {
      day: number;
      lastClaimed: string | null;
    };
    social: {
      youtube: boolean;
      tiktok: boolean;
      telegram: boolean;
    };
  };
  boosts: {
    coinValue: number;
    coinsPerMinute: number;
    waitTimeReduction: number;
    extraHearts: number;
    hammerReduction: number;
  };
}

const initialGameState: GameState = {
  coinValue: 1,
  coinsPerMinute: 500,
  totalCoins: 0,
  specialCoins: 0,
  level: 1,
  hearts: 3,
  isPlaying: false,
  waitTime: 12 * 60,
  playTime: 60,
  friends: [],
  rewards: {
    daily: { day: 0, lastClaimed: null },
    social: { youtube: false, tiktok: false, telegram: false }
  },
  boosts: {
    coinValue: 0,
    coinsPerMinute: 0,
    waitTimeReduction: 0,
    extraHearts: 0,
    hammerReduction: 0
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : initialGameState;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prevState => ({ ...prevState, ...updates }));
  };

  return { gameState, updateGameState };
};