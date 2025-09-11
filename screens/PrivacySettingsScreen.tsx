
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import ToggleSwitch from '../components/ToggleSwitch';

interface PrivacySettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const PrivacyRow: React.FC<{ label: string; description?: string; hasToggle?: boolean; value?: string; initialChecked?: boolean; onClick?: () => void; }> = ({ label, description, hasToggle, value, initialChecked=false, onClick }) => (
    <div onClick={onClick} className={`flex items-start justify-between p-4 bg-[#1e1e1e] ${onClick ? 'cursor-pointer hover:bg-[#2a2a2a]' : ''}`}>
        <div className="pr-4">
            <p className="font-semibold text-white">{label}</p>
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="flex-shrink-0 pt-1">
        {hasToggle && <ToggleSwitch initialChecked={initialChecked} />}
        {value && (
            <div className="flex items-center space-x-2 text-gray-400">
                <span>{value}</span>
                <ChevronRightIcon className="w-5 h-5" />
            </div>
        )}
        </div>
    </div>
);

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configuração de privacidade
                </h1>
            </header>
            <main className="py-4">
                <div className="space-y-px">
                    <PrivacyRow label="Quem pode me enviar uma mensagem?" value="Todos" onClick={() => setActiveScreen('whoCanMessage')} />
                    <PrivacyRow label="Mostrar local" description="Desligará irá ocultar sua localização de outros" hasToggle initialChecked={true} />
                    <PrivacyRow label="Mostrar estado ativo" description="Desligar a atividade de ocultação de outros" hasToggle initialChecked={true} />
                    <PrivacyRow label="Mostrar em [Pessoas próximas]" description="Desligar irá tornar impossível para as pessoas próximas procurarem por você" hasToggle initialChecked={true} />
                    <PrivacyRow label="Proteção de Perfil" description="Outros usuários verão um selo de 'Proteção ativada' em seu perfil." hasToggle initialChecked={false} />
                </div>
            </main>
        </div>
    );
};

export default PrivacySettingsScreen;