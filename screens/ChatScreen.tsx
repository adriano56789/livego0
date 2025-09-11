import React, { useState } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import MoreHorizIcon from '../components/icons/MoreHorizIcon';
import FemaleIcon from '../components/icons/FemaleIcon';
import LevelBadgeIcon from '../components/icons/LevelBadgeIcon';
import { ProfileUser } from './BroadcasterProfileScreen';
import MaleIcon from '../components/icons/MaleIcon';

interface ChatScreenProps {
    user: ProfileUser;
    onBack: () => void;
    onOpenProfile: (user: ProfileUser) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onBack, onOpenProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const renderModal = () => (
        <div className="fixed inset-0 flex flex-col justify-end z-30" onClick={() => setIsModalOpen(false)}>
            <div className="bg-[#282828] rounded-t-2xl p-2" onClick={e => e.stopPropagation()}>
                <div className="bg-[#1e1e1e] rounded-xl text-center">
                    <button className="w-full p-4 text-red-500 font-semibold border-b border-gray-600">Cancelar amizade</button>
                    <button className="w-full p-4 text-white font-semibold">Bloquear</button>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-full text-center p-4 text-blue-400 font-bold bg-[#1e1e1e] rounded-xl mt-2">Cancelar</button>
            </div>
        </div>
    );

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} aria-label="Back">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => onOpenProfile(user)} className="text-left">
                        <h1 className="text-lg font-semibold">{user.name}</h1>
                        <div className="flex items-center space-x-1 mt-1">
                            <div className={`flex items-center ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                                {user.gender === 'male' ? <MaleIcon className="w-2.5 h-2.5"/> : <FemaleIcon className="w-2.5 h-2.5"/>}
                                <span>{user.age}</span>
                            </div>
                            <div className="flex items-center bg-orange-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                <LevelBadgeIcon className="w-2.5 h-2.5" />
                                <span>{user.level}</span>
                            </div>
                        </div>
                        <p className="text-xs text-green-400 mt-1">On-line</p>
                    </button>
                </div>
                <button onClick={() => setIsModalOpen(true)}>
                    <MoreHorizIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-grow p-4 space-y-4 overflow-y-auto no-scrollbar">
                <div className="flex">
                    <div className="bg-[#2a2a2a] p-3 rounded-lg max-w-xs">
                        <p>Olá! Tudo bem?</p>
                        <p className="text-xs text-gray-500 text-right mt-1">21:42</p>
                    </div>
                </div>
            </main>
            <footer className="p-4 bg-black border-t border-gray-800">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="Sua mensagem..."
                        className="flex-grow bg-[#2a2a2a] rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-full">
                        Enviar
                    </button>
                </div>
            </footer>
            {isModalOpen && renderModal()}
        </div>
    );
};

export default ChatScreen;