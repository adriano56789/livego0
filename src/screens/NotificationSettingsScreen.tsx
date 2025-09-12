
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import ChevronRightIcon from '../components/ChevronRightIcon';
import ToggleSwitch from '../components/ToggleSwitch';

interface NotificationSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const SettingsRow: React.FC<{ label: string; hasToggle?: boolean; onClick?: () => void }> = ({ label, hasToggle, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-4 bg-[#1e1e1e] ${onClick ? 'cursor-pointer hover:bg-[#2a2a2a]' : ''}`}
    >
        <span className="text-white">{label}</span>
        {hasToggle && <ToggleSwitch initialChecked={true} />}
        {!hasToggle && onClick && <ChevronRightIcon className="w-5 h-5 text-gray-500" />}
    </div>
);

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configurações de notificação
                </h1>
            </header>
            <main className="py-6 space-y-6">
                <div>
                    <h2 className="px-4 pb-2 text-gray-400 font-semibold">Receber notificações</h2>
                    <div className="space-y-px">
                        <SettingsRow label="Novas mensagens" hasToggle />
                        <SettingsRow label="Início ao vivo do streamer seguido" hasToggle />
                        <SettingsRow label="Iniciar configurações de push" onClick={() => setActiveScreen('pushSettings')} />
                        <SettingsRow label="Pessoa em seguida postou um vídeo LiveGo" hasToggle />
                    </div>
                </div>
                <div>
                    <h2 className="px-4 pb-2 text-gray-400 font-semibold">Notificações interativas</h2>
                     <div className="space-y-px">
                        <SettingsRow label="Pedido" hasToggle />
                        <SettingsRow label="Notificações interativas" hasToggle />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotificationSettingsScreen;
