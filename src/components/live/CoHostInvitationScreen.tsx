
import React, { useState } from 'react';
import CloseIcon from '../CloseIcon';
import ClockIcon from '../ClockIcon';
import FilterIcon from '../FilterIcon';
import SearchIcon from '../SearchIcon';
import BellOffIcon from '../BellOffIcon';
import ToggleSwitch from '../ToggleSwitch';
import UserIcon from '../UserIcon';
import PKInvitationModal from './PKInvitationModal';


interface CoHostInvitationScreenProps {
    onClose: () => void;
    onInvite: () => void;
}

const initialUsers = [
    {
        id: '1',
        name: 'Lest Go 500 K...',
        avatar: 'https://i.pravatar.cc/150?img=2',
        stats: 'Co-apresentador 2 vezes',
        age: 22,
        gender: 'female' as 'male' | 'female',
        level: 21,
    }
];

const UserListItem: React.FC<{ 
    user: typeof initialUsers[0]; 
    onInvite: () => void; 
}> = ({ user, onInvite }) => {
    return (
        <li className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#181818]"></div>
                </div>
                <div>
                    <p className="font-bold">{user.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        <UserIcon className="w-4 h-4" />
                        <span>1</span>
                        <span>{user.stats}</span>
                    </div>
                </div>
            </div>
            <button onClick={onInvite} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full transition-colors w-[110px]">
                Convidar
            </button>
        </li>
    );
};


const CoHostInvitationScreen: React.FC<CoHostInvitationScreenProps> = ({ onClose, onInvite: onStartPKBattle }) => {
    const [users] = useState(initialUsers);
    const [showPKModalForUser, setShowPKModalForUser] = useState<(typeof initialUsers[0]) | null>(null);

    const handleInvite = (user: typeof initialUsers[0]) => {
        setShowPKModalForUser(user);
        setTimeout(() => {
            onStartPKBattle();
        }, 1500);
    };

    return (
        <div className="absolute inset-0 bg-[#181818] z-30 flex flex-col font-sans text-white">
            <header className="p-4 flex items-center justify-between flex-shrink-0">
                <button onClick={onClose} aria-label="Fechar">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Co-apresentador com criadores</h1>
                <div className="flex items-center space-x-4">
                    <ClockIcon className="w-6 h-6 text-gray-300" />
                    <FilterIcon className="w-6 h-6 text-gray-300" />
                </div>
            </header>

            <main className="flex-grow px-4 pb-4 overflow-y-auto no-scrollbar">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou ID"
                        className="w-full bg-[#2a2a2a] rounded-full py-3 pl-11 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                        <BellOffIcon className="w-6 h-6 text-gray-400" />
                        <span className="font-medium">Aceitar apenas convites de amigos.</span>
                    </div>
                    <ToggleSwitch initialChecked={true} />
                </div>

                <div className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?img=50" alt="Faça novos amigos" className="w-12 h-12 rounded-full" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-[#2a2a2a]">?</div>
                        </div>
                        <div className="pr-2">
                            <p className="font-bold text-base leading-tight">Faça novos amigos com convites rápidos</p>
                        </div>
                    </div>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full transition-colors flex-shrink-0">
                        Enviar
                    </button>
                </div>

                <h2 className="text-gray-400 font-semibold mb-2">Amigos ( {users.length} )</h2>

                <ul>
                   {users.map(user => (
                       <UserListItem 
                            key={user.id}
                            user={user}
                            onInvite={() => handleInvite(user)}
                       />
                   ))}
                </ul>
            </main>
            {showPKModalForUser && (
                <PKInvitationModal user={showPKModalForUser} />
            )}
        </div>
    );
};

export default CoHostInvitationScreen;
