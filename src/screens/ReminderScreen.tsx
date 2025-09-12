
import React, { useState } from 'react';
import ChevronRightIcon from '../components/ChevronRightIcon';
import ClockIcon from '../components/ClockIcon';
import PlusIcon from '../components/PlusIcon';

interface ReminderScreenProps {
    onClose: () => void;
}

const mockReminderUsers = [
  { id: 1, name: 'MIRELLA', emojis: '🎀', avatarUrl: 'https://picsum.photos/seed/mirella/128/128', location: 'Em algum lugar', timeAgo: '44min', statusText: '#Beauty te chamou', statusEmoji: '❤️' },
  { id: 2, name: 'SARAH', emojis: '🌹🧸', avatarUrl: 'https://picsum.photos/seed/sarah/128/128', imageTag: 'Dance' as const, location: 'Em algum lugar', timeAgo: '56min', statusText: '#Beauty Hi love' },
  { id: 3, name: 'princess', emojis: '👑', avatarUrl: 'https://picsum.photos/seed/princess/128/128', location: 'Em algum lugar', timeAgo: '2h2m', statusText: 'Dance', statusEmoji: '💃' },
  { id: 4, name: 'JuFe', emojis: '', avatarUrl: 'https://picsum.photos/seed/jufe/128/128', isGrayscale: true, location: 'Em algum lugar', timeAgo: '1min', statusText: '#Beauty CH@M@D@S 10' },
  { id: 5, name: 'Isa', emojis: '🌊', avatarUrl: 'https://picsum.photos/seed/isa/128/128', imageTag: 'HOT' as const, location: 'Em algum lugar', timeAgo: '1h24m', statusText: 'Oi baby', showAddButton: true },
  { id: 6, name: 'laura', emojis: '🌹', avatarUrl: 'https://picsum.photos/seed/laura/128/128', location: 'São Paulo', timeAgo: '1h30m', statusText: '#Beauty 10k', statusEmoji: '💕✨' },
];

const StatusIcon = () => (
    <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
        <div style={{
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '5px solid #d1d5db',
            marginLeft: '2px',
        }} />
    </div>
);


const ReminderScreen: React.FC<ReminderScreenProps> = ({ onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Corresponds to animation duration
    };

    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in-overlay ${isClosing ? 'animate-fade-out-overlay' : ''}`}
            onClick={handleClose}
        >
            <div 
                className={`fixed top-0 right-0 h-full w-[90%] max-w-sm bg-[#121212] text-white shadow-2xl flex flex-col animate-slide-in-right ${isClosing ? 'animate-slide-out-right' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 flex items-center justify-between sticky top-0 bg-[#121212] z-10 flex-shrink-0">
                    <div className="flex items-center space-x-4">
                         <button onClick={handleClose} aria-label="Fechar Lembretes">
                            <ChevronRightIcon className="w-7 h-7 text-white" />
                        </button>
                        <h1 className="text-2xl font-bold">Lembrete</h1>
                    </div>
                    <button aria-label="Ver histórico">
                        <ClockIcon className="w-7 h-7 text-gray-400" />
                    </button>
                </header>

                <nav className="px-4 pb-2 border-b border-gray-800 flex-shrink-0">
                    <button className="font-semibold text-gray-400">Por perto</button>
                </nav>

                <main className="flex-grow overflow-y-auto no-scrollbar">
                    <ul>
                        {mockReminderUsers.map(user => (
                            <li key={user.id} className="flex items-center p-4 space-x-4 border-b border-gray-800">
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={user.avatarUrl} 
                                        alt={user.name} 
                                        className={`w-16 h-16 rounded-lg object-cover ${user.isGrayscale ? 'filter grayscale' : ''}`} 
                                    />
                                    {user.imageTag === 'HOT' && (
                                        <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-sm">HOT</span>
                                    )}
                                    {user.imageTag === 'Dance' && (
                                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded">Dance</span>
                                    )}
                                </div>

                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-base truncate">{user.name} {user.emojis}</p>
                                    <p className="text-sm text-gray-400">{user.location}</p>
                                    <p className="text-sm text-gray-400">{user.timeAgo}</p>
                                    <div className="text-sm text-gray-400 mt-1 flex items-center">
                                        <StatusIcon />
                                        <span className="truncate">{user.statusText} {user.statusEmoji}</span>
                                    </div>
                                </div>
                                
                                {user.showAddButton && (
                                    <button className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white flex-shrink-0" aria-label={`Adicionar ${user.name}`}>
                                        <PlusIcon className="w-6 h-6"/>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    );
};

export default ReminderScreen;
