import React from 'react';

interface FooterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage }) => {
  const pages = ['JUEGO', 'FRIENDS', 'REWARDS', 'BOOST', 'AIRDROP'];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
      <div className="flex justify-around">
        {pages.map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded ${
              currentPage === page ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;