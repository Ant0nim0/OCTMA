import React, { useState, useEffect } from 'react';
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import '@twa-dev/sdk';
import { useGameState } from './hooks/useGameState';
import Header from './components/Header';
import Footer from './components/Footer';
import GameArea from './components/GameArea';
import FriendsPage from './components/FriendsPage';
import RewardsPage from './components/RewardsPage';
import BoostPage from './components/BoostPage';
import AirdropPage from './components/AirdropPage';

function App() {
  const [currentPage, setCurrentPage] = useState('JUEGO');
  const { connected } = useTonConnect();
  const { gameState, updateGameState } = useGameState();

  useEffect(() => {
    if (connected && gameState.totalCoins === 0) {
      // Reward for connecting wallet
      updateGameState({ totalCoins: 10000 });
    }
  }, [connected]);

  const renderPage = () => {
    switch (currentPage) {
      case 'JUEGO':
        return <GameArea gameState={gameState} updateGameState={updateGameState} />;
      case 'FRIENDS':
        return <FriendsPage gameState={gameState} updateGameState={updateGameState} />;
      case 'REWARDS':
        return <RewardsPage gameState={gameState} updateGameState={updateGameState} />;
      case 'BOOST':
        return <BoostPage gameState={gameState} updateGameState={updateGameState} />;
      case 'AIRDROP':
        return <AirdropPage gameState={gameState} updateGameState={updateGameState} />;
      default:
        return <GameArea gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="App">
      <Header gameState={gameState} />
      <div className="wallet-connect">
        <TonConnectButton />
      </div>
      {renderPage()}
      <Footer currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;