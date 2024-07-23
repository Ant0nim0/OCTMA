import React, { useEffect, useState } from 'react';
import { Profile } from '../types';

interface HeaderProps {
  gameState: {
    totalCoins: number;
  };
}

const Header: React.FC<HeaderProps> = ({ gameState }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get user profile
    window.parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');

    // Get user token
    window.parent.postMessage({ playdeck: { method: 'getToken' } }, '*');

    const handleMessage = (event: MessageEvent) => {
      const playdeck = event.data?.playdeck;
      if (!playdeck) return;

      if (playdeck.method === 'getUserProfile') {
        setProfile(playdeck.value);
      }

      if (playdeck.method === 'getToken') {
        setToken(playdeck.value.token);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        {profile && (
          <>
            <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
            <div>
              <p className="font-bold">{profile.username}</p>
              <p className="text-xs">{token}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center">
        <p className="mr-2">Total Coins: {gameState.totalCoins}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          CONNECT WALLET
        </button>
      </div>
    </header>
  );
};

export default Header;