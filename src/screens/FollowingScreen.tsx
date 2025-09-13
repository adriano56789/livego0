import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import { api } from '../services/apiService';
import { ProfileUser } from './BroadcasterProfileScreen';

interface FollowingScreenProps {
    setActiveScreen: (screen: string, userId?: string) => void;
    userId: string;
}

const UserListItem: React.FC<{ user: ProfileUser; setActiveScreen: (screen: string, userId?: string) => void; }> = ({ user, setActiveScreen }) => (
    <li onClick={() => setActiveScreen('broadcasterProfile', user.id)} className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-[#1f1f1f]">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-sm text-gray-400">Identificação: {user.id}</p>
        </div>
        <div className="bg-[#3a3a3a] text-gray-300 font-semibold py-2 px-6 rounded-full text-sm">
            Seguido
        </div>
    </li>
);

const FollowingScreen: React.FC<FollowingScreenProps> = ({ setActiveScreen, userId }) => {
    const [following, setFollowing] = useState<ProfileUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.fetchFollowing(userId).then(data => {
            setFollowing(data);
        }).catch(err => {
            console.error("Failed to fetch following:", err);
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [userId]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 p-8">Carregando...</p>;
        if (error) return <p className="text-center text-red-400 p-8">Erro ao carregar lista: {error}</p>;
        if (following.length === 0) return <div className="text-center pt-20 text-gray-500"><p>Ainda não segue ninguém.</p></div>;
        
        return (
            <ul>
                {following.map(user => <UserListItem key={user.id} user={user} setActiveScreen={setActiveScreen} />)}
            </ul>
        );
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('broadcasterProfile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Seguido
                </h1>
            </header>
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default FollowingScreen;