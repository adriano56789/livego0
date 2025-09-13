import React from 'react';
import HomeIcon from './icons/HomeIcon';
import VideoIcon from './icons/VideoIcon';
import PlayIcon from './icons/PlayIcon';
import MessageIcon from './icons/MessageIcon';

interface BottomNavProps {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
    onGoLiveClick: () => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; notification?: boolean; onClick?: () => void; }> = ({ icon, label, active, notification, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 w-1/5 ${active ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}>
        <div className="relative">
            {icon}
            {notification && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
        <span className="text-xs">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, onGoLiveClick }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-gray-700 p-2 z-20 flex-shrink-0">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Ao vivo" active={activeScreen === 'home'} onClick={() => setActiveScreen('home')} />
                <NavItem icon={<VideoIcon className="w-6 h-6" />} label="Vídeo" onClick={() => setActiveScreen('home')} />
                <button onClick={onGoLiveClick} className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full shadow-lg -translate-y-4">
                    <PlayIcon />
                </button>
                <NavItem icon={<MessageIcon />} label="Mensagem" notification active={activeScreen === 'messages'} onClick={() => setActiveScreen('messages')} />
                 <NavItem 
                    icon={<img src="https://picsum.photos/seed/avatar/24/24" alt="User avatar" className={`w-6 h-6 rounded-full ${activeScreen === 'profile' ? 'border-2 border-white' : 'border-2 border-gray-600'}`}/>} 
                    label="UE" 
                    active={activeScreen === 'profile'} 
                    onClick={() => setActiveScreen('profile')} 
                />
            </div>
        </footer>
    );
};

export default BottomNav;