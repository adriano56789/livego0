
import React from 'react';
import ChevronLeftIcon from '../ChevronLeftIcon';
import DiamondIcon from '../DiamondIcon';
import CoinIcon from '../CoinIcon';
import ChevronRightIcon from '../ChevronRightIcon';
import QuestionMarkCircleIcon from '../QuestionMarkCircleIcon';

interface PurchaseDiamondsModalProps {
    onClose: () => void;
    onPurchaseClick: (pkg: { amount: number; price: number }) => void;
}

const diamondPackages = [
    { amount: 100, price: 4.99 },
    { amount: 525, price: 25.99 },
    { amount: 1050, price: 49.99 },
    { amount: 2100, price: 99.99 },
    { amount: 5250, price: 249.99 },
    { amount: 10500, price: 499.99 },
];

const PurchaseCard: React.FC<{ amount: number; price: number; onClick: () => void; }> = ({ amount, price, onClick }) => (
    <button onClick={onClick} className="bg-[#282828] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-[#3a3a3a] transition-colors w-full">
        <div className="flex items-center space-x-2">
            <DiamondIcon className="w-6 h-6" />
            <span className="text-xl font-bold">{amount.toLocaleString('pt-BR')}</span>
        </div>
        <div className="mt-2 bg-[#3a3a3a] text-white text-sm font-semibold py-1 px-4 rounded-full">
            R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
    </button>
);

const PurchaseDiamondsModal: React.FC<PurchaseDiamondsModalProps> = ({ onClose, onPurchaseClick }) => {
    return (
        <div className="absolute inset-0 bg-[#121212] min-h-screen text-white z-30">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <button onClick={onClose}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-6 text-lg font-semibold">
                    <button className={'text-white'}>
                        Diamante
                        <div className="h-0.5 w-full bg-white mt-1"></div>
                    </button>
                    <button className={'text-gray-500'}>
                        Ganhos
                    </button>
                </div>
                {/* Placeholder for menu icon, doesn't need to be functional for modal */}
                <div className="w-6 h-6" />
            </header>

            <main className="p-4">
                <div className="bg-[#1e1e1e] rounded-lg p-4 flex justify-around">
                    <div className="text-center">
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <span>Diamantes</span>
                            <ChevronRightIcon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                            <DiamondIcon className="w-6 h-6" />
                            <span className="text-2xl font-bold">50.000</span>
                        </div>
                    </div>
                     <div className="text-center">
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <span>Ganhos</span>
                            <QuestionMarkCircleIcon className="w-4 h-4" />
                            <ChevronRightIcon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                            <CoinIcon className="w-6 h-6" />
                            <span className="text-2xl font-bold">125.000</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    {diamondPackages.map(pkg => (
                        <PurchaseCard key={pkg.amount} amount={pkg.amount} price={pkg.price} onClick={() => onPurchaseClick(pkg)} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PurchaseDiamondsModal;
