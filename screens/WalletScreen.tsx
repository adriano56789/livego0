import React, { useState } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import MenuIcon from '../components/icons/MenuIcon';
import DiamondIcon from '../components/icons/DiamondIcon';
import CoinIcon from '../components/icons/CoinIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import QuestionMarkCircleIcon from '../components/icons/QuestionMarkCircleIcon';

interface WalletScreenProps {
    setActiveScreen: (screen: string) => void;
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
    <button onClick={onClick} className="bg-[#282828] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-[#3a3a3a] transition-colors">
        <div className="flex items-center space-x-2">
            <DiamondIcon className="w-6 h-6" />
            <span className="text-xl font-bold">{amount.toLocaleString('pt-BR')}</span>
        </div>
        <div className="mt-2 bg-[#3a3a3a] text-white text-sm font-semibold py-1 px-4 rounded-full">
            R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
    </button>
);

const WalletScreen: React.FC<WalletScreenProps> = ({ setActiveScreen, onPurchaseClick }) => {
    const [activeTab, setActiveTab] = useState('diamante');

    const renderDiamanteTab = () => (
        <div className="grid grid-cols-2 gap-3 mt-4">
            {diamondPackages.map(pkg => (
                <PurchaseCard key={pkg.amount} amount={pkg.amount} price={pkg.price} onClick={() => onPurchaseClick(pkg)} />
            ))}
        </div>
    );

    const renderGanhosTab = () => (
        <div className="mt-6 space-y-6">
            <div>
                <label className="text-sm font-semibold text-gray-300">Valor do Saque</label>
                <div className="relative mt-2">
                    <input 
                        type="text" 
                        placeholder="Quantidade de ganhos"
                        className="w-full bg-[#282828] border border-gray-600 rounded-lg p-3 pr-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="absolute inset-y-0 right-0 bg-purple-600 text-white font-bold px-4 rounded-r-lg">
                        MÁXIMO
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Disponível para saque: 125.000 ganhos</p>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Valor Bruto (BRL):</span>
                    <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Taxa da Plataforma (20%):</span>
                    <span className="text-red-500">- R$ 0,00</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span className="text-white">Valor a Receber:</span>
                    <span className="text-green-400">R$ 0,00</span>
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-300">Método de Saque</label>
                <button 
                    onClick={() => setActiveScreen('withdrawMethod')}
                    className="w-full bg-[#282828] border border-gray-600 rounded-lg p-3 mt-2 text-left flex justify-between items-center hover:bg-[#3a3a3a] transition-colors"
                >
                    <span>Configurar Método</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </button>
                <p className="text-xs text-gray-400 mt-2">O valor será enviado para sua conta cadastrada.</p>
            </div>

             <div className="pt-4">
                <button disabled className="w-full bg-gray-500 text-gray-300 font-bold py-3 rounded-full cursor-not-allowed">
                    Confirmar Saque
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-6 text-lg font-semibold">
                    <button onClick={() => setActiveTab('diamante')} className={activeTab === 'diamante' ? 'text-white' : 'text-gray-500'}>
                        Diamante
                        {activeTab === 'diamante' && <div className="h-0.5 w-full bg-white mt-1"></div>}
                    </button>
                    <button onClick={() => setActiveTab('ganhos')} className={activeTab === 'ganhos' ? 'text-white' : 'text-gray-500'}>
                        Ganhos
                        {activeTab === 'ganhos' && <div className="h-0.5 w-full bg-white mt-1"></div>}
                    </button>
                </div>
                <button onClick={() => setActiveScreen('purchaseHistory')}>
                    <MenuIcon className="w-6 h-6" />
                </button>
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

                {activeTab === 'diamante' ? renderDiamanteTab() : renderGanhosTab()}
            </main>
        </div>
    );
};

export default WalletScreen;
