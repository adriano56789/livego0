
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import BlockIcon from '../components/BlockIcon';

interface BlockListScreenProps {
    setActiveScreen: (screen: string) => void;
}

const BlockListScreen: React.FC<BlockListScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Lista de Bloqueio
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <div className="w-24 h-24 border-2 border-gray-600 rounded-full flex items-center justify-center mb-6">
                    <BlockIcon className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Nenhum usuário bloqueado</h2>
                <p className="mt-2 max-w-xs">
                    Você pode bloquear usuários no perfil deles ou em uma live.
                </p>
            </main>
        </div>
    );
};

export default BlockListScreen;
