
import React from 'react';

interface StreamEndedSummaryScreenProps {
    duration: string;
    onBackToHome: () => void;
}

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
    </div>
);

const StreamEndedSummaryScreen: React.FC<StreamEndedSummaryScreenProps> = ({ duration, onBackToHome }) => {
    return (
        <div className="bg-gradient-to-b from-[#3a255a] to-[#1e1433] min-h-screen text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-8">A transmissão terminou.</h1>
            <div className="relative mb-4">
                <img src="https://picsum.photos/seed/profile/100/100" alt="User avatar" className="w-24 h-24 rounded-full border-4 border-purple-500" />
                <img src="https://flagcdn.com/br.svg" width="28" alt="Brazil" className="absolute bottom-1 right-1 rounded-full border-2 border-black" />
            </div>
            <h2 className="text-2xl font-semibold mb-12">Rainha PK</h2>
            
            <div className="grid grid-cols-3 gap-y-8 gap-x-4 w-full max-w-sm mb-16">
                <StatItem value="+10" label="Número de espectadores" />
                <div className="text-center col-span-2">
                    <p className="text-2xl font-bold truncate">{duration}</p>
                    <p className="text-sm text-gray-300">Duração ao vivo</p>
                </div>
                <StatItem value="999999" label="Moedas" />
                <StatItem value="+5" label="Seguidores" />
                <StatItem value="+2" label="Membro" />
                <StatItem value="+1" label="Fãs" />
            </div>

            <button onClick={onBackToHome} className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-full transition-colors text-lg">
                Voltar para a página inicial
            </button>
        </div>
    );
};

export default StreamEndedSummaryScreen;