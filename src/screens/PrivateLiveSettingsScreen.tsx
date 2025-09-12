
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import ToggleSwitch from '../components/ToggleSwitch';

interface PrivateLiveSettingsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const SettingRow: React.FC<{ label: string; description?: string; initialChecked: boolean; }> = ({ label, description, initialChecked }) => (
    <div className="flex items-start justify-between p-4 bg-[#1e1e1e]">
        <div className="pr-4">
            <p className="font-semibold text-white">{label}</p>
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="flex-shrink-0 pt-1">
            <ToggleSwitch initialChecked={initialChecked} />
        </div>
    </div>
);

const PrivateLiveSettingsScreen: React.FC<PrivateLiveSettingsScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Convite privado ao vivo
                </h1>
            </header>
            <main className="py-4">
                <div className="space-y-px">
                    <SettingRow
                        label="Convite privado ao vivo"
                        description="Você recebe um convite privado ao vivo quando o liga"
                        initialChecked={true}
                    />
                    <SettingRow
                        label="Após a abertura, só aceito usuários que sigo."
                        initialChecked={true}
                    />
                    <SettingRow
                        label="Após a abertura, apenas meus fãs são aceitos."
                        initialChecked={false}
                    />
                    <SettingRow
                        label="Após a abertura, só aceito meus amigos."
                        initialChecked={false}
                    />
                </div>
            </main>
        </div>
    );
};

export default PrivateLiveSettingsScreen;
