import React, { useState } from 'react';
import CloseIcon from '../icons/CloseIcon';
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';

interface HourlyRankingModalProps {
    onClose: () => void;
}

const HourlyRankingModal: React.FC<HourlyRankingModalProps> = ({ onClose }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [activeTab, setActiveTab] = useState('brasil');
    
    if (isFullScreen) {
        return (
             <div className="absolute inset-0 bg-gradient-to-b from-[#3a255a] to-[#1e1433] flex flex-col z-20">
                <header className="p-4 flex items-center justify-between">
                    <button onClick={() => setIsFullScreen(false)}><ChevronLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-lg font-semibold">Lista Horária</h1>
                    <button><QuestionMarkCircleIcon className="w-6 h-6" /></button>
                </header>
                <nav className="px-4 pb-4">
                    <div className="flex space-x-2">
                        <button onClick={() => setActiveTab('brasil')} className={`px-4 py-2 rounded-full font-semibold ${activeTab === 'brasil' ? 'bg-white text-black' : 'bg-white/10'}`}>
                            Lista de horários do Brasil
                        </button>
                        <button onClick={() => setActiveTab('global')} className={`px-4 py-2 rounded-full font-semibold ${activeTab === 'global' ? 'bg-white text-black' : 'bg-white/10'}`}>
                            Lista de tarefas global
                        </button>
                    </div>
                </nav>
                <main className="flex-grow flex items-center justify-center">
                    <p className="text-gray-400">Nenhum ranking encontrado.</p>
                </main>
            </div>
        );
    }
    
    return (
        <div className="absolute inset-x-0 bottom-0 bg-[#21212b] rounded-t-2xl flex flex-col p-4 z-10">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <img src="https://picsum.photos/seed/profile/32/32" alt="User avatar" className="w-8 h-8 rounded-full" />
                    <span className="font-semibold">Lista Horária</span>
                </div>
                 <div className="flex items-center space-x-3">
                    <button><QuestionMarkCircleIcon className="w-6 h-6" /></button>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                </div>
            </div>
            <div className="flex space-x-2 mb-4">
                <button onClick={() => setActiveTab('brasil')} className={`px-4 py-2 rounded-full font-semibold ${activeTab === 'brasil' ? 'bg-white text-black' : 'bg-white/10'}`}>Brasil</button>
                <button onClick={() => setActiveTab('global')} className={`px-4 py-2 rounded-full font-semibold ${activeTab === 'global' ? 'bg-white text-black' : 'bg-white/10'}`}>Global</button>
            </div>
             <div className="flex-grow flex items-center justify-center min-h-[100px]">
                <p className="text-gray-400">Não foi possível acessar o ranking.</p>
            </div>
            <div className="mt-2 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex justify-between items-center">
                <p className="text-sm">Envie presentes para subir no ranking!</p>
                <button onClick={() => setIsFullScreen(true)} className="flex items-center text-purple-300 font-semibold">
                    <span>Lista Completa</span>
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
export default HourlyRankingModal;