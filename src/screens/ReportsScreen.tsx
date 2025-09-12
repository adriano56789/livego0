
import React, { useState } from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import PaperclipIcon from '../components/PaperclipIcon';

interface ReportsScreenProps {
    setActiveScreen: (screen: string) => void;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ setActiveScreen }) => {
    const [activeTab, setActiveTab] = useState('report');

    return (
        <div className="bg-black h-full text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('profile')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Denúncias e Sugestões
                </h1>
            </header>

            <nav className="flex">
                <button
                    onClick={() => setActiveTab('report')}
                    className={`flex-1 p-4 font-semibold text-center border-b-2 ${activeTab === 'report' ? 'text-white border-green-500' : 'text-gray-500 border-transparent'}`}
                >
                    Fazer uma Denúncia
                </button>
                <button
                    onClick={() => setActiveTab('suggestion')}
                    className={`flex-1 p-4 font-semibold text-center border-b-2 ${activeTab === 'suggestion' ? 'text-white border-green-500' : 'text-gray-500 border-transparent'}`}
                >
                    Enviar sugestão
                </button>
            </nav>

            <main className="flex-grow p-6 space-y-6 overflow-y-auto no-scrollbar">
                {activeTab === 'report' ? (
                    <>
                        <input type="text" placeholder="ID do usuário a ser denunciado" className="w-full bg-[#1e1e1e] p-4 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <input type="text" placeholder="Motivo (ex: assédio, spam, etc.)" className="w-full bg-[#1e1e1e] p-4 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <textarea placeholder="Forneça mais detalhes (opcional)" className="w-full bg-[#1e1e1e] p-4 rounded-lg h-32 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        <div className="w-full bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center text-gray-500">
                            <span>Anexar evidências (opcional)</span>
                            <PaperclipIcon className="w-6 h-6" />
                        </div>
                    </>
                ) : (
                    <textarea placeholder="Deixe sua sugestão para melhorarmos o aplicativo..." className="w-full bg-[#1e1e1e] p-4 rounded-lg h-60 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                )}
            </main>

            <footer className="p-6">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-colors text-lg">
                    Enviar
                </button>
            </footer>
        </div>
    );
};

export default ReportsScreen;
