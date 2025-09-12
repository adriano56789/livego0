
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import DiamondIcon from '../components/DiamondIcon';
import ToggleSwitch from '../components/ToggleSwitch';
import LevelGemIcon from '../components/LevelGemIcon';

interface GiftNotificationSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const gifts = [
  { name: 'Coração', price: 1, icon: '❤️' },
  { name: 'Rosa', price: 10, icon: '🌹' },
  { name: 'Batom', price: 25, icon: '💄' },
  { name: 'Sorvete', price: 50, icon: '🍦' },
  { name: 'Perfume', price: 75, icon: '🧴' },
  { name: 'Alvo', price: 100, icon: '🎯' },
  { name: 'Urso', price: 150, icon: '🧸' },
  { name: 'Boia', price: 200, icon: '🍩' },
  { name: 'Gema de Nível', price: 250, icon: <LevelGemIcon className="w-8 h-8" /> },
  { name: 'Coroa', price: 500, icon: '👑' },
  { name: 'Foguete', price: 1000, icon: '🚀' },
  { name: 'Anel', price: 2000, icon: '💍' },
  { name: 'Carro', price: 5000, icon: '🚗' },
  { name: 'Carrão', price: 10000, icon: '🏎️' },
  { name: 'Castelo', price: 20000, icon: '🏰' },
  { name: 'Helicóptero', price: 30000, icon: '🚁' },
  { name: 'Iate', price: 50000, icon: '⭐' },
  { name: 'Diamante', price: 100000, icon: '💎' },
  { name: 'Túmulo', price: 1, icon: '🪦' },
];

const GiftItem: React.FC<{ name: string; price: number; icon: React.ReactNode; }> = ({ name, price, icon }) => (
    <div className="flex items-center justify-between p-4 bg-[#1e1e1e]">
        <div className="flex items-center space-x-4">
            <span className="text-3xl w-8 h-8 flex items-center justify-center">{icon}</span>
            <div>
                <p className="text-white font-semibold">{name}</p>
                <div className="flex items-center space-x-1 text-yellow-400">
                    <DiamondIcon className="w-4 h-4" />
                    <span className="text-sm">{price.toLocaleString('pt-BR')}</span>
                </div>
            </div>
        </div>
        <ToggleSwitch initialChecked={true} />
    </div>
);

const GiftNotificationSettingsScreen: React.FC<GiftNotificationSettingsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black h-full text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800 flex-shrink-0">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configuração de Notificação de Presentes
                </h1>
            </header>
            <main className="flex-grow overflow-y-auto p-4 no-scrollbar">
                <p className="text-gray-400 mb-4 px-2">Controle quais notificações de presente aparecem na tela durante uma transmissão.</p>
                <div className="space-y-px">
                    {gifts.map(gift => <GiftItem key={gift.name} {...gift} />)}
                </div>
            </main>
        </div>
    );
};

export default GiftNotificationSettingsScreen;
