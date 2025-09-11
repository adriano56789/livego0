import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import UserGroupIcon from '../components/icons/UserGroupIcon';
import BellIcon from '../components/icons/BellIcon';
import GiftIcon from '../components/icons/GiftIcon';
import EnvelopeIcon from '../components/icons/EnvelopeIcon';
import LockClosedIcon from '../components/icons/LockClosedIcon';
import CurrencyDollarIcon from '../components/icons/CurrencyDollarIcon';
import DocumentTextIcon from '../components/icons/DocumentTextIcon';
import CodeBracketIcon from '../components/icons/CodeBracketIcon';
import TrashIcon from '../components/icons/TrashIcon';

interface SettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const SettingsItem: React.FC<{ icon: React.ReactNode; label: string; isDestructive?: boolean; onClick?: () => void; }> = ({ icon, label, isDestructive, onClick }) => (
    <li onClick={onClick} className={`flex items-center justify-between p-4 bg-black ${onClick ? 'cursor-pointer hover:bg-[#1e1e1e]' : ''}`}>
        <div className="flex items-center space-x-4">
            {icon}
            <span className={isDestructive ? 'text-red-500' : 'text-white'}>{label}</span>
        </div>
        {onClick && !isDestructive && <ChevronRightIcon className="w-5 h-5 text-gray-500" />}
    </li>
);


const SettingsScreen: React.FC<SettingsScreenProps> = ({ setActiveScreen }) => {
    const settingsItems = [
        { icon: <UserGroupIcon className="w-6 h-6 text-gray-300" />, label: "Contas Conectadas", screen: 'connectedAccounts' },
        { icon: <BellIcon className="w-6 h-6 text-gray-300" />, label: "Configurações de notificação", screen: 'notificationSettings' },
        { icon: <GiftIcon className="w-6 h-6 text-gray-300" />, label: "Notificações de Presente", screen: 'giftNotificationSettings' },
        { icon: <EnvelopeIcon className="w-6 h-6 text-gray-300" />, label: "Convite privado ao vivo", screen: 'privateLiveSettings' },
        { icon: <LockClosedIcon className="w-6 h-6 text-gray-300" />, label: "Configurações de privacidade", screen: 'privacySettings' },
        { icon: <CurrencyDollarIcon className="w-6 h-6 text-gray-300" />, label: "Informações de Ganhos", screen: 'earningsInfo' },
        { icon: <DocumentTextIcon className="w-6 h-6 text-gray-300" />, label: "Direitos Autorais" },
        { icon: <DocumentTextIcon className="w-6 h-6 text-gray-300" />, label: "Versão do aplicativo", screen: 'appVersion' },
        { icon: <TrashIcon className="w-6 h-6 text-red-500" />, label: "Excluir Conta", isDestructive: true },
    ];
    
    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configurações
                </h1>
            </header>
            <main className="flex-grow py-4 overflow-y-auto no-scrollbar">
                <ul>
                    {settingsItems.map(item => <SettingsItem key={item.label} icon={item.icon} label={item.label} isDestructive={item.isDestructive} onClick={item.screen ? () => setActiveScreen(item.screen) : undefined} />)}
                </ul>
            </main>
             <footer className="p-6">
                <button className="w-full bg-[#be123c] hover:bg-[#9f1239] text-white font-bold py-3 rounded-full transition-colors text-lg">
                    Sair
                </button>
            </footer>
        </div>
    );
};

export default SettingsScreen;