
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface FollowingScreenProps {
    setActiveScreen: (screen: string) => void;
}

const followingUsers = [
  { name: 'Rainha PK', id: '66345102', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'DJ Code', id: '12345678', avatar: 'https://picsum.photos/seed/4/400/600' },
  { name: 'Aventureira', id: '87654321', avatar: 'https://picsum.photos/seed/5/400/600' },
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

const FollowingScreen: React.FC<FollowingScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Seguido
                </h1>
            </header>
            <main>
                {followingUsers.length > 0 ? (
                    <ul>
                        {followingUsers.map(user => <UserListItem key={user.id} {...user} setActiveScreen={setActiveScreen} />)}
                    </ul>
                ) : (
                    <div className="text-center pt-20 text-gray-500">
                        <p>Ainda não segue ninguém.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FollowingScreen;