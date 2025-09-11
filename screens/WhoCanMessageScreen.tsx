
import React, { useState } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import CheckIcon from '../components/icons/CheckIcon';

interface WhoCanMessageScreenProps {
    setActiveScreen: (screen: string) => void;
}

const WhoCanMessageScreen: React.FC<WhoCanMessageScreenProps> = ({ setActiveScreen }) => {
    const [selectedOption, setSelectedOption] = useState('todos');

    const OptionItem: React.FC<{ value: string; label: string; description?: string; }> = ({ value, label, description }) => (
        <button
            onClick={() => setSelectedOption(value)}
            className="w-full text-left p-4 bg-[#1e1e1e] flex justify-between items-start"
            aria-pressed={selectedOption === value}
        >
            <div>
                <p className="text-white text-base">{label}</p>
                {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
            </div>
            {selectedOption === value && <CheckIcon className="w-5 h-5 text-purple-500" />}
        </button>
    );

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center">
                    <button onClick={() => setActiveScreen('privacySettings')} aria-label="Back to privacy settings">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold ml-4">
                        Quem pode me enviar mensagem
                    </h1>
                </div>
                <button className="font-semibold text-purple-400" onClick={() => setActiveScreen('privacySettings')}>Salvar</button>
            </header>
            <main className="py-4">
                <div className="space-y-px">
                    <OptionItem value="todos" label="Todos" />
                    <OptionItem 
                        value="seguidores" 
                        label="Apenas seguidores" 
                        description="Não receba mais mensagens de estranhos, mas ainda pode receber presentes" 
                    />
                </div>
            </main>
        </div>
    );
};

export default WhoCanMessageScreen;