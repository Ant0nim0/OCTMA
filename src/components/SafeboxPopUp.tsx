import React, { useState, useEffect } from 'react';

interface SafeboxPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (reward: number) => void;
}

const SafeboxPopUp: React.FC<SafeboxPopUpProps> = ({ isOpen, onClose, onOpen }) => {
  const [countdown, setCountdown] = useState(24 * 60 * 60); // 24 hours in seconds
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleOpen = () => {
    const correctCode = '123456'; // This should be generated daily
    if (code.join('') === correctCode) {
      setIsCodeCorrect(true);
      onOpen(1); // Reward 1 special coin
    } else {
      setIsCodeCorrect(false);
      setCode(Array(6).fill(''));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Safebox</h2>
        <p className="mb-4">Time remaining: {Math.floor(countdown / 3600)}:{Math.floor((countdown % 3600) / 60)}:{countdown % 60}</p>
        <div className="flex mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className={`w-12 h-12 text-center mx-1 border ${
                isCodeCorrect === false ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => {
                const emptyIndex = code.findIndex((d) => d === '');
                if (emptyIndex !== -1) handleCodeChange(emptyIndex, num.toString());
              }}
              className="bg-gray-200 p-2 rounded"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCode(Array(6).fill(''))}
            className="bg-red-500 text-white p-2 rounded"
          >
            X
          </button>
        </div>
        <button onClick={handleOpen} className="bg-blue-500 text-white p-2 rounded w-full mb-2">
          Open
        </button>
        <button onClick={onClose} className="bg-gray-300 p-2 rounded w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default SafeboxPopUp;