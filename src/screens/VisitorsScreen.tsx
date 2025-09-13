import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import { api } from '../services/apiService';
import { ProfileUser } from './BroadcasterProfileScreen';

interface VisitorsScreenProps {
    setActiveScreen: (screen: string, userId?: string) => void;
    userId: string;
}

interface VisitorItem {
    user: ProfileUser;
    isFollowing: boolean;
}

const UserListItem: React.FC<{ item: VisitorItem; setActiveScreen: (screen: string, userId?: string) => void; }> = ({ item, setActiveScreen }) => (
    <li className="flex items-center p-4 space-x-4">
        <div onClick={() => setActiveScreen('broadcasterProfile', item.user.id)} className="flex items-center space-x-4 flex-grow cursor-pointer">
            <img src={item.user.avatarUrl} alt={item.user.name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
                <p className="font-semibold text-white">{item.user.name}</p>
                <p className="text-sm text-gray-400">Identificação: {item.user.id}</p>
            </div>
        </div>
        <button className={`font-semibold py-2 px-6 rounded-full text-sm flex-shrink-0 ${item.isFollowing ? 'bg-[#3a3a3a] text-gray-300' : 'bg-green-500 text-white'}`}>
            {item.isFollowing ? 'Seguido' : 'Seguir'}
        </button>
    </li>
);

const VisitorsScreen: React.FC<VisitorsScreenProps> = ({ setActiveScreen, userId }) => {
    const [visitors, setVisitors] = useState<VisitorItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.fetchVisitors(userId).then(data => {
            setVisitors(data);
        }).catch(err => {
            console.error("Failed to fetch visitors:", err);
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [userId]);
    
    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500 p-8">Carregando...</p>;
        if (error) return <p className="text-center text-red-400 p-8">Erro ao carregar visitantes: {error}</p>;
        if (visitors.length === 0) return <p className="text-center text-gray-500 p-8">Nenhum visitante recente.</p>;

        return (
            <ul>
                {visitors.map(item => <UserListItem key={item.user.id} item={item} setActiveScreen={setActiveScreen} />)}
            </ul>
        )
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Visitantes ( {loading ? '...' : visitors.length} )
                </h1>
            </header>
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default VisitorsScreen;