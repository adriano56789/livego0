
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import SearchIcon from './SearchIcon';

interface HeaderProps {
  setActiveScreen: (screen: string) => void;
  onOpenReminderPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveScreen, onOpenReminderPanel }) => {
  const [activeCategory, setActiveCategory] = useState('PK');

  return (
    <header className="sticky top-0 z-10 bg-[#121212] py-2 px-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-bold">LiveGo</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenReminderPanel}
            className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-lg"
            aria-label="Open reminders"
          >
            T
          </button>
          <button onClick={() => setActiveScreen('searchFriends')} aria-label="Search">
            <SearchIcon className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
      <nav className="overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <ul className="flex items-center space-x-5 text-gray-400">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <button
                onClick={() => setActiveCategory(category)}
                className={`pb-1 transition-colors duration-200 ${
                  activeCategory === category
                    ? 'text-white border-b-2 border-white font-semibold'
                    : 'hover:text-white'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
