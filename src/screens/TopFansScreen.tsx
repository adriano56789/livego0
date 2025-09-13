import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import DiamondIcon from '../components/icons/DiamondIcon';
import { api } from '../services/apiService';
import { ProfileUser } from './BroadcasterProfileScreen';

interface TopFansScreenProps {
    setActiveScreen: (screen: string) => void;
    userId: string;
}

const FanItem: React.FC<{rank: number, user: ProfileUser, points: string}> = ({rank, user, points}) => {
    return (
        <li className="flex items-center p-3 space-x-4">
            <div className="w-8 text-center">
                {rank === 1 ? (
                    <div className="w-8 h-8 bg-purple-600 font-bold text-xl flex items-center justify-center text-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>1</div>
                ) : (
                    <span className="text-xl font-bold text-gray-400">{rank}</span>
                )}
            </div>
            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{user.name}</span>
                     <img src={`https://flagcdn.com/${user.country}.svg`} width="20" alt={user.country} />
                </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
                <DiamondIcon className="w-5 h-5" />
                <span className="font-bold">{points}</span>
            </div>
        </li>
    );
};

const TopFansScreen: React.FC<TopFansScreenProps> = ({ setActiveScreen, userId }) => {
    const [fans, setFans] = useState<ProfileUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.fetchFans(userId).then(data => {
            setFans(data);
        }).catch(err => {
            console.error(err);
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [userId]);
    
    const topFansData = fans.map((fan, index) => ({
        ...fan,
        rank: index + 1,
        points: `${Math.floor(Math.random() * 20000).toLocaleString()}`
    })).sort((a,b) => b.points.localeCompare(a.points, undefined, { numeric: true }));


    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 p-8">Carregando...</p>;
        if (error) return <p className="text-center text-red-400 p-8">Erro ao carregar top fãs: {error}</p>;
        if (topFansData.length === 0) return <p className="text-center text-gray-500 p-8">Nenhum fã encontrado.</p>;

        return (
             <ul>
                {topFansData.map(fan => <FanItem key={fan.id} rank={fan.rank} user={fan} points={fan.points} />)}
            </ul>
        );
    }

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
                {renderContent()}
            </main>
        </div>
    );
};

export default TopFansScreen;