
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ToggleSwitch from '../components/ToggleSwitch';

interface PushSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const users = [
    { name: 'Lest Go 500 K...', level: 2, avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'PK Pro', level: 2, avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Fernando1135', level: 2, avatar: 'https://i.pravatar.cc/150?img=3' },
];

const UserRow: React.FC<{ name: string; level: number; avatar: string }> = ({ name, level, avatar }) => (
    <div className="flex items-center justify-between p-4 bg-[#1e1e1e]">
        <div className="flex items-center space-x-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
            <div>
                <p className="font-semibold text-white">{name}</p>
                <div className="flex items-center bg-gray-700 rounded-md px-2 py-0.5 text-xs font-semibold text-cyan-400 space-x-1 w-fit">
                    <span>Nível {level}</span>
                </div>
            </div>
        </div>
        <ToggleSwitch initialChecked={true} />
    </div>
);

const PushSettingsScreen: React.FC<PushSettingsScreenProps> = ({ setActiveScreen }) => {
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
                <div className="space-y-px">
                    {users.map(user => <UserRow key={user.name} {...user} />)}
                </div>
            </main>
        </div>
    );
};

export default PushSettingsScreen;
