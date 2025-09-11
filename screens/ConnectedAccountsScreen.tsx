
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface ConnectedAccountsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const ConnectedAccountsScreen: React.FC<ConnectedAccountsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Contas Conectadas
                </h1>
            </header>
            <main className="flex-grow p-6 space-y-6">
                <p className="text-gray-400">Esta é uma conta do Google que você usou para entrar no LiveGo. Você pode desconectar para entrar com outra conta.</p>
                <div className="bg-[#1e1e1e] rounded-lg p-4 flex items-center space-x-4">
                    <img src="https://picsum.photos/seed/user-settings/48/48" alt="User avatar" className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-semibold">Você</p>
                        <p className="text-sm text-gray-400">livego@example.com</p>
                    </div>
                </div>
            </main>
            <footer className="p-6">
                <button className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold py-3 rounded-lg transition-colors text-lg">
                    Desconectar
                </button>
            </footer>
        </div>
    );
};

export default ConnectedAccountsScreen;
