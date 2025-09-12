import React, { useState, useEffect, useRef } from 'react';
import UserGroupIcon from '../components/icons/UserGroupIcon';
import CoinFilledIcon from '../components/icons/CoinFilledIcon';
import SendIcon from '../components/icons/SendIcon';
import MaleIcon from '../components/icons/MaleIcon';
import FemaleIcon from '../components/icons/FemaleIcon';
import LevelBadgeIcon from '../components/icons/LevelBadgeIcon';
import PlusIcon from '../components/icons/PlusIcon';
import GiftIcon from '../components/icons/GiftIcon';
import LiveHeader from '../components/live/LiveHeader';
import OnlineUsersModal from '../components/live/OnlineUsersModal';
import EndStreamConfirmationModal from '../components/live/EndStreamConfirmationModal';
import ChatMessage from '../components/live/ChatMessage';
import StarIcon from '../components/icons/StarIcon';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';
import CoHostIcon from '../components/icons/CoHostIcon';
import LevelIcon from '../components/icons/LevelIcon';
import CoHostInvitationScreen from '../components/live/CoHostInvitationScreen';
import MessageIcon from '../components/icons/MessageIcon';
import EntryChatMessage from '../components/live/EntryChatMessage';
import BroadcasterProfileModal from '../components/live/BroadcasterProfileModal';
import { ProfileUser } from './BroadcasterProfileScreen';
import ChatScreen from './ChatScreen';
import MoreIcon from '../components/icons/MoreIcon';
import ToolsModal from '../components/live/ToolsModal';
import ResolutionPanel from '../components/live/ResolutionPanel';
import BeautyEffectsPanel from '../components/live/BeautyEffectsPanel';

interface PKBattleScreenProps {
    onClose: () => void;
    onProfileModalOpen: () => void;
    onGiftModalOpen: () => void;
    onRankingModalOpen: () => void;
    onPrivateChatOpen: () => void;
}

const mockMessages = [
    { id: 1, type: 'chat', user: 'Espectador1', age: 25, gender: 'male', level: 5, message: 'Vamos lá, time!', avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 2, type: 'chat', user: 'Apoiador Forte', age: 32, gender: 'female', level: 12, message: 'Você consegue!', avatar: 'https://i.pravatar.cc/150?img=16' },
    { id: 101, type: 'entry', user: 'GamerPro', avatar: 'https://i.pravatar.cc/150?img=21' },
    { id: 100, type: 'special_entry', message: '💎 Super Fã entrou na sala' },
    { id: 3, type: 'chat', user: 'Novo_Fan', age: 18, gender: 'male', level: 1, message: 'Primeira vez aqui!', avatar: 'https://i.pravatar.cc/150?img=17' },
    { id: 4, type: 'chat', user: 'Super Fã', age: 28, gender: 'female', level: 25, message: 'Mandando um presente!', avatar: 'https://i.pravatar.cc/150?img=18' },
    { id: 102, type: 'entry', user: 'Curioso', avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 5, type: 'chat', user: 'Anônimo', age: 21, gender: 'male', level: 2, message: 'Que batalha emocionante!', avatar: 'https://i.pravatar.cc/150?img=19' },
    { id: 6, type: 'chat', user: 'Espectador1', age: 25, gender: 'male', level: 5, message: 'Virou!', avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: 7, type: 'chat', user: 'Apoiador Forte', age: 32, gender: 'female', level: 12, message: 'É isso aí!', avatar: 'https://i.pravatar.cc/150?img=16' },
];

const topGifters = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?img=16' },
    { id: 2, avatar: 'https://i.pravatar.cc/150?img=18' },
];

const opponentTopGifters = [
    { id: 3, avatar: 'https://i.pravatar.cc/150?img=17' },
    { id: 4, avatar: 'https://i.pravatar.cc/150?img=20' },
];

const opponentUser: ProfileUser = {
    name: 'Lest Go 500...',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop',
    country: 'br',
    id: '55218901',
    age: 22,
    gender: 'female',
    level: 21,
    location: 'Brasil, Rio de Janeiro',
    distance: '12,34 km',
    fans: '1.2M',
    following: '150',
    receptores: '5.6M',
    enviados: '1.2K',
    topFansAvatars: ['https://i.pravatar.cc/150?img=17', 'https://i.pravatar.cc/150?img=20'],
    isLive: true,
};

const PKBattleScreen: React.FC<PKBattleScreenProps> = ({ 
    onClose,
    onProfileModalOpen,
    onGiftModalOpen,
    onRankingModalOpen,
    onPrivateChatOpen,
 }) => {
    const [timeLeft, setTimeLeft] = useState(237); // 3 minutes 57 seconds
    const [isOnlineUsersOpen, setOnlineUsersOpen] = useState(false);
    const [isEndConfirmationOpen, setEndConfirmationOpen] = useState(false);
    const [isCoHostModalOpen, setCoHostModalOpen] = useState(false);
    const [profileToView, setProfileToView] = useState<ProfileUser | null>(null);
    const [chatWithUser, setChatWithUser] = useState<ProfileUser | null>(null);
    const [entryEffect, setEntryEffect] = useState<{ id: number; message: string } | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isBeautyPanelOpen, setBeautyPanelOpen] = useState(false);
    const [isResolutionPanelOpen, setResolutionPanelOpen] = useState(false);
    const [currentResolution, setCurrentResolution] = useState('480p');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const myScore = 2018;
    const opponentScore = 188;
    const totalScore = myScore + opponentScore;
    const myProgress = totalScore > 0 ? (myScore / totalScore) * 100 : 50;

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);
    
    // Simulate live chat and entries
    useEffect(() => {
        let messageIndex = 0;
        const interval = setInterval(() => {
            if (messageIndex < mockMessages.length) {
                const newMessage = mockMessages[messageIndex];
                if (newMessage.type === 'special_entry') {
                    // Fix: Type error due to complex inferred type. Explicitly creating an object with the expected shape.
                    setEntryEffect({ id: newMessage.id, message: newMessage.message });
                } else {
                    setMessages(prev => [...prev, newMessage]);
                }
                messageIndex++;
            } else {
                clearInterval(interval);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleInvite = () => {
        setCoHostModalOpen(false);
    };

    const handleOpenCoHostModal = () => {
        setIsToolsOpen(false);
        setCoHostModalOpen(true);
    };

    const handleOpenBeautyPanel = () => {
        setIsToolsOpen(false);
        setBeautyPanelOpen(true);
    };

    const handleOpenClarityPanel = () => {
        setIsToolsOpen(false);
        setResolutionPanelOpen(true);
    };

    const handleSelectResolution = (resolution: string) => {
        setCurrentResolution(resolution);
        setResolutionPanelOpen(false);
    };

    const handleStartChat = (userToChat: ProfileUser) => {
        setProfileToView(null);
        setChatWithUser(userToChat);
    };

    const handleViewChatUserProfile = (user: any) => {
        const userProfile: ProfileUser = {
            name: user.user,
            avatarUrl: user.avatar,
            coverUrl: `https://picsum.photos/seed/${user.id}/400/600`,
            country: 'br',
            id: `user-${user.id}`,
            age: user.age,
            gender: user.gender,
            level: user.level,
            location: 'Brasil',
            distance: 'desconhecida',
            fans: `${(Math.random() * 10).toFixed(1)}K`,
            following: `${Math.floor(Math.random() * 500)}`,
            receptores: `${(Math.random() * 100).toFixed(1)}K`,
            enviados: `${(Math.random() * 5).toFixed(1)}K`,
            topFansAvatars: [],
            isLive: false,
        };
        setProfileToView(userProfile);
    };


    return (
        <div className="absolute inset-0 bg-[#2d2d3a] flex flex-col font-sans text-white overflow-x-hidden">
            <LiveHeader
                onClose={() => setEndConfirmationOpen(true)}
                onProfileClick={onProfileModalOpen}
                onOnlineUsersClick={() => setOnlineUsersOpen(true)}
            />
            
            <main className="flex-grow flex flex-col overflow-hidden">
                {/* SCORE BAR AND TIMER ON TOP */}
                <div className="relative z-10 p-2">
                    <div className="relative w-full h-8 flex text-white font-bold text-base rounded-md shadow-md">
                        {/* Pink Section */}
                        <div 
                            className="relative bg-[#EC4899] flex items-center pl-3 overflow-hidden rounded-l-md" 
                            style={{ width: `${myProgress}%` }}
                        >
                            <div className="flex items-center space-x-1.5 z-10">
                                <StarIcon className="w-4 h-4 text-white" fill="white" />
                                <span>{myScore}</span>
                            </div>
                            {/* Sparkles */}
                            <div className="absolute w-0.5 h-0.5 bg-white/80 rounded-full top-2.5 left-1/3 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="absolute w-1 h-1 bg-white/90 rounded-full bottom-1.5 left-[45%] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                            <div className="absolute w-0.5 h-0.5 bg-white/70 rounded-full top-2 left-2/3 animate-pulse" style={{ animationDelay: '1.1s' }}></div>
                        </div>

                        {/* Blue Section */}
                        <div className="relative bg-[#3B82F6] flex-1 flex items-center justify-end pr-3 rounded-r-md">
                            <span>{opponentScore}</span>
                        </div>

                        {/* Separator */}
                        <div 
                            className="absolute top-full -translate-y-1/2 z-20" 
                            style={{ left: `${myProgress}%`, transform: 'translateX(-50%) translateY(-2px)' }}
                        >
                            <div className="w-0 h-0
                                border-l-[10px] border-l-transparent
                                border-r-[10px] border-r-transparent
                                border-t-[10px] border-t-white
                                drop-shadow-md">
                            </div>
                        </div>
                    </div>
                </div>

                {/* Container for videos and all overlays */}
                <div className="relative flex-1">
                    {/* Video Panels in the background */}
                    <div className="absolute inset-0 grid grid-cols-2">
                        <div className="relative flex items-center justify-center border-r border-white/20 bg-gray-900">
                           <img src="https://picsum.photos/seed/pk-left/400/600" alt="Streamer 1" className="w-full h-full object-cover" />
                           {/* My Top Gifters */}
                            <button onClick={onRankingModalOpen} className="absolute bottom-4 right-2 flex items-center space-x-1">
                                {topGifters.map(gifter => (
                                    <img key={gifter.id} src={gifter.avatar} alt="top gifter" className="w-8 h-8 rounded-full border-2 border-yellow-400" />
                                ))}
                            </button>
                        </div>
                        <div className="relative flex items-center justify-center bg-gray-800">
                           <button className="absolute inset-0 w-full h-full" onClick={() => setProfileToView(opponentUser)} aria-label="Ver perfil do oponente">
                                <img src="https://picsum.photos/seed/pk-right/400/600" alt="Streamer 2" className="w-full h-full object-cover" />
                            </button>
                             {/* Opponent Top Gifters */}
                            <button onClick={onRankingModalOpen} className="absolute bottom-4 right-2 flex items-center space-x-1">
                                {opponentTopGifters.map(gifter => (
                                     <img key={gifter.id} src={gifter.avatar} alt="top gifter" className="w-8 h-8 rounded-full border-2 border-gray-400" />
                                ))}
                            </button>
                        </div>
                    </div>

                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-5 py-2 text-white font-bold text-lg shadow-lg z-10">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Chat and Footer */}
                <div className="h-[35vh] flex flex-col p-3 relative">
                     {entryEffect && (
                        <div
                            key={entryEffect.id}
                            className="absolute top-[-20px] left-4 right-4 z-40 special-entry-animation"
                            onAnimationEnd={() => setEntryEffect(null)}
                        >
                            <p>{entryEffect.message}</p>
                        </div>
                    )}
                    <div ref={chatContainerRef} className="flex-grow flex flex-col justify-end overflow-y-auto space-y-2">
                        {messages.map((msg: any) => {
                            if (msg.type === 'entry') {
                                return <EntryChatMessage key={msg.id} user={msg.user} avatar={msg.avatar} />;
                            }
                            if (msg.type === 'chat') {
                                return (
                                    <ChatMessage
                                        key={msg.id}
                                        user={msg.user}
                                        level={msg.level}
                                        message={msg.message}
                                        avatarUrl={msg.avatar}
                                        onAvatarClick={() => handleViewChatUserProfile(msg)}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                     <footer className="pt-3">
                        <div className="bg-black/40 rounded-full flex items-center p-1.5 space-x-2">
                            <input type="text" placeholder="Diga oi..." className="flex-grow bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none" />
                            <button className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><SendIcon className="w-5 h-5 text-white" /></button>
                            <button onClick={onPrivateChatOpen} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><MessageIcon className="w-5 h-5 text-white" /></button>
                            <button onClick={onGiftModalOpen} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><GiftIcon className="w-5 h-5 text-yellow-400" /></button>
                            <button onClick={() => setIsToolsOpen(true)} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><MoreIcon className="w-5 h-5 text-white" /></button>
                        </div>
                    </footer>
                </div>
            </main>
            
            {isOnlineUsersOpen && <OnlineUsersModal onClose={() => setOnlineUsersOpen(false)} />}
            {isEndConfirmationOpen && <EndStreamConfirmationModal onCancel={() => setEndConfirmationOpen(false)} onConfirm={onClose} />}
            {isCoHostModalOpen && <CoHostInvitationScreen onClose={() => setCoHostModalOpen(false)} onInvite={handleInvite} />}
            {profileToView && <BroadcasterProfileModal user={profileToView} onClose={() => setProfileToView(null)} onStartChat={handleStartChat} />}
            {isToolsOpen && (
                <ToolsModal 
                    onClose={() => setIsToolsOpen(false)} 
                    onOpenCoHost={handleOpenCoHostModal}
                    onOpenBeautyPanel={handleOpenBeautyPanel}
                    onOpenClarityPanel={handleOpenClarityPanel}
                />
            )}
            {isBeautyPanelOpen && <BeautyEffectsPanel onClose={() => setBeautyPanelOpen(false)} />}
            {isResolutionPanelOpen && (
                <ResolutionPanel 
                    onClose={() => setResolutionPanelOpen(false)}
                    onSelectResolution={handleSelectResolution}
                    currentResolution={currentResolution}
                />
            )}
            {chatWithUser && (
                <div className="absolute inset-0 z-40 bg-black">
                    <ChatScreen
                        user={chatWithUser}
                        onBack={() => setChatWithUser(null)}
                        onOpenProfile={() => {
                            setChatWithUser(null);
                            setProfileToView(chatWithUser);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
export default PKBattleScreen;