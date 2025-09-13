import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ToggleSwitch from '../components/ToggleSwitch';
import { api } from '../services/apiService';
import { ProfileUser } from './BroadcasterProfileScreen';

interface PushSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
    currentUserId: string;
}

const UserRow: React.FC<{ user: ProfileUser }> = ({ user }) => (
    <div className="flex items-center justify-between p-4 bg-[#1e1e1e]">
        <div className="flex items-center space-x-4">
            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
            <div>
                <p className="font-semibold text-white">{user.name}</p>
                <div className="flex items-center bg-gray-700 rounded-md px-2 py-0.5 text-xs font-semibold text-cyan-400 space-x-1 w-fit">
                    <span>Nível {user.level}</span>
                </div>
            </div>
        </div>
        <ToggleSwitch initialChecked={true} />
    </div>
);

const PushSettingsScreen: React.FC<PushSettingsScreenProps> = ({ setActiveScreen, currentUserId }) => {
    const [users, setUsers] = useState<ProfileUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.fetchFollowing(currentUserId).then(data => {
            setUsers(data);
        }).catch(err => {
            console.error(err);
            setError(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [currentUserId]);
    
    const renderContent = () => {
        if(loading) return <p className="text-center text-gray-500 p-8">Carregando...</p>;
        if(error) return <p className="text-center text-red-400 p-8">Erro ao carregar usuários: {error}</p>;
        if(users.length === 0) return <p className="text-center text-gray-500 p-8">Você não segue ninguém.</p>

        return (
             <div className="space-y-px">
                {users.map(user => <UserRow key={user.id} user={user} />)}
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('notificationSettings')} className="absolute" aria-label="Back to notification settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Iniciar configurações de push
                </h1>
            </header>
            <main className="py-4">
                {renderContent()}
            </main>
        </div>
    );
};

export default PushSettingsScreen;