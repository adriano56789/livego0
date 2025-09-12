
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';

interface VisitorsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const visitors = [
  { name: 'Lest Go 500 K...', id: '55218901', avatar: 'https://i.pravatar.cc/150?img=2', isFollowing: true },
  { name: 'Rainha PK', id: '66345102', avatar: 'https://i.pravatar.cc/150?img=1', isFollowing: false },
];

const UserListItem: React.FC<{ name: string; id: string; avatar: string; isFollowing: boolean; setActiveScreen: (screen: string) => void; }> = ({ name, id, avatar, isFollowing, setActiveScreen }) => (
    <li className="flex items-center p-4 space-x-4">
        <div onClick={() => setActiveScreen('broadcasterProfile')} className="flex items-center space-x-4 flex-grow cursor-pointer">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
            <div className="flex-grow">
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-gray-400">Identificação: {id}</p>
            </div>
        </div>
        <button className={`font-semibold py-2 px-6 rounded-full text-sm flex-shrink-0 ${isFollowing ? 'bg-[#3a3a3a] text-gray-300' : 'bg-green-500 text-white'}`}>
            {isFollowing ? 'Seguido' : 'Seguir'}
        </button>
    </li>
);

const VisitorsScreen: React.FC<VisitorsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Visitantes ( {visitors.length} )
                </h1>
            </header>
            <main>
                <ul>
                    {visitors.map(user => <UserListItem key={user.id} {...user} setActiveScreen={setActiveScreen} />)}
                </ul>
            </main>
        </div>
    );
};

export default VisitorsScreen;
