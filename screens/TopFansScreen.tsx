
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import DiamondIcon from '../components/icons/DiamondIcon';

interface TopFansScreenProps {
    setActiveScreen: (screen: string) => void;
}

const FanItem: React.FC<{rank: number, name: string, country: string, avatar: string, points: string}> = ({rank, name, avatar, country, points}) => {
    return (
        <li className="flex items-center p-3 space-x-4">
            <div className="w-8 text-center">
                {rank === 1 ? (
                    <div className="w-8 h-8 bg-purple-600 font-bold text-xl flex items-center justify-center text-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>1</div>
                ) : (
                    <span className="text-xl font-bold text-gray-400">{rank}</span>
                )}
            </div>
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{name}</span>
                     <img src={`https://flagcdn.com/${country}.svg`} width="20" alt={country} />
                </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
                <DiamondIcon className="w-5 h-5" />
                <span className="font-bold">{points}</span>
            </div>
        </li>
    );
};

const TopFansScreen: React.FC<TopFansScreenProps> = ({ setActiveScreen }) => {
    const fans = [
        { rank: 1, name: 'Rainha PK', avatar: 'https://i.pravatar.cc/150?img=1', country: 'us', points: '20.000' },
        { rank: 2, name: 'Lest Go 500 K...', avatar: 'https://i.pravatar.cc/150?img=2', country: 'br', points: '5.001' },
    ];

    return (
        <div className="bg-[#1f1f1f] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-700 bg-[#121212]">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Top Fãs
                </h1>
            </header>
            <main className="p-2">
                <ul>
                    {fans.map(fan => <FanItem key={fan.rank} {...fan} />)}
                </ul>
            </main>
        </div>
    );
};

export default TopFansScreen;
