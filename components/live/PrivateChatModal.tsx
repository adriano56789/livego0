import React, { useState } from 'react';
import MoreHorizIcon from '../icons/MoreHorizIcon';
import FemaleIcon from '../icons/FemaleIcon';
import LevelBadgeIcon from '../icons/LevelBadgeIcon';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';

interface PrivateChatModalProps {
    onClose: () => void;
    streamerName: string;
    streamerAvatar: string;
}

const PrivateChatModal: React.FC<PrivateChatModalProps> = ({ onClose, streamerName, streamerAvatar }) => {
    const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

    const renderOptionsModal = () => (
        <div className="fixed inset-0 flex flex-col justify-end z-[60]" onClick={() => setOptionsModalOpen(false)}>
            <div className="bg-[#282828] rounded-t-2xl p-2" onClick={e => e.stopPropagation()}>
                <div className="bg-[#1e1e1e] rounded-xl text-center">
                    <button className="w-full p-4 text-red-500 font-semibold border-b border-gray-600">Cancelar amizade</button>
                    <button className="w-full p-4 text-white font-semibold">Bloquear</button>
                </div>
                <button onClick={() => setOptionsModalOpen(false)} className="w-full text-center p-4 text-blue-400 font-bold bg-[#1e1e1e] rounded-xl mt-2">Cancelar</button>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black/70 flex items-end z-50" onClick={onClose}>
            <div 
                className="bg-black w-full h-[90%] rounded-t-2xl flex flex-col text-white" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <button onClick={onClose} aria-label="Close private chat">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="text-left">
                            <h1 className="text-lg font-semibold">{streamerName}</h1>
                            <div className="flex items-center space-x-1 mt-1">
                                <div className="flex items-center bg-pink-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                    <FemaleIcon className="w-2.5 h-2.5"/>
                                    <span>22</span>
                                </div>
                                <div className="flex items-center bg-orange-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                    <LevelBadgeIcon className="w-2.5 h-2.5" />
                                    <span>21</span>
                                </div>
                            </div>
                            <p className="text-xs text-green-400 mt-1">On-line</p>
                        </div>
                    </div>
                    <button onClick={() => setOptionsModalOpen(true)}>
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
                     <div className="flex justify-end">
                        <div className="bg-purple-600 p-3 rounded-lg max-w-xs">
                            <p>Tudo ótimo! E com você? Adoro sua live!</p>
                            <p className="text-xs text-purple-200 text-right mt-1">21:50</p>
                        </div>
                    </div>
                </main>
                <footer className="p-4 bg-black border-t border-gray-800 flex-shrink-0">
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
                {isOptionsModalOpen && renderOptionsModal()}
            </div>
        </div>
    );
};

export default PrivateChatModal;