
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';

interface FansScreenProps {
    setActiveScreen: (screen: string) => void;
}

const fans = [
  { name: 'Lest Go 500 K...', id: '55218901', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'PK Pro', id: '99887705', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Fernando1135', id: '14431934', avatar: 'https://i.pravatar.cc/150?img=4' },
];

const UserListItem: React.FC<{ name: string; id: string; avatar: string; setActiveScreen: (screen: string) => void; }> = ({ name, id, avatar, setActiveScreen }) => (
    <li onClick={() => setActiveScreen('broadcasterProfile')} className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-[#1f1f1f]">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-gray-400">Identificação: {id}</p>
        </div>
        <div className="bg-[#3a3a3a] text-gray-300 font-semibold py-2 px-6 rounded-full text-sm">
            Seguido
        </div>
    </li>
);

const FansScreen: React.FC<FansScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Fãs
                </h1>
            </header>
            <main>
                <ul>
                    {fans.map(user => <UserListItem key={user.id} {...user} setActiveScreen={setActiveScreen} />)}
                </ul>
            </main>
        </div>
    );
};

export default FansScreen;
