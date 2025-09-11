
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import DiamondIcon from '../components/icons/DiamondIcon';
import ToggleSwitch from '../components/ToggleSwitch';

interface GiftNotificationSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const gifts = [
    { name: 'Coração', value: 1, image: '❤️' },
    { name: 'Rosa', value: 10, image: '🌹' },
    { name: 'Sorvete', value: 50, image: '🍦' },
    { name: 'Foguete', value: 1000, image: '🚀' },
    { name: 'Carro', value: 5000, image: '🚗' },
    { name: 'Castelo', value: 20000, image: '🏰' },
    { name: 'Anel', value: 2000, image: '💍' },
    { name: 'Iate', value: 50000, image: '🛥️' },
    { name: 'Pirulito', value: 5, image: '🍭' },
];

const GiftItem: React.FC<{ name: string; value: number; image: string; }> = ({ name, value, image }) => (
    <div className="flex items-center justify-between p-4 bg-[#1e1e1e]">
        <div className="flex items-center space-x-4">
            <span className="text-3xl w-8 text-center">{image}</span>
            <div>
                <p className="text-white font-semibold">{name}</p>
                <div className="flex items-center space-x-1 text-yellow-400">
                    <DiamondIcon className="w-4 h-4" />
                    <span className="text-sm">{value.toLocaleString('pt-BR')}</span>
                </div>
            </div>
        </div>
        <ToggleSwitch initialChecked={true} />
    </div>
);

const GiftNotificationSettingsScreen: React.FC<GiftNotificationSettingsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configuração de Notificação de Presentes
                </h1>
            </header>
            <main className="p-4">
                <p className="text-gray-400 mb-4 px-2">Controle quais notificações de presente aparecem na tela durante uma transmissão.</p>
                <div className="space-y-px">
                    {gifts.map(gift => <GiftItem key={gift.name} {...gift} />)}
                </div>
            </main>
        </div>
    );
};

export default GiftNotificationSettingsScreen;
