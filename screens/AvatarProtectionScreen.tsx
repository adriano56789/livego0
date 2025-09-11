
import React, { useState } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface AvatarProtectionScreenProps {
    setActiveScreen: (screen: string) => void;
}

const AvatarProtectionScreen: React.FC<AvatarProtectionScreenProps> = ({ setActiveScreen }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center justify-between">
                <button onClick={() => setActiveScreen('profile')}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold">Proteção de avatar</h1>
                <button className="font-semibold text-green-400">Salvar</button>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mb-6">
                    <img
                        src="https://picsum.photos/seed/profile/128/128"
                        alt="User avatar"
                        className="w-32 h-32 rounded-full border-4 border-black"
                    />
                </div>
                <h2 className="text-2xl font-bold">Proteja seu avatar</h2>
                <p className="text-gray-400 mt-2 max-w-sm">
                    Ative a proteção para evitar que outras pessoas usem sua foto de perfil, prevenindo golpes e perfis falsos.
                </p>
            </main>
            <footer className="p-8">
                <button onClick={() => setIsEnabled(!isEnabled)} className="w-full bg-[#2a2a2a] rounded-lg p-4 flex justify-between items-center text-lg">
                    <span>Ativar Proteção de Avatar</span>
                    <div className={`w-14 h-8 rounded-full p-1 transition-colors ${isEnabled ? 'bg-green-500' : 'bg-gray-500'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : ''}`}></div>
                    </div>
                </button>
            </footer>
        </div>
    );
};

export default AvatarProtectionScreen;
