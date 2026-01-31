import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import OnlineUsersModal from './live/OnlineUsersModal';
import ChatMessage from './live/ChatMessage';
import CoHostModal from './CoHostModal';
import EntryChatMessage from './live/EntryChatMessage';
import ToolsModal from './ToolsModal';
import { GiftIcon, SendIcon, MoreIcon, CloseIcon, ViewerIcon, BellIcon, LockIcon } from './icons';
import { Streamer, User, Gift, RankedUser, LiveSessionState, ToastType, GiftSendPayload } from '../types';
import ContributionRankingModal from './ContributionRankingModal';
import BeautyEffectsPanel from './live/BeautyEffectsPanel';
import ResolutionPanel from './live/ResolutionPanel';
import GiftModal from './live/GiftModal';
import { useTranslation } from '../i18n';
import { api } from '../services/api';
import { webSocketManager } from '../services/websocket';
import GiftAnimationOverlay from './live/GiftAnimationOverlay';
import PrivateInviteModal from './live/PrivateInviteModal';
import SupportersBar from './live/SupportersBar';

interface ChatMessageType {
    id: number;
    type: 'chat' | 'entry' | 'follow' | 'private_invite';
    user?: string;
    level?: number;
    message?: string | React.ReactNode;
    avatar?: string;
    fullUser?: User;
    inviteData?: {
        fromName: string;
        toName: string;
        streamId: string;
    };
    timestamp?: number;
}

interface PKBattleScreenProps {
    streamer: Streamer;
    opponent: User;
    onEndPKBattle: () => void;
    onRequestEndStream: () => void;
    onLeaveStreamView: () => void;
    onViewProfile: (user: User) => void;
    currentUser: User;
    onOpenWallet: (initialTab?: 'Diamante' | 'Ganhos') => void;
    onFollowUser: (user: User, streamId?: string) => void;
    onOpenPrivateChat: () => void;
    onOpenPrivateInviteModal: () => void;
    setActiveScreen: (screen: 'main' | 'profile' | 'messages' | 'video') => void;
    onOpenPKTimerSettings: () => void;
    onOpenFans: () => void;
    onOpenFriendRequests: () => void;
    liveSession: LiveSessionState | null;
    updateLiveSession: (updates: Partial<LiveSessionState>) => void;
    logLiveEvent: (type: string, data: any) => void;
    updateUser: (user: User) => void;
    onStreamUpdate: (updates: Partial<Streamer>) => void;
    addToast: (type: ToastType, message: string) => void;
    rankingData?: Record<string, RankedUser[]>;
    followingUsers?: User[];
    pkBattleDuration: number;
    streamers: Streamer[];
    onSelectStream: (streamer: Streamer) => void;
    onOpenVIPCenter: () => void;
    onOpenFanClubMembers: (streamer: User) => void;
    allUsers?: User[];
    onOpenSettings?: (view?: string) => void;
}

export const PKBattleScreen: React.FC<PKBattleScreenProps> = ({ 
    streamer, opponent, onEndPKBattle, onRequestEndStream, onLeaveStreamView, onViewProfile, currentUser,
    onOpenWallet, onFollowUser, onOpenPrivateChat, onOpenPrivateInviteModal,
    onOpenPKTimerSettings, onOpenFans, onOpenFriendRequests, liveSession,
    updateLiveSession, logLiveEvent, updateUser, onStreamUpdate, addToast,
    followingUsers = [], pkBattleDuration, onOpenVIPCenter, streamers, onSelectStream, onOpenFanClubMembers, allUsers,
    onOpenSettings
}) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(pkBattleDuration * 60);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [scores, setScores] = useState({ streamer: 0, opponent: 0 });
    
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isOnlineUsersOpen, setIsOnlineUsersOpen] = useState(false);
    const [isPrivateInviteModalOpen, setIsPrivateInviteModalOpen] = useState(false);
    const [isRankingOpen, setIsRankingOpen] = useState(false);
    const [isCoHostModalOpen, setIsCoHostModalOpen] = useState(false);
    const [isResolutionPanelOpen, setIsResolutionPanelOpen] = useState(false);
    const [isBeautyPanelOpen, setIsBeautyPanelOpen] = useState(false);
    
    const [onlineUsers, setOnlineUsers] = useState<(User & { value: number })[]>([]);
    const [currentEffect, setCurrentEffect] = useState<GiftSendPayload | null>(null);
    const previousOnlineUsersRef = useRef<(User & { value: number })[]>([]);

    const isBroadcaster = streamer.hostId === currentUser.id;

    useEffect(() => {
        if (timeLeft <= 0) {
            onEndPKBattle();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onEndPKBattle]);

    useEffect(() => {
        const handleNewGift = (payload: GiftSendPayload) => {
            if (payload.roomId !== streamer.id) return;
    
            const giftValue = (payload.gift.price || 0) * payload.quantity;
    
            if (payload.toUser.id === streamer.hostId) {
                setScores(prev => ({ ...prev, streamer: prev.streamer + giftValue }));
            } else if (payload.toUser.id === opponent.id) {
                setScores(prev => ({ ...prev, opponent: prev.opponent + giftValue }));
            }
        };
    
        webSocketManager.on('newStreamGift', handleNewGift);
    
        return () => {
            webSocketManager.off('newStreamGift', handleNewGift);
        };
    }, [streamer.id, streamer.hostId, opponent.id]);

    const totalScore = scores.streamer + scores.opponent;
    const streamerScorePercent = totalScore > 0 ? (scores.streamer / totalScore) * 100 : 50;
    const opponentScorePercent = 100 - streamerScorePercent;

    const streamerUser: User = useMemo(() => ({
        id: streamer.hostId,
        identification: streamer.hostId,
        name: streamer.name,
        avatarUrl: streamer.avatar,
        coverUrl: `https://picsum.photos/seed/${streamer.id}/800/1600`,
        country: streamer.country,
        age: 23,
        gender: 'female',
        level: 1,
        xp: 0,
        location: streamer.location,
        distance: 'desconhecida',
        fans: 3,
        following: 0,
        receptores: 0,
        enviados: 0,
        topFansAvatars: [],
        isLive: true,
        diamonds: 50000,
        earnings: 125000,
        earnings_withdrawn: 0,
        bio: 'Amante de streams!',
        obras: [],
        curtidas: [],
        ownedFrames: [],
        activeFrameId: null,
        frameExpiration: null,
    }), [streamer]);
    
    const isFollowed = useMemo(() => followingUsers.some(u => u.id === streamer.hostId), [followingUsers, streamer.hostId]);

    const handleSendGift = async (gift: Gift, quantity: number, targetId?: string): Promise<User | null> => {
        try {
            const finalTargetId = targetId || opponent.id;

            const apiCall = gift.isFromBackpack
                ? api.sendBackpackGift(currentUser.id, streamer.id, gift.id, quantity, finalTargetId)
                : api.sendGift(currentUser.id, streamer.id, gift.name, quantity, finalTargetId);
            
            const { success, updatedSender } = await apiCall;
    
            if (success && updatedSender) {
                updateUser(updatedSender);
                
                const allUsers = [streamerUser, opponent, ...onlineUsers];
                const recipient = allUsers.find(u => u.id === finalTargetId);

                const giftPayload: GiftSendPayload = {
                    fromUser: updatedSender,
                    toUser: { id: finalTargetId, name: recipient?.name || (finalTargetId === streamer.hostId ? streamer.name : opponent.name) },
                    gift,
                    quantity,
                    roomId: streamer.id
                };
    
                setCurrentEffect(giftPayload);
                
                const giftValue = (gift.price || 0) * quantity;
                if (giftValue > 0) {
                    if (finalTargetId === streamer.hostId) {
                        setScores(prev => ({ ...prev, streamer: prev.streamer + giftValue }));
                    } else if (finalTargetId === opponent.id) {
                        setScores(prev => ({ ...prev, opponent: prev.opponent + giftValue }));
                    }
                }
                
                if (gift.triggersAutoFollow && !isFollowed && finalTargetId === streamer.hostId) {
                    onFollowUser(streamerUser, streamer.id);
                }

                return updatedSender;
            } else {
                throw new Error("A API de presentes retornou uma falha.");
            }
        } catch (error) {
            console.error("Falha ao enviar presente na batalha PK:", error);
            addToast(ToastType.Error, (error as Error).message || "Falha ao enviar o presente.");
            api.users.me().then(user => {
                if (user) updateUser(user);
            });
            return null;
        }
    };

    const updateUsersList = useCallback((newUsers: (User & { value: number })[]) => {
        setOnlineUsers(newUsers);
        const previousUsers = previousOnlineUsersRef.current;
        if (previousUsers.length > 0) {
            const previousUserIds = new Set(previousUsers.map(u => u.id));
            const newlyJoinedUsers = newUsers.filter(u => !previousUserIds.has(u.id) && u.id !== currentUser.id);

            if (newlyJoinedUsers.length > 0) {
                const entryMessages: ChatMessageType[] = newlyJoinedUsers.map(user => ({
                    id: Date.now() + Math.random(),
                    type: 'entry',
                    fullUser: user,
                    user: user.name,
                    avatar: user.avatarUrl,
                }));
                setMessages(prev => [...prev, ...entryMessages]);
            }
        }
        previousOnlineUsersRef.current = newUsers;
    }, [currentUser.id]);

    const refreshOnlineUsers = useCallback(async () => {
        if (!streamer.id) return;
        try {
            const freshUsers = await api.users.getOnlineUsers(streamer.id);
            const users = Array.isArray(freshUsers) ? freshUsers : [];
            const mappedUsers = users.map(u => ({ ...u, value: (u as any).value || 0 }));
            updateUsersList(mappedUsers);
        } catch(err) {
            console.error("Failed to refresh online users for PK battle", err);
        }
    }, [streamer.id, updateUsersList]);
    
    const postGiftChatMessage = (payload: GiftSendPayload) => {
        const { fromUser, gift, toUser, quantity } = payload;
        
        const messageKey = quantity > 1 ? 'streamRoom.sentMultipleGiftsMessage' : 'streamRoom.sentGiftMessage';
        const messageOptions = { quantity, giftName: gift.name, receiverName: toUser.name };

        const giftMessage: ChatMessageType = {
            id: Date.now() + Math.random(),
            type: 'chat',
            fullUser: fromUser,
            user: fromUser.name,
            level: fromUser.level,
            message: (
                <span className="inline-flex items-center">
                    {t(messageKey, messageOptions)}
                    {gift.component ? React.cloneElement(gift.component as React.ReactElement<any>, { className: "w-5 h-5 inline-block ml-1.5" }) : <span className="ml-1.5">{gift.icon}</span>}
                </span>
            ),
            avatar: fromUser.avatarUrl,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, giftMessage]);
    };

    return (
        <div className="absolute inset-0 bg-gray-900 text-white font-sans z-10 flex flex-col">
            {/* Video backgrounds */}
            <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-black">
                    <img src={streamer.thumbnail || `https://picsum.photos/seed/${streamer.id}/400/800`} className="w-full h-full object-cover" alt="Streamer" />
                </div>
                <div className="w-1/2 h-full bg-black">
                    <img src={opponent.avatarUrl} className="w-full h-full object-cover" alt="Opponent" />
                </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

            {/* Gift Animation */}
            <div className="absolute inset-0 z-[200] pointer-events-none flex items-center justify-center">
                {currentEffect && (
                    <GiftAnimationOverlay
                        giftPayload={currentEffect}
                        onAnimationEnd={() => { if(currentEffect) postGiftChatMessage(currentEffect); setCurrentEffect(null); }}
                    />
                )}
            </div>

            {/* Header */}
            <header className="p-3 bg-transparent absolute top-0 left-0 right-0 z-20 flex justify-between items-start">
                {/* Streamer Info */}
                <div className="flex items-center space-x-2 bg-black/40 p-1 pr-3 rounded-full" onClick={() => onViewProfile(streamerUser)}>
                    <img src={streamer.avatar} alt={streamer.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-white font-bold text-sm">{streamer.name}</p>
                        <div className="flex items-center space-x-1 text-gray-300 text-xs">
                            <ViewerIcon className="w-4 h-4" />
                            <span>{(streamer.viewers || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                {/* Opponent Info */}
                <div className="flex items-center space-x-2 bg-black/40 p-1 pr-3 rounded-full" onClick={() => onViewProfile(opponent)}>
                    <img src={opponent.avatarUrl} alt={opponent.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-white font-bold text-sm">{opponent.name}</p>
                    </div>
                </div>
                <button onClick={isBroadcaster ? onRequestEndStream : onLeaveStreamView} className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center shrink-0">
                    <CloseIcon className="w-5 h-5 text-white" />
                </button>
            </header>

            {/* PK Battle UI */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                {/* Timer */}
                <div className="bg-black/50 backdrop-blur-md text-white text-3xl font-bold px-4 py-1 rounded-lg mb-4">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                {/* Score Bar */}
                <div className="w-64 h-4 bg-gray-800 rounded-full flex items-center relative">
                    <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${streamerScorePercent}%` }}></div>
                    <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${opponentScorePercent}%` }}></div>
                    <div className="absolute inset-0 flex justify-between items-center px-2 text-white text-xs font-bold">
                        <span>{scores.streamer}</span>
                        <span>{scores.opponent}</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold border-2 border-black">PK</div>
                </div>
            </div>
            
            {/* Supporters Bar */}
            <div className="absolute top-[40%] left-0 right-0 z-10">
                <SupportersBar streamerSupporters={[]} opponentSupporters={[]} onViewProfile={onViewProfile} />
            </div>

            {/* Chat and Footer */}
            <div className="mt-auto flex-1 flex flex-col justify-end">
                <div ref={chatContainerRef} className="max-h-[33vh] overflow-y-auto no-scrollbar flex flex-col-reverse p-3 pointer-events-auto">
                    <div className="space-y-2">
                        {messages.map((msg) => (
                            msg.type === 'entry' && msg.fullUser ? (
                                <EntryChatMessage key={msg.id} user={msg.fullUser} onClick={onViewProfile} />
                            ) : msg.type === 'chat' && msg.fullUser ? (
                                <ChatMessage 
                                    key={msg.id} 
                                    userObject={msg.fullUser} 
                                    message={msg.message || ''} 
                                    onAvatarClick={() => onViewProfile(msg.fullUser!)}
                                    streamerId={streamer.hostId}
                                    timestamp={msg.timestamp}
                                />
                            ) : null
                        ))}
                    </div>
                </div>

                <footer className="p-3 pointer-events-auto">
                    <div className="flex items-center space-x-2">
                        <div className="flex-grow bg-black/40 rounded-full flex items-center pr-1.5">
                            <input type="text" className="bg-transparent flex-grow px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none" placeholder={t('streamRoom.sayHi')} value={chatInput} onChange={e => setChatInput(e.target.value)} />
                            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><SendIcon className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => setIsGiftModalOpen(true)} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shadow-lg"><GiftIcon className="w-6 h-6 text-yellow-400" /></button>
                        {isBroadcaster && <button onClick={() => setIsToolsOpen(true)} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shadow-lg"><MoreIcon className="w-6 h-6 text-white" /></button>}
                    </div>
                </footer>
            </div>

            {/* Modals */}
            <GiftModal
                isOpen={isGiftModalOpen}
                onClose={() => setIsGiftModalOpen(false)}
                currentUser={currentUser}
                // FIX: Corrected 'onSendGift' prop to match its type signature by passing `handleSendGift` and added missing `hostUser` and `onlineUsers` props.
                onSendGift={handleSendGift}
                onRecharge={() => onOpenWallet('Diamante')}
                onOpenVIPCenter={onOpenVIPCenter}
                hostUser={streamerUser}
                onlineUsers={onlineUsers}
                onOpenSettings={onOpenSettings}
            />
            <ToolsModal
                isOpen={isToolsOpen}
                onClose={() => setIsToolsOpen(false)}
                onOpenBeautyPanel={() => { setIsToolsOpen(false); setIsBeautyPanelOpen(true); }}
                onOpenCoHostModal={() => { setIsToolsOpen(false); setIsCoHostModalOpen(true); }}
                isMicrophoneMuted={liveSession?.isMicrophoneMuted || false}
                onToggleMicrophone={() => {}}
                isSoundMuted={liveSession?.isStreamMuted || false}
                onToggleSound={() => {}}
                onOpenClarityPanel={() => { setIsToolsOpen(false); setIsResolutionPanelOpen(true); }}
                isPKBattleActive={true}
                onEndPKBattle={onEndPKBattle}
                onToggleModeration={() => {}}
                isModerationActive={false}
                onOpenPrivateInviteModal={onOpenPrivateInviteModal}
                onToggleAutoFollow={() => {}}
                isAutoFollowEnabled={liveSession?.isAutoFollowEnabled || false}
                onToggleAutoPrivateInvite={() => {}}
                isAutoPrivateInviteEnabled={liveSession?.isAutoPrivateInviteEnabled || false}
                onOpenPrivateChat={onOpenPrivateChat}
            />
            {isOnlineUsersOpen && (
                 <OnlineUsersModal 
                    onClose={() => setIsOnlineUsersOpen(false)} 
                    users={onlineUsers}
                    streamId={streamer.id}
                />
            )}
            {isCoHostModalOpen && (
                <CoHostModal
                    isOpen={isCoHostModalOpen}
                    onClose={() => setIsCoHostModalOpen(false)}
                    onInvite={() => {}}
                    onOpenTimerSettings={onOpenPKTimerSettings}
                    currentUser={currentUser}
                    addToast={addToast}
                    streamId={streamer.id}
                />
            )}
            {isResolutionPanelOpen && (
                <ResolutionPanel 
                    isOpen={isResolutionPanelOpen}
                    onClose={() => setIsResolutionPanelOpen(false)}
                    onSelectResolution={() => {}}
                    currentResolution={'720p'}
                />
            )}
            {isBeautyPanelOpen && (
                <BeautyEffectsPanel 
                    onClose={() => setIsBeautyPanelOpen(false)} 
                    addToast={addToast}
                />
            )}
            {isRankingOpen && (
                 <ContributionRankingModal
                    onClose={() => setIsRankingOpen(false)}
                    liveRanking={onlineUsers}
                />
            )}
            {isPrivateInviteModalOpen && (
                <PrivateInviteModal
                    isOpen={isPrivateInviteModalOpen}
                    onClose={() => setIsPrivateInviteModalOpen(false)}
                    streamId={streamer.id}
                    hostId={streamer.hostId}
                />
            )}
        </div>
    );
};
