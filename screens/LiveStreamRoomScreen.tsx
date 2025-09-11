import React, { useState, useEffect, useRef } from 'react';
import OnlineUsersModal from '../components/live/OnlineUsersModal';
import ToolsModal from '../components/live/ToolsModal';
import EndStreamConfirmationModal from '../components/live/EndStreamConfirmationModal';
import SoundWaveIcon from '../components/icons/SoundWaveIcon';
import MoreIcon from '../components/icons/MoreIcon';
import HeartFilledIcon from '../components/icons/HeartFilledIcon';
import CoinFilledIcon from '../components/icons/CoinFilledIcon';
import BroadcasterProfileModal from '../components/live/BroadcasterProfileModal';
import SendIcon from '../components/icons/SendIcon';
import GiftIcon from '../components/icons/GiftIcon';
import MessageIcon from '../components/icons/MessageIcon';
import RankingModal from '../components/live/RankingModal';
import GiftModal from '../components/live/GiftModal';
import CoHostInvitationScreen from '../components/live/CoHostInvitationScreen';
import BeautyEffectsPanel from '../components/live/BeautyEffectsPanel';
import PKBattleScreen from './PKBattleScreen';
import MaleIcon from '../components/icons/MaleIcon';
import FemaleIcon from '../components/icons/FemaleIcon';
import LevelBadgeIcon from '../components/icons/LevelBadgeIcon';
import PrivateChatModal from '../components/live/PrivateChatModal';
import PlusIcon from '../components/icons/PlusIcon';
import LiveHeader from '../components/live/LiveHeader';
import ChatMessage from '../components/live/ChatMessage';
import EntryChatMessage from '../components/live/EntryChatMessage';
import { ProfileUser } from './BroadcasterProfileScreen';
import PurchaseConfirmationScreen from './PurchaseConfirmationScreen';
import ResolutionPanel from '../components/live/ResolutionPanel';


interface LiveStreamRoomScreenProps {
    onEndLive: (duration: string) => void;
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

const LiveStreamRoomScreen: React.FC<LiveStreamRoomScreenProps> = ({ onEndLive }) => {
    const [isOnlineUsersOpen, setOnlineUsersOpen] = useState(false);
    const [isToolsOpen, setToolsOpen] = useState(false);
    const [isEndConfirmationOpen, setEndConfirmationOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isRankingModalOpen, setRankingModalOpen] = useState(false);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isCoHostModalOpen, setCoHostModalOpen] = useState(false);
    const [isBeautyPanelOpen, setBeautyPanelOpen] = useState(false);
    const [isPKBattleOpen, setPKBattleOpen] = useState(false);
    const [isPrivateChatOpen, setPrivateChatOpen] = useState(false);
    const [privateChatUser, setPrivateChatUser] = useState<{name: string, avatar: string} | null>(null);
    const [viewedUser, setViewedUser] = useState<ProfileUser | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [entryEffect, setEntryEffect] = useState<{ id: number; message: string } | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedPurchasePackage, setSelectedPurchasePackage] = useState<{ amount: number; price: number } | null>(null);
    const [isResolutionPanelOpen, setResolutionPanelOpen] = useState(false);
    const [currentResolution, setCurrentResolution] = useState('480p');
    const videoRef = useRef<HTMLVideoElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<Date>(new Date());

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                if (err instanceof Error) {
                    setCameraError(`Failed to access camera: ${err.message}. The stream cannot start. Please check permissions and ensure your camera is not in use.`);
                } else {
                    setCameraError('An unknown error occurred while trying to access the camera. The stream cannot start.');
                }
            }
        };

        startCamera();
        startTimeRef.current = new Date();
        
        // Simulate live chat and entries
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


        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            clearInterval(interval);
        };
    }, []);
    
    const handleEndStream = () => {
        const endTime = new Date();
        const durationMs = endTime.getTime() - startTimeRef.current.getTime();
        
        const hours = String(Math.floor(durationMs / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((durationMs % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(durationMs % 1000).padStart(3, '0');
        const randomDecimal = '491999999998'; // Mimic screenshot
        const formattedDuration = `${hours}:${minutes}:${seconds}.${milliseconds}${randomDecimal}`;
        
        onEndLive(formattedDuration);
    };

    const handleOpenCoHostModal = () => {
        setToolsOpen(false);
        setCoHostModalOpen(true);
    };

    const handleOpenBeautyPanel = () => {
        setToolsOpen(false);
        setBeautyPanelOpen(true);
    };

    const handleOpenClarityPanel = () => {
        setToolsOpen(false);
        setResolutionPanelOpen(true);
    };

    const handleSelectResolution = (resolution: string) => {
        setCurrentResolution(resolution);
        setResolutionPanelOpen(false);
        // Logic to change video quality would go here
    };

    const handleInviteToPK = () => {
        setCoHostModalOpen(false);
        setPKBattleOpen(true);
    };

    const handleViewUserProfile = (user: any) => {
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
        setViewedUser(userProfile);
    };
    
    const handleStartChat = (userToChat: ProfileUser) => {
        setViewedUser(null);
        setPrivateChatUser({ name: userToChat.name, avatar: userToChat.avatarUrl });
        setPrivateChatOpen(true);
    };
    
    const handleInitiatePurchase = (pkg: { amount: number; price: number }) => {
        setSelectedPurchasePackage(pkg);
        setIsGiftModalOpen(false); // Close gift modal for better UX
    };

    return (
        <div className="fixed inset-0 bg-[#2d2d3a] text-white font-sans">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            
            {cameraError && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-50">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Streaming Error</h2>
                    <p className="text-gray-300 max-w-md">{cameraError}</p>
                    <button onClick={() => setEndConfirmationOpen(true)} className="mt-8 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full">
                        End Stream
                    </button>
                </div>
            )}
            
            {!cameraError && (
                <>
                    {isPKBattleOpen ? (
                        <PKBattleScreen
                            onClose={() => setPKBattleOpen(false)}
                            onProfileModalOpen={() => setProfileModalOpen(true)}
                            onGiftModalOpen={() => setIsGiftModalOpen(true)}
                            onPrivateChatOpen={() => setPrivateChatOpen(true)}
                            onRankingModalOpen={() => setRankingModalOpen(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-black/10 flex flex-col justify-between">
                            <LiveHeader
                                onClose={() => setEndConfirmationOpen(true)}
                                onProfileClick={() => setProfileModalOpen(true)}
                                onOnlineUsersClick={() => setOnlineUsersOpen(true)}
                            />

                            <main className="flex-grow flex flex-col justify-between overflow-hidden relative">
                                <div className="p-3 flex items-start space-x-2">
                                    <button onClick={() => setRankingModalOpen(true)} className="bg-black/30 rounded-full px-3 py-1 text-sm flex items-center space-x-2">
                                        <CoinFilledIcon className="w-5 h-5" />
                                        <span className="font-bold">0</span>
                                    </button>
                                    <div className="bg-black/30 rounded-full px-3 py-1 text-sm flex items-center space-x-2">
                                        <HeartFilledIcon className="w-5 h-5" />
                                        <span className="font-bold">0</span>
                                    </div>
                                </div>

                                {entryEffect && (
                                    <div
                                        key={entryEffect.id}
                                        className="absolute top-[40%] left-4 right-4 z-40 special-entry-animation"
                                        onAnimationEnd={() => setEntryEffect(null)}
                                    >
                                        <p>{entryEffect.message}</p>
                                    </div>
                                )}
                                
                                <div ref={chatContainerRef} className="h-[35vh] flex flex-col justify-end p-3 overflow-y-auto no-scrollbar space-y-2">
                                {messages.map((msg: any) => {
                                        if (msg.type === 'entry') {
                                            return <EntryChatMessage key={msg.id} user={msg.user} avatar={msg.avatar} />;
                                        }
                                        if (msg.type === 'chat') {
                                            return (
                                                <div key={msg.id} className="self-start">
                                                    <ChatMessage
                                                        user={msg.user}
                                                        level={msg.level}
                                                        message={msg.message}
                                                        avatarUrl={msg.avatar}
                                                        onAvatarClick={() => handleViewUserProfile(msg)}
                                                    />
                                                </div>
                                            );
                                        }
                                        return null;
                                })}
                                </div>
                            </main>

                            {/* Footer */}
                            <footer className="p-3">
                                <div className="bg-black/40 rounded-full flex items-center p-1.5 space-x-2">
                                    <div className="flex-grow flex items-center">
                                        <input type="text" placeholder="Diga oi..." className="flex-grow bg-transparent px-3 text-white placeholder-gray-400 focus:outline-none" />
                                    </div>
                                    <button className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><SendIcon className="w-5 h-5 text-white" /></button>
                                    <button onClick={() => setPrivateChatOpen(true)} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MessageIcon className="w-5 h-5 text-white" />
                                    </button>
                                    <button onClick={() => setIsGiftModalOpen(true)} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><GiftIcon className="w-5 h-5 text-yellow-400" /></button>
                                    <button onClick={() => setToolsOpen(true)} className="bg-gray-500/50 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"><MoreIcon className="w-5 h-5" /></button>
                                </div>
                            </footer>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {isOnlineUsersOpen && <OnlineUsersModal onClose={() => setOnlineUsersOpen(false)} />}
            {isToolsOpen && <ToolsModal onClose={() => setToolsOpen(false)} onOpenCoHost={handleOpenCoHostModal} onOpenBeautyPanel={handleOpenBeautyPanel} onOpenClarityPanel={handleOpenClarityPanel} />}
            {isEndConfirmationOpen && <EndStreamConfirmationModal onCancel={() => setEndConfirmationOpen(false)} onConfirm={handleEndStream} />}
            {isProfileModalOpen && <BroadcasterProfileModal onClose={() => setProfileModalOpen(false)} />}
            {isRankingModalOpen && <RankingModal onClose={() => setRankingModalOpen(false)} />}
            {isGiftModalOpen && <GiftModal onClose={() => setIsGiftModalOpen(false)} onInitiatePurchase={handleInitiatePurchase} />}
            {isCoHostModalOpen && <CoHostInvitationScreen onClose={() => setCoHostModalOpen(false)} onInvite={handleInviteToPK} />}
            {isBeautyPanelOpen && <BeautyEffectsPanel onClose={() => setBeautyPanelOpen(false)} />}
            {isPrivateChatOpen && <PrivateChatModal onClose={() => setPrivateChatOpen(false)} streamerName={privateChatUser ? privateChatUser.name : "Rainha PK"} streamerAvatar={privateChatUser ? privateChatUser.avatar : "https://picsum.photos/seed/profile/40/40"} />}
            {viewedUser && (
                <BroadcasterProfileModal
                    user={viewedUser}
                    onClose={() => setViewedUser(null)}
                    onStartChat={handleStartChat}
                />
            )}
            {selectedPurchasePackage && (
                <PurchaseConfirmationScreen 
                    packageInfo={selectedPurchasePackage} 
                    onClose={() => setSelectedPurchasePackage(null)} 
                />
            )}
            {isResolutionPanelOpen && <ResolutionPanel 
                onClose={() => setResolutionPanelOpen(false)} 
                onSelectResolution={handleSelectResolution}
                currentResolution={currentResolution}
            />}
        </div>
    );
};

export default LiveStreamRoomScreen;