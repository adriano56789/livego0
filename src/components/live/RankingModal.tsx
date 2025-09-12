
import React, { useState } from 'react';
import CloseIcon from '../CloseIcon';
import DiamondIcon from '../DiamondIcon';
import MaleIcon from '../MaleIcon';
import FemaleIcon from '../FemaleIcon';
import CrownIcon from '../CrownIcon';

interface RankingModalProps {
    onClose: () => void;
}

const dailyRanking = [
    { rank: 1, name: 'QUALITY', avatar: 'https://i.pravatar.cc/150?img=10', gender: 'male', age: 32, badge: 56, badgeColor: 'bg-purple-500', score: '111.50K' },
    { rank: 2, name: 'nachodaddy', avatar: 'https://i.pravatar.cc/150?img=11', gender: 'male', age: 50, badge: 38, badgeColor: 'bg-green-500', score: '399' },
    { rank: 3, name: 'Biazinha✨', avatar: 'https://i.pravatar.cc/150?img=12', gender: 'female', age: 25, badge: 21, badgeColor: 'bg-orange-500', score: '30' },
    { rank: 4, name: 'marina da samara👄', avatar: 'https://i.pravatar.cc/150?img=13', gender: 'female', age: 22, badge: 21, badgeColor: 'bg-orange-500', score: '14' },
    { rank: 5, name: 'MineiraFake✨Ui✨', avatar: 'https://i.pravatar.cc/150?img=14', gender: 'female', age: 23, badge: 19, badgeColor: 'bg-yellow-500', score: '12' },
];

const weeklyRanking = [
    { rank: 1, name: 'nachodaddy', avatar: 'https://i.pravatar.cc/150?img=11', gender: 'male', age: 50, badge: 38, badgeColor: 'bg-green-500', score: '1.2M' },
    { rank: 2, name: 'QUALITY', avatar: 'https://i.pravatar.cc/150?img=10', gender: 'male', age: 32, badge: 56, badgeColor: 'bg-purple-500', score: '980K' },
    { rank: 3, name: 'MineiraFake✨Ui✨', avatar: 'https://i.pravatar.cc/150?img=14', gender: 'female', age: 23, badge: 19, badgeColor: 'bg-yellow-500', score: '50K' },
    { rank: 4, name: 'Biazinha✨', avatar: 'https://i.pravatar.cc/150?img=12', gender: 'female', age: 25, badge: 21, badgeColor: 'bg-orange-500', score: '25K' },
    { rank: 5, name: 'marina da samara👄', avatar: 'https://i.pravatar.cc/150?img=13', gender: 'female', age: 22, badge: 21, badgeColor: 'bg-orange-500', score: '10K' },
].map((user, index) => ({ ...user, rank: index + 1 }));

const monthlyRanking = [
    { rank: 1, name: 'Biazinha✨', avatar: 'https://i.pravatar.cc/150?img=12', gender: 'female', age: 25, badge: 21, badgeColor: 'bg-orange-500', score: '5.5M' },
    { rank: 2, name: 'QUALITY', avatar: 'https://i.pravatar.cc/150?img=10', gender: 'male', age: 32, badge: 56, badgeColor: 'bg-purple-500', score: '4.2M' },
    { rank: 3, name: 'nachodaddy', avatar: 'https://i.pravatar.cc/150?img=11', gender: 'male', age: 50, badge: 38, badgeColor: 'bg-green-500', score: '3.1M' },
    { rank: 4, name: 'marina da samara👄', avatar: 'https://i.pravatar.cc/150?img=13', gender: 'female', age: 22, badge: 21, badgeColor: 'bg-orange-500', score: '1.8M' },
    { rank: 5, name: 'MineiraFake✨Ui✨', avatar: 'https://i.pravatar.cc/150?img=14', gender: 'female', age: 23, badge: 19, badgeColor: 'bg-yellow-500', score: '900K' },
].map((user, index) => ({ ...user, rank: index + 1 }));

type RankingData = typeof dailyRanking;

const dataMap: { [key: string]: RankingData } = {
    daily: dailyRanking,
    weekly: weeklyRanking,
    monthly: monthlyRanking,
};

type TimeTab = 'daily' | 'weekly' | 'monthly';

const TabButton: React.FC<{ tab: TimeTab; label: string; activeTab: TimeTab; onClick: (tab: TimeTab) => void }> = ({ tab, label, activeTab, onClick }) => (
    <button
        onClick={() => onClick(tab)}
        className={`pb-2 text-lg font-semibold transition-colors ${
            activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-500'
        }`}
    >
        {label}
    </button>
);

const UserBadge: React.FC<{ user: RankingData[0] }> = ({ user }) => (
    <div className="flex items-center space-x-1 justify-center">
        <div className={`flex items-center ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-2 py-0.5 text-xs font-semibold space-x-1 text-white`}>
            {user.gender === 'male' ? <MaleIcon className="w-3 h-3"/> : <FemaleIcon className="w-3 h-3"/>}
            <span>{user.age}</span>
        </div>
        <div className={`flex items-center ${user.badgeColor} rounded-full px-2 py-0.5 text-xs font-semibold text-white`}>
            <span>{user.badge}</span>
        </div>
    </div>
);

const UserRow: React.FC<{ user: RankingData[0] }> = ({ user }) => (
    <li className="flex items-center p-3 space-x-4">
        <span className="text-xl font-bold text-gray-400 w-6 text-center">{user.rank}</span>
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
            <p className="font-semibold text-white truncate">{user.name}</p>
            <div className="flex">
                <UserBadge user={user} />
            </div>
        </div>
        <div className="flex items-center space-x-1 text-yellow-400 flex-shrink-0">
            <span className="font-bold">{user.score}</span>
            <DiamondIcon className="w-5 h-5" />
        </div>
    </li>
);

const RankingModal: React.FC<RankingModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<TimeTab>('daily');
    const rankingData = dataMap[activeTab];

    const top1 = rankingData.find(u => u.rank === 1);
    const others = rankingData.filter(u => u.rank > 1);

    return (
        <div className="absolute inset-0 bg-[#21212b] z-30 flex flex-col font-sans">
            <header className="p-4 flex items-center text-white flex-shrink-0">
                <button onClick={onClose} aria-label="Fechar">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-xl font-bold">Ranking de Contribuição</h1>
                <div className="w-6"></div>
            </header>

            <nav className="px-6 flex items-center space-x-8 border-b border-gray-700 flex-shrink-0">
                <TabButton tab="daily" label="Diária" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton tab="weekly" label="Semanal" activeTab={activeTab} onClick={setActiveTab} />
                <TabButton tab="monthly" label="Mensal" activeTab={activeTab} onClick={setActiveTab} />
            </nav>

            <main className="flex-grow overflow-y-auto p-4 no-scrollbar">
                {top1 ? (
                    <>
                        <div className="flex flex-col items-center text-center my-4">
                            <div className="relative">
                                <img src={top1.avatar} alt={top1.name} className="w-24 h-24 rounded-full border-4 border-yellow-400" />
                                <div className="absolute -top-3 -right-3">
                                    <CrownIcon className="w-10 h-10 text-yellow-400" style={{ transform: 'rotate(20deg)' }} />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#FDE047] to-[#F59E0B] px-4 py-1 rounded-md text-black font-bold text-sm shadow-lg">
                                    TOP 1
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mt-8 text-white">{top1.name}</h2>
                            <div className="my-2">
                                <UserBadge user={top1} />
                            </div>
                            <div className="flex items-center space-x-2 text-yellow-400 text-2xl font-bold">
                                <span>{top1.score}</span>
                                <DiamondIcon className="w-7 h-7" />
                            </div>
                        </div>
                        <ul>
                            {others.map(user => (
                                <UserRow key={user.name + user.rank} user={user} />
                            ))}
                        </ul>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-center h-full">
                        <p className="text-gray-500">Nenhum ranking apropriado.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RankingModal;
