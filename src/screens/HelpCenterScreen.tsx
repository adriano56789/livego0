
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import ChevronRightIcon from '../components/ChevronRightIcon';
import SearchIcon from '../components/SearchIcon';
import LifeBuoyIcon from '../components/LifeBuoyIcon';
import MessageIcon from '../components/MessageIcon';

interface HelpCenterScreenProps {
    setActiveScreen: (screen: string) => void;
    onSelectTopic: (topic: string) => void;
}

const HelpItem: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg hover:bg-[#2a2a2a] transition-colors">
        <span className="text-white font-medium">{label}</span>
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
    </button>
);


const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ setActiveScreen, onSelectTopic }) => {
    const helpTopics = [
        "Como fazer recargas?",
        "Problemas com saque",
        "Como iniciar uma transmissão?",
        "Segurança da conta e privacidade",
        "Regras da comunidade",
        "Solução de problemas de conexão",
    ];

    return (
        <div className="bg-black h-full text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800 flex-shrink-0">
                <button onClick={() => setActiveScreen('profile')} className="absolute" aria-label="Voltar para o perfil">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Central de Ajuda
                </h1>
            </header>

            <main className="flex-grow p-4 space-y-6 overflow-y-auto no-scrollbar">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Como podemos ajudar?"
                        className="w-full bg-[#1e1e1e] rounded-full py-3 pl-11 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                
                <div className="bg-[#1e1e1e] p-6 rounded-2xl text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                        <LifeBuoyIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold">Precisa de Ajuda?</h2>
                    <p className="text-gray-400 mt-2">Encontre respostas para as perguntas mais frequentes abaixo.</p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-300 mb-3 px-2">Tópicos Populares</h3>
                    <div className="space-y-2">
                        {helpTopics.map(topic => <HelpItem key={topic} label={topic} onClick={() => onSelectTopic(topic)} />)}
                    </div>
                </div>
            </main>

            <footer className="p-4 border-t border-gray-800 flex-shrink-0">
                <button onClick={() => setActiveScreen('supportChat')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-full flex items-center justify-center space-x-2 text-lg">
                    <MessageIcon className="w-6 h-6" />
                    <span>Chat com Suporte</span>
                </button>
            </footer>
        </div>
    );
};

export default HelpCenterScreen;
