
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface PurchaseHistoryScreenProps {
    setActiveScreen: (screen: string) => void;
}

const PurchaseHistoryScreen: React.FC<PurchaseHistoryScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('wallet')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Histórico de Compras
                </h1>
            </header>
            <main className="flex items-center justify-center h-[80vh]">
                <p className="text-gray-500">Nenhum histórico de compras.</p>
            </main>
        </div>
    );
};

export default PurchaseHistoryScreen;
