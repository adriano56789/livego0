
import React from 'react';
import MaleIcon from '../components/MaleIcon';
import LevelBadgeIcon from '../components/LevelBadgeIcon';
import CopyIcon from '../components/CopyIcon';
import CoinIcon from '../components/CoinIcon';
import DiamondIcon from '../components/DiamondIcon';
import ChevronRightIcon from '../components/ChevronRightIcon';
import BlockIcon from '../components/BlockIcon';
import SettingsIcon from '../components/SettingsIcon';
import CubeIcon from '../components/CubeIcon';
import TrophyIcon from '../components/TrophyIcon';
import UserGroupIcon from '../components/UserGroupIcon';
import LockClosedIcon from '../components/LockClosedIcon';
import EnvelopeIcon from '../components/EnvelopeIcon';
import QuestionMarkCircleIcon from '../components/QuestionMarkCircleIcon';

interface ProfileScreenProps {
    setActiveScreen: (screen: string) => void;
}

const StatItemButton: React.FC<{ value: string; label: string; onClick: () => void }> = ({ value, label, onClick }) => (
    <button onClick={onClick} className="text-center">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </button>
);

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; }> = ({ icon, label, onClick }) => (
    <li onClick={onClick} className={`flex items-center justify-between p-4 bg-[#1f1f1f] ${onClick ? 'hover:bg-[#2a2a2a] transition-colors cursor-pointer' : ''}`}>
        <div className="flex items-center space-x-4">
            {icon}
            <span className="text-white">{label}</span>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
    </li>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ setActiveScreen }) => {
    const menuItems = [
        { icon: <CubeIcon className="w-6 h-6 text-blue-400" />, label: "Mercado", screen: 'shop' },
        { icon: <TrophyIcon className="w-6 h-6 text-yellow-400" />, label: "Minha Patente", screen: 'level' },
        { icon: <UserGroupIcon className="w-6 h-6 text-yellow-600" />, label: "Fãs de Destaque", screen: 'topFans' },
        { icon: <LockClosedIcon className="w-6 h-6 text-blue-500" />, label: "Proteção de Perfil", screen: 'avatarProtection' },
        { icon: <EnvelopeIcon className="w-6 h-6 text-gray-300" />, label: "Feedback e Denúncias", screen: 'reports' },
        { icon: <QuestionMarkCircleIcon className="w-6 h-6 text-gray-300" />, label: "Suporte", screen: 'helpCenter' },
        { icon: <BlockIcon className="w-6 h-6 text-gray-300" />, label: "Usuários Bloqueados", screen: 'blockList' },
        { icon: <SettingsIcon className="w-6 h-6 text-gray-300" />, label: "Configurações", screen: 'settings' },
    ];

  return (
    <div className="bg-[#181818] h-full text-white overflow-y-auto no-scrollbar pb-24">
        <div className="pt-6 px-6 flex flex-col items-center text-center">
            <button onClick={() => setActiveScreen('broadcasterProfile')} className="relative mb-4">
                <img 
                    src="https://picsum.photos/seed/profile/100/100" 
                    alt="User avatar" 
                    className="w-24 h-24 rounded-full border-4 border-purple-500"
                />
                <img 
                    src="https://flagcdn.com/br.svg" 
                    width="28" 
                    alt="Brazil" 
                    className="absolute bottom-1 right-1 rounded-full border-2 border-black"
                />
            </button>
            <h2 className="text-2xl font-bold">Seu Perfil</h2>
            <div className="flex items-center space-x-2 my-2">
                <div className="flex items-center bg-blue-500 rounded-full px-2 py-0.5 text-xs font-semibold space-x-1">
                    <MaleIcon className="w-3 h-3"/>
                    <span>23</span>
                </div>
                <div className="flex items-center bg-cyan-500 rounded-full px-2 py-0.5 text-xs font-semibold space-x-1">
                    <LevelBadgeIcon className="w-3 h-3" />
                    <span>6</span>
                </div>
            </div>
            <div className="flex items-center text-gray-400 text-xs space-x-2">
                <span>Identificação: 10755083</span>
                <button className="hover:text-white transition-colors">
                    <CopyIcon className="w-4 h-4" />
                </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Brasil, São Paulo</p>
        </div>

        <div className="py-4 flex justify-around">
            <StatItemButton value="0" label="Seguido" onClick={() => setActiveScreen('following')} />
            <StatItemButton value="3" label="Fãs" onClick={() => setActiveScreen('fans')} />
            <StatItemButton value="0" label="Visitantes" onClick={() => setActiveScreen('visitors')} />
        </div>

        <div className="mt-2">
            <ul>
                 <li onClick={() => setActiveScreen('wallet')} className="flex items-center justify-between p-4 bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                        <CoinIcon className="w-6 h-6" />
                        <span className="font-semibold">Carteira</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm">
                            <DiamondIcon className="w-5 h-5" />
                            <span className="text-white font-semibold">50.000</span>
                        </div>
                         <div className="flex items-center space-x-1 text-sm">
                            <CoinIcon className="w-5 h-5" />
                            <span className="font-semibold text-white">125.000</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    </div>
                </li>
                {menuItems.map((item) => <MenuItem key={item.label} icon={item.icon} label={item.label} onClick={() => item.screen && setActiveScreen(item.screen)} />)}
            </ul>
        </div>
    </div>
  );
};

export default ProfileScreen;
