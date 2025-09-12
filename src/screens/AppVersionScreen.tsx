
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import InformationCircleIcon from '../components/InformationCircleIcon';

interface AppVersionScreenProps {
    setActiveScreen: (screen: string) => void;
}

const AppVersionScreen: React.FC<AppVersionScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Versão do aplicativo
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-start pt-20 p-6 text-center">
                <div className="w-24 h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
                    <InformationCircleIcon className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold">LiveGo</h2>
                <p className="text-gray-400 mt-2">Sua versão atual é 1.0.0</p>
                <div className="w-full max-w-sm mt-12 bg-[#1e1e1e] rounded-lg overflow-hidden">
                    <div className="flex justify-between p-4 border-b border-gray-700">
                        <span className="text-gray-300">Última versão</span>
                        <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between p-4">
                        <span className="text-gray-300">Status</span>
                        <span className="text-green-400 font-semibold">Atualizado</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppVersionScreen;
