import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import OnlineUsersModal from './live/OnlineUsersModal';
import ChatMessage from './live/ChatMessage';
import CoHostModal from './CoHostModal';
import EntryChatMessage from './live/EntryChatMessage';
import ToolsModal from './ToolsModal';
import { GiftIcon, MessageIcon, SendIcon, MoreIcon, CloseIcon, PlusIcon, ViewerIcon, GoldCoinWithGIcon, HeartIcon, BellIcon, FanClubHeaderIcon, TrophyIcon } from './icons';
import { Streamer, User, Gift, ToastType, LiveSessionState, GiftSendPayload } from '../types';
import ContributionRankingModal from './ContributionRankingModal';
import BeautyEffectsPanel from './live/BeautyEffectsPanel';
import ResolutionPanel from './live/ResolutionPanel';
import GiftModal from './live/GiftModal';
import { useTranslation } from '../i18n';
import { api } from '../services/api';
import UserActionModal from './UserActionModal';
import { webSocketManager } from '../services/websocket';
import FriendRequestNotification from './live/FriendRequestNotification';
import { RankedAvatar } from './live/RankedAvatar';
import GiftAnimationOverlay from './live/GiftAnimationOverlay';
import { avatarFramesData, getRemainingDays, getFrameGlowClass } from '../services/db_shared';
import * as FrameIcons from './icons/frames';
import FanClubModal from './live/FanClubModal';
import JoinFanClubModal from './live/JoinFanClubModal';
import FanClubEntryMessage from './live/FanClubEntryMessage';
import UserMentionSuggestions from './live/UserMentionSuggestions';
import PrivateChatScreen from './screens/PrivateChatScreen';
import { LoadingSpinner } from './Loading';

interface ChatMessageType {
    id: number;
    type: 'chat' | 'entry' | 'friend_request' | 'follow' | 'fan_entry';
    user?: string;
    fullUser?: User;
    follower?: User;
    age?: number;
    gender?: 'male' | 'female' | 'not_specified';
    level?: number;
    message?: string | React.ReactNode;
    translatedText?: string;
    avatar?: string;
    followedUser?: string;
    isModerator?: boolean;
    activeFrameId?: string | null;
    frameExpiration?: string | null;
    fanClub?: { streamerId: string; streamerName: string; level: number; };
    timestamp?: number;
}

interface StreamRoomProps {
    streamer: Streamer;
    onRequestEndStream: () => void;
    onLeaveStreamView: () => void;
    onStartPKBattle: (opponent: User) => void;
    onViewProfile: (user: User, isEditing?: boolean) => void;
    currentUser: User;
    onOpenWallet: (initialTab?: 'Diamante' | 'Ganhos') => void;
    onFollowUser: (user: User, streamId?: string) => void;
    onOpenPrivateChat: () => void;
    onOpenPrivateInviteModal: () => void;
    setActiveScreen: (screen: 'main' | 'profile' | 'messages' | 'video') => void;
    onOpenPKTimerSettings: () => void;
    onOpenFans: () => void;
    onOpenFriendRequests: () => void;
    updateUser: (user: User) => void;
    liveSession: LiveSessionState | null;
    updateLiveSession: (updates: Partial<LiveSessionState>) => void;
    logLiveEvent: (type: string, data: any) => void;
    onStreamUpdate: (updates: Partial<Streamer>) => void;
    addToast: (type: ToastType, message: string) => void;
    followingUsers: User[];
    streamers: Streamer[];
    onSelectStream: (streamer: Streamer) => void;
    onOpenVIPCenter: () => void;
    onOpenFanClubMembers: (streamer: User) => void;
    onOpenSettings?: (view?: string) => void;
}

const FollowChatMessage: React.FC<{ follower: string; followed: string }> = ({ follower, followed }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-purple-500/30 rounded-full p-1.5 px-3 flex items-center self-start text-xs shadow-md">
            <span className="text-purple-300 font-bold">{follower}</span>
            <span className="text-gray-200 ml-1.5">{t('streamRoom.followed')}</span>
            <span className="text-purple-300 font-bold ml-1.5">{followed}! 🎉</span>
        </div>
    );
};

const LuckyGiftModal: React.FC<{ isOpen: boolean; onClose: () => void; giftPayload: GiftSendPayload; }> = ({ isOpen, onClose, giftPayload }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const { fromUser, gift, quantity } = giftPayload;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
            <style>{`
                @keyframes lucky-rays { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .lucky-rays { animation: lucky-rays 20s linear infinite; }
                @keyframes prize-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .prize-pulse { animation: prize-pulse 2s infinite ease-in-out; }
            `}</style>
            <div className="relative bg-gradient-to-b from-purple-900 via-gray-900 to-black w-[90%] max-w-sm p-6 rounded-3xl border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/20 text-center overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute inset-0 opacity-20 lucky-rays">
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-400" style={{ clipPath: 'polygon(50% 0%, 52% 0%, 51% 100%, 49% 100%)' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-400 rotate-45" style={{ clipPath: 'polygon(50% 0%, 52% 0%, 51% 100%, 49% 100%)' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-400 rotate-90" style={{ clipPath: 'polygon(50% 0%, 52% 0%, 51% 100%, 49% 100%)' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-400 -rotate-45" style={{ clipPath: 'polygon(50% 0%, 52% 0%, 51% 100%, 49% 100%)' }}></div>
                </div>
                <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/20 rounded-full text-gray-400 hover:text-white z-20"><CloseIcon className="w-4 h-4" /></button>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-widest" style={{ textShadow: '0 2px 10px rgba(250, 204, 21, 0.5)' }}>Presente da Sorte!</h2>
                    <p className="text-gray-300 text-sm mt-2"><span className="font-bold text-white">{fromUser.name}</span> enviou um presente especial!</p>
                    <div className="my-8 flex justify-center prize-pulse">
                        <div className="relative text-8xl">
                            {gift.component ? gift.component : gift.icon}
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center border-4 border-purple-900">x{quantity}</div>
                        </div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                        <p className="text-yellow-300 text-lg font-bold">Prêmio: <span className="text-white">500x Diamantes!</span></p>
                        <p className="text-xs text-gray-400 mt-1">O valor do presente foi multiplicado!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const StreamRoom: React.FC<StreamRoomProps> = ({ streamer, onRequestEndStream, onLeaveStreamView, onStartPKBattle, onViewProfile, currentUser, onOpenWallet, onFollowUser, onOpenPrivateChat, onOpenPrivateInviteModal, setActiveScreen, onOpenPKTimerSettings, onOpenFans, onOpenFriendRequests, updateUser, liveSession, updateLiveSession, logLiveEvent, onStreamUpdate, addToast, followingUsers, streamers, onSelectStream, onOpenVIPCenter, onOpenFanClubMembers }) => {
    const { t, language } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const viewerPcRef = useRef<RTCPeerConnection | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const [isUiVisible, setIsUiVisible] = useState(true);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isBeautyPanelOpen, setBeautyPanelOpen] = useState(false);
    const [isCoHostModalOpen, setIsCoHostModalOpen] = useState(false);
    const [isOnlineUsersOpen, setOnlineUsersOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const [isRankingOpen, setIsRankingOpen] = useState(false);
    const [isResolutionPanelOpen, setResolutionPanelOpen] = useState(false);
    const [currentResolution, setCurrentResolution] = useState(streamer.quality || '480p');
    const [isGiftModalOpen, setGiftModalOpen] = useState(false);
    const [userActionModalState, setUserActionModalState] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [isModerationMode, setIsModerationMode] = useState(false);
    const [isAutoPrivateInviteEnabled, setIsAutoPrivateInviteEnabled] = useState(liveSession?.isAutoPrivateInviteEnabled ?? false);
    const [onlineUsers, setOnlineUsers] = useState<(User & { value: number })[]>([]);
    const previousOnlineUsersRef = useRef<(User & { value: number })[]>([]);
    const [lastUsersUpdate, setLastUsersUpdate] = useState<number>(Date.now());
    const usersUpdateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [giftAnimationQueue, setGiftAnimationQueue] = useState<GiftSendPayload[]>([]);
    const [currentGiftAnimation, setCurrentGiftAnimation] = useState<GiftSendPayload | null>(null);
    const [isFanClubModalOpen, setIsFanClubModalOpen] = useState(false);
    const [isJoinFanClubModalOpen, setIsJoinFanClubModalOpen] = useState(false);
    const [isChatInputFocused, setIsChatInputFocused] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
    const [isPrivateChatOpen, setIsPrivateChatOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [streamerAsUser, setStreamerAsUser] = useState<User | null>(null);
    const [isLuckyGiftModalOpen, setIsLuckyGiftModalOpen] = useState(false);
    const [luckyGiftPayload, setLuckyGiftPayload] = useState<GiftSendPayload | null>(null);
    const [allGifts, setAllGifts] = useState<Gift[]>([]);

    const avatarFrames = useMemo(() => {
        const frameComponentMap: Record<string, React.FC<any>> = FrameIcons;
        return avatarFramesData.map(frame => ({
            ...frame,
            component: frameComponentMap[`${frame.id}Icon`]
        }));
    }, []);

    const isBroadcaster = streamer.hostId === currentUser.id;

    useEffect(() => {
        api.gifts.list().then(gifts => setAllGifts(gifts || [])).catch(() => setAllGifts([]));
    }, []);

    useEffect(() => {
        let isMounted = true;
        api.users.get(streamer.hostId).then(user => {
            if (isMounted) setStreamerAsUser(user);
        }).catch(err => {
            console.error("Could not fetch full streamer profile", err);
        });
        return () => { isMounted = false; };
    }, [streamer.hostId]);
    
    useEffect(() => {
        if (isBroadcaster) {
            setIsConnecting(false);
            return;
        }

        let isActive = true;

        const startViewerConnection = async () => {
            setIsConnecting(true);

            try {
                const streamUrl = streamer.streamUrl || `webrtc://localhost/live/${streamer.id}`;
                const config: RTCConfiguration = {
                    iceServers: [
                        {
                            urls: ['stun:72.60.249.175:3478', 'turn:72.60.249.175:3478'],
                            username: 'livego',
                            credential: 'adriano123',
                        },
                    ],
                    iceTransportPolicy: 'all',
                };

                const pc = new RTCPeerConnection(config);
                viewerPcRef.current = pc;

                const remoteStream = new MediaStream();
                remoteStreamRef.current = remoteStream;

                if (videoRef.current) {
                    videoRef.current.srcObject = remoteStream;
                }

                pc.ontrack = (event) => {
                    event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
                };

                const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
                await pc.setLocalDescription(offer);

                const { sdp } = await api.srs.rtcPlay(offer.sdp || '', streamUrl);
                await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));

                if (videoRef.current) {
                    await videoRef.current.play().catch(() => undefined);
                }

                if (isActive) {
                    setIsConnecting(false);
                }
            } catch (error) {
                console.error('Falha ao conectar na transmissão WebRTC:', error);
                if (isActive) {
                    setIsConnecting(false);
                    addToast(ToastType.Error, 'Não foi possível carregar o vídeo da live.');
                }
            }
        };

        startViewerConnection();

        return () => {
            isActive = false;
            if (viewerPcRef.current) {
                viewerPcRef.current.close();
                viewerPcRef.current = null;
            }
            if (remoteStreamRef.current) {
                remoteStreamRef.current.getTracks().forEach(track => track.stop());
                remoteStreamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [streamer.id, streamer.streamUrl, addToast, isBroadcaster]);

    const isFollowed = useMemo(() => followingUsers.some(u => u.id === streamer.hostId), [followingUsers, streamer.hostId]);
    const isFanClubMember = useMemo(() => !!currentUser.fanClub && currentUser.fanClub.streamerId === streamer.hostId, [currentUser.fanClub, streamer.hostId]);
    const isJuFeFanClub = streamer.hostId === '40583726';

    const streamerUserObject = useMemo(() => {
        if (streamerAsUser) return streamerAsUser;
    
        return {
            id: streamer.hostId,
            identification: streamer.hostId,
            name: streamer.name,
            avatarUrl: streamer.avatar,
            coverUrl: `https://picsum.photos/seed/${streamer.id}/800/1600`,
            location: streamer.location,
            isLive: true,
            country: streamer.country || 'br', age: 0, gender: 'not_specified', level: 1, xp: 0, fans: 0, following: 0, receptores: 0, enviados: 0, diamonds: 0, earnings: 0, earnings_withdrawn: 0, bio: streamer.description || 'Amante de streams!',
        } as User;
    }, [streamer, streamerAsUser]);

    const streamerDisplayUser = isBroadcaster ? currentUser : streamerUserObject;

    const remainingDays = getRemainingDays(streamerDisplayUser.frameExpiration);
    const activeFrame = (streamerDisplayUser.activeFrameId && remainingDays && remainingDays > 0)
        ? avatarFrames.find(f => f.id === streamerDisplayUser.activeFrameId)
        : null;
    const ActiveFrameComponent = activeFrame ? (activeFrame as any).component : null;
    const frameGlowClass = getFrameGlowClass(streamerDisplayUser.activeFrameId);
    
    const swipeStart = useRef<{ x: number, y: number } | null>(null);
    const minSwipeDistance = 50;

    const handlePointerDown = (clientX: number, clientY: number) => {
        if (isChatInputFocused) return;
        swipeStart.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
        if (isChatInputFocused || !swipeStart.current) {
            swipeStart.current = null;
            return;
        }

        const deltaX = clientX - swipeStart.current.x;
        const deltaY = clientY - swipeStart.current.y;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            const currentIndex = streamers.findIndex(s => s.id === streamer.id);
            if (currentIndex === -1 || streamers.length <= 1) return;

            if (deltaY < 0) {
                const nextIndex = (currentIndex + 1) % streamers.length;
                onSelectStream(streamers[nextIndex]);
            } else {
                const prevIndex = (currentIndex - 1 + streamers.length) % streamers.length;
                onSelectStream(streamers[prevIndex]);
            }
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            setIsUiVisible(p => !p);
        }

        swipeStart.current = null;
    };
    
     const updateUsersList = useCallback((newUsers: (User & { value: number })[]) => {
        setOnlineUsers(prevUsers => {
            if (JSON.stringify(prevUsers) === JSON.stringify(newUsers)) {
                return prevUsers;
            }
            return newUsers;
        });
        updateLiveSession({ viewers: newUsers.length });

        const previousUsers = previousOnlineUsersRef.current;
        if (previousUsers.length > 0) {
            const previousUserIds = new Set(previousUsers.map(u => u.id));
            const newlyJoinedUsers = newUsers.filter(u => !previousUserIds.has(u.id) && u.id !== currentUser.id);

            if (newlyJoinedUsers.length > 0) {
                const entryMessages: ChatMessageType[] = newlyJoinedUsers.map(user => {
                    const isFan = user.fanClub && user.fanClub.streamerId === streamer.hostId;
                    return {
                        id: Date.now() + Math.random(),
                        type: isFan ? 'fan_entry' : 'entry',
                        fullUser: user,
                    };
                });
                setMessages(prev => [...prev, ...entryMessages]);
            }
        }
        previousOnlineUsersRef.current = newUsers;
    }, [currentUser.id, streamer.hostId, updateLiveSession]);

    const refreshOnlineUsers = useCallback(async () => {
        if (!streamer.id) return;
        try {
            const freshUsers = await api.users.getOnlineUsers(streamer.id);
            const usersWithValue = freshUsers.map(u => ({ ...u, value: (u as any).value || 0 }));
            updateUsersList(usersWithValue);
        } catch (err) {
            console.error("Failed to refresh online users:", err);
        }
    }, [streamer.id, updateUsersList]);
    
    const handleViewOnlineUsers = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await refreshOnlineUsers();
        setOnlineUsersOpen(true);
    };

    useEffect(() => {
        setMessages([]); // Clear chat from the previous stream when streamer changes.
        previousOnlineUsersRef.current = [];
    }, [streamer.id]);

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
            activeFrameId: fromUser.activeFrameId,
            frameExpiration: fromUser.frameExpiration,
            fanClub: fromUser.fanClub,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, giftMessage]);
    };

    const handleGiftAnimationEnd = () => {
        if (currentGiftAnimation) {
            postGiftChatMessage(currentGiftAnimation);
        }
        setCurrentGiftAnimation(null);
    };

    useEffect(() => {
        if (!currentGiftAnimation && giftAnimationQueue.length > 0) {
            const nextGift = giftAnimationQueue[0];
            setCurrentGiftAnimation(nextGift);
            setGiftAnimationQueue(prev => prev.slice(1));
        }
    }, [currentGiftAnimation, giftAnimationQueue]);

    useEffect(() => {
        const handleFollowUpdate = (payload: { follower: User, followed: User, isUnfollow: boolean }) => {
            if (payload.isUnfollow) return; 

            const { follower, followed } = payload;
            
            const newMessage: ChatMessageType = (followed.id === currentUser.id)
                ? { id: Date.now() + Math.random(), type: 'friend_request', follower: follower }
                : { id: Date.now() + Math.random(), type: 'follow', user: follower.name, followedUser: followed.name, avatar: follower.avatarUrl };

            setMessages(prev => [...prev, newMessage]);
        };

        webSocketManager.on('followUpdate', handleFollowUpdate);
        
        const handleAutoInviteStateUpdate = (payload: { roomId: string; isEnabled: boolean }) => {
            if (payload.roomId === streamer.id) {
                setIsAutoPrivateInviteEnabled(payload.isEnabled);
            }
        };
        webSocketManager.on('autoInviteStateUpdate', handleAutoInviteStateUpdate);

        const handleOnlineUsersUpdate = (data: { roomId: string; users: (User & { value: number })[] }) => {
            if (data.roomId !== streamer.id) return;
        };
        webSocketManager.on('onlineUsersUpdate', handleOnlineUsersUpdate);


        return () => {
            webSocketManager.off('followUpdate', handleFollowUpdate);
            webSocketManager.off('autoInviteStateUpdate', handleAutoInviteStateUpdate);
            webSocketManager.off('onlineUsersUpdate', handleOnlineUsersUpdate);
            if (usersUpdateTimeout.current) {
                clearTimeout(usersUpdateTimeout.current);
                usersUpdateTimeout.current = null;
            }
        };
    }, [streamer.id, streamer.hostId, currentUser, language, t, onOpenFriendRequests, liveSession, updateLiveSession]);

    const handleSendMessage = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        if (chatInput.trim() === '' || !currentUser) return;
        
        const messagePayload: ChatMessageType = {
            id: Date.now() + Math.random(), // Temp ID for optimistic update
            type: 'chat' as const,
            message: chatInput.trim(),
            fullUser: currentUser,
            timestamp: Date.now(),
        };
        
        // Optimistic update
        setMessages(prev => [...prev, messagePayload]);
        
        api.chats.sendMessage(streamer.id, messagePayload).catch(err => {
            addToast(ToastType.Error, "Falha ao enviar mensagem.");
            // Revert on failure
            setMessages(prev => prev.filter(m => m.id !== messagePayload.id));
        });
        
        setChatInput('');
    };

    const handleTogglePrivacy = async () => {
        if (!isBroadcaster) return;
        const newPrivacy = !streamer.isPrivate;
        try {
            await api.streams.update(streamer.id, { isPrivate: newPrivacy });
            onStreamUpdate({ isPrivate: newPrivacy });
        } catch (error) {
            console.error("Failed to update privacy:", error);
        }
    };

    const handleFollowStreamer = () => {
        onFollowUser(streamerUserObject, streamer.id);
    };

    const handleInvite = (opponent: User) => {
        setIsCoHostModalOpen(false);
        onStartPKBattle(opponent);
    };
    
    const handleOpenCoHostModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolsOpen(false);
        setIsCoHostModalOpen(true);
    };

    const handleOpenBeautyPanel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolsOpen(false);
        setBeautyPanelOpen(true);
    };

    const handleOpenClarityPanel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsToolsOpen(false);
        setResolutionPanelOpen(true);
    };

    const handleSelectResolution = async (resolution: string) => {
        const { success } = await api.streams.updateVideoQuality(streamer.id, resolution);
        if (success) {
            setCurrentResolution(resolution);
            onStreamUpdate({ quality: resolution });
            addToast(ToastType.Success, `Qualidade do vídeo alterada para ${resolution}`);
        } else {
            addToast(ToastType.Error, `Falha ao alterar a qualidade do vídeo.`);
        }
        setResolutionPanelOpen(false);
    };
    
    const constructUserFromMessage = (user: ChatMessageType): User => {
        if (user.fullUser) {
            return user.fullUser;
        }
        return { 
            id: `user-${user.id}`, 
            identification: `user-${user.id}`, 
            name: user.user || 'Anonimo', 
            avatarUrl: user.avatar || 'https://picsum.photos/seed/anon/200', 
            coverUrl: `https://picsum.photos/seed/${user.id}/800/1200`, 
            country: 'br', 
            gender: user.gender || 'not_specified', 
            level: user.level || 1, 
            xp: 0,
            age: user.age || 18, 
            location: 'Brasil', 
            distance: 'desconhecida', 
            fans: Math.floor(Math.random() * 10000),
            following: Math.floor(Math.random() * 500),
            receptores: Math.floor(Math.random() * 100000),
            enviados: Math.floor(Math.random() * 5000),
            topFansAvatars: [], 
            isLive: false, 
            diamonds: 0, 
            earnings: 0,
            earnings_withdrawn: 0, 
            bio: 'Usuário da plataforma', 
            obras: [], 
            curtidas: [],
            ownedFrames: [],
            activeFrameId: user.activeFrameId || null,
            frameExpiration: user.frameExpiration || null,
            fanClub: user.fanClub,
        };
    };

    const handleSendGift = async (gift: Gift, quantity: number, targetId?: string): Promise<User | null> => {
        try {
            const apiCall = gift.isFromBackpack
                ? api.sendBackpackGift(currentUser.id, streamer.id, gift.id, quantity, targetId || streamer.hostId)
                : api.sendGift(currentUser.id, streamer.id, gift.name, quantity, targetId || streamer.hostId);
            
            const { success, updatedSender } = await apiCall;
    
            if (success && updatedSender) {
                updateUser(updatedSender);
                
                const finalTargetId = targetId || streamer.hostId;
                const allUsers = [streamerUserObject, ...onlineUsers];
                const recipient = allUsers.find(u => u.id === finalTargetId);

                const giftPayload: GiftSendPayload = {
                    fromUser: updatedSender,
                    toUser: { id: finalTargetId, name: recipient?.name || streamer.name },
                    gift,
                    quantity,
                    roomId: streamer.id
                };
    
                if (gift.isLucky) {
                    setLuckyGiftPayload(giftPayload);
                    setIsLuckyGiftModalOpen(true);
                } else {
                    setGiftAnimationQueue(prev => [...prev, giftPayload]);
                }
    
                if (gift.triggersAutoFollow && !isFollowed && finalTargetId === streamer.hostId) {
                    onFollowUser(streamerUserObject, streamer.id);
                }
                
                if (liveSession && finalTargetId === streamer.hostId) {
                    const coinsAdded = (gift.price || 0) * quantity;
                    if(coinsAdded > 0) {
                        const currentCoins = Number(liveSession.coins) || 0;
                        updateLiveSession({ coins: currentCoins + coinsAdded });
                    }
                }
                
                const wasNotFan = !currentUser.fanClub || currentUser.fanClub.streamerId !== streamer.hostId;
                const isNowFan = updatedSender.fanClub && updatedSender.fanClub.streamerId === streamer.hostId;
    
                if (wasNotFan && isNowFan) {
                    addToast(ToastType.Success, "Bem-vindo ao fã-clube!");
                    setIsFanClubModalOpen(true);
                }
    
                return updatedSender;
            } else {
                throw new Error("API retornou falha.");
            }
        } catch (error) {
            console.error("Falha ao enviar presente:", error);
            addToast(ToastType.Error, (error as Error).message || "Falha ao enviar o presente.");
            api.users.me().then(user => {
                if (user) updateUser(user);
            });
            return null;
        }
    };
    
    const handleRecharge = () => {
        setGiftModalOpen(false);
        onOpenWallet('Diamante');
    };

    const handleCloseUserActions = () => {
        setUserActionModalState({ isOpen: false, user: null });
    };
    const handleKickUser = (user: User) => {
        api.kickUser(streamer.id, user.id);
        addToast(ToastType.Info, `Usuário ${user.name} foi expulso.`);
    };
    const handleMakeModerator = (user: User) => {
        api.makeModerator(streamer.id, user.id);
        addToast(ToastType.Success, `${user.name} agora é um moderador.`);
    };
    const handleMentionUser = (user: User) => {
        setChatInput(prev => `${prev}@${user.name} `);
    };

    const handleToggleMicrophone = async () => {
        const newState = !liveSession?.isMicrophoneMuted;
        try {
            await api.toggleMicrophone();
            updateLiveSession({ isMicrophoneMuted: newState });
        } catch (error) {
            console.error("Failed to toggle microphone:", error);
        }
    };

    const handleToggleSound = async () => {
        const newState = !liveSession?.isStreamMuted;
        try {
            await api.toggleStreamSound();
            updateLiveSession({ isStreamMuted: newState });
        } catch (error) {
            console.error("Failed to toggle sound:", error);
        }
    };

    const handleToggleAutoFollow = async () => {
        const newState = !liveSession?.isAutoFollowEnabled;
        try {
            await api.toggleAutoFollow();
            updateLiveSession({ isAutoFollowEnabled: newState });
        } catch (error) {
            console.error("Failed to toggle auto follow:", error);
        }
    };

    const handleToggleAutoPrivateInvite = async () => {
        const newState = !isAutoPrivateInviteEnabled;
        try {
            await api.toggleAutoPrivateInvite();
            setIsAutoPrivateInviteEnabled(newState);
            if (liveSession) {
                updateLiveSession({ isAutoPrivateInviteEnabled: newState });
            }
        } catch (error) {
            console.error("Failed to toggle auto private invite:", error);
        }
    };

    const topContributors = onlineUsers.filter(u => (u.value || 0) > 0).slice(0, 3);
    
    const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setChatInput(value);

        const lastWord = value.split(' ').pop() || '';
        if (lastWord.startsWith('@')) {
            const query = lastWord.substring(1).toLowerCase();
            setMentionQuery(query);
            setShowMentionSuggestions(true);
        } else {
            setShowMentionSuggestions(false);
            setMentionQuery('');
        }
    };

    const handleMentionSelect = (username: string) => {
        const words = chatInput.split(' ');
        words.pop();
        words.push(`@${username} `);
        const newChatInput = words.join(' ');
        
        setChatInput(newChatInput);
        setShowMentionSuggestions(false);
        setMentionQuery('');
        
        chatInputRef.current?.focus();
    };

    const mentionSuggestions = useMemo(() => {
        if (!showMentionSuggestions || !mentionQuery) return [];
        return onlineUsers.filter(u => 
            u.name.toLowerCase().includes(mentionQuery) && u.id !== currentUser.id
        ).slice(0, 5);
    }, [mentionQuery, onlineUsers, currentUser.id, showMentionSuggestions]);
    
    const handleBlockAndCloseChat = async (userToBlock: User) => {
        try {
            const result = await api.users.blockUser(userToBlock.id);
            if (result.success) {
                addToast(ToastType.Success, `${userToBlock.name} foi bloqueado com sucesso.`);
                setIsPrivateChatOpen(false);
            }
        } catch (e: any) {
            addToast(ToastType.Error, e.message || `Falha ao bloquear ${userToBlock.name}.`);
        }
    };

    return (
        <div className="absolute inset-0 bg-gray-900 text-white font-sans z-10"
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseUp={(e) => handlePointerUp(e.clientX, e.clientY)}
            onTouchStart={(e) => handlePointerDown(e.targetTouches[0].clientX, e.targetTouches[0].clientY)}
            onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
        >
            {isBroadcaster ? (
                 <img src={streamerDisplayUser.coverUrl} key={streamerDisplayUser.coverUrl} className="absolute inset-0 w-full h-full object-cover" alt="Stream background" />
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover bg-black" />
                    {isConnecting && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-4">
                            <LoadingSpinner />
                            <span className="text-sm font-bold text-white/80">Conectando à transmissão...</span>
                        </div>
                    )}
                </>
            )}

            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/70 pointer-events-none transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className="absolute inset-0 z-[200] pointer-events-none flex items-center justify-center">
                {currentGiftAnimation && (
                    <GiftAnimationOverlay
                        giftPayload={currentGiftAnimation}
                        onAnimationEnd={handleGiftAnimationEnd}
                    />
                )}
            </div>

            <header className={`p-3 bg-transparent absolute top-0 left-0 right-0 z-20 transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                        <div className="flex flex-col space-y-2">
                             <div className={`w-fit relative overflow-hidden flex items-center ${isJuFeFanClub ? 'bg-pink-600/90 rounded-2xl' : 'bg-black/40 rounded-full'} p-1 pr-2 space-x-2`}>
                                <button onClick={(e) => { e.stopPropagation(); onViewProfile(streamerDisplayUser); }} className="flex items-center space-x-2 text-left">
                                    <div className="relative">
                                        <div className="relative mb-3 pointer-events-auto">
                                            <img 
                                                src={streamerDisplayUser.avatarUrl || '/default-avatar.png'} 
                                                className="w-[50px] h-[50px] rounded-full border-2 border-white object-cover" 
                                                alt={streamerDisplayUser.name || 'User'} 
                                            />
                                            {streamerDisplayUser && (
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] w-5 h-5 rounded-full flex items-center justify-center">
                                                    <PlusIcon className="w-3 h-3 text-white" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        {ActiveFrameComponent && (
                                            <div className="absolute inset-0 w-full h-full pointer-events-none">
                                                <ActiveFrameComponent className={`w-full h-full ${frameGlowClass}`} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm leading-tight">{streamerDisplayUser.name}</span>
                                        <div className="flex items-center space-x-1 text-gray-300 text-xs">
                                            <ViewerIcon className="w-4 h-4" />
                                            <span>{liveSession ? liveSession.viewers.toLocaleString() : streamer.viewers.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </button>
                                {!isFollowed && !isBroadcaster && <button onClick={handleFollowStreamer} className="bg-pink-500 text-white rounded-full w-7 h-7 flex items-center justify-center"><PlusIcon className="w-4 h-4" /></button>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                         <div className="flex -space-x-2 items-center" onClick={handleViewOnlineUsers}>
                            {topContributors.map((user, i) => (
                                <RankedAvatar key={user.id} user={user} rank={i + 1} onClick={onViewProfile} />
                            ))}
                        </div>
                        <button onClick={isBroadcaster ? onRequestEndStream : onLeaveStreamView} className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center shrink-0">
                            <CloseIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </header>
            
            <div className={`absolute top-28 left-3 flex flex-col gap-2 transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={() => setIsRankingOpen(true)} className="bg-black/40 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-white">
                    <TrophyIcon className="w-3 h-3 text-yellow-400" />
                    <span className="font-bold">{liveSession?.coins || 0}</span>
                </button>
                {isBroadcaster && (
                    <button onClick={() => isFanClubMember ? onOpenFanClubMembers(streamerUserObject) : setIsJoinFanClubModalOpen(true)} className="bg-black/40 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-white">
                        <FanClubHeaderIcon className="w-3 h-3 text-pink-400" />
                        <span className="font-bold">Fãs</span>
                    </button>
                )}
            </div>

            <main className={`flex-1 flex flex-col justify-end mt-auto transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div ref={chatContainerRef} className="max-h-[33vh] overflow-y-auto no-scrollbar flex flex-col-reverse px-3 pb-3">
                    <div className="space-y-2">
                        {messages.map((msg) => {
                            switch(msg.type) {
                                case 'entry': return <EntryChatMessage key={msg.id} user={msg.fullUser!} onClick={onViewProfile} />;
                                case 'fan_entry': return <FanClubEntryMessage key={msg.id} user={msg.fullUser!} />;
                                case 'follow': return <FollowChatMessage key={msg.id} follower={msg.user!} followed={msg.followedUser!} />;
                                case 'friend_request': return <FriendRequestNotification key={msg.id} followerName={msg.follower!.name} onClick={() => onOpenFriendRequests()} />;
                                case 'chat': 
                                    const user = constructUserFromMessage(msg);
                                    return (
                                        <ChatMessage 
                                            key={msg.id}
                                            userObject={user} 
                                            message={msg.message || ''} 
                                            onAvatarClick={() => setUserActionModalState({ isOpen: true, user })}
                                            streamerId={streamer.hostId}
                                            timestamp={msg.timestamp}
                                        />
                                    );
                                default: return null;
                            }
                        })}
                    </div>
                </div>

                <footer className="p-3">
                    <div className="flex items-center space-x-2">
                        <div className="flex-grow bg-black/40 rounded-full flex items-center pr-1.5 relative">
                             {showMentionSuggestions && mentionSuggestions.length > 0 && (
                                <UserMentionSuggestions users={mentionSuggestions} onSelect={handleMentionSelect} />
                            )}
                            <input
                                ref={chatInputRef}
                                type="text"
                                className="bg-transparent flex-grow pl-4 pr-2 py-2.5 text-sm text-white placeholder-gray-400 outline-none"
                                placeholder={t('streamRoom.sayHi')}
                                value={chatInput}
                                onChange={handleChatInputChange}
                                onFocus={() => setIsChatInputFocused(true)}
                                onBlur={() => setTimeout(() => setIsChatInputFocused(false), 200)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(e); }}
                            />
                            <button onClick={(e) => { e.stopPropagation(); handleSendMessage(e); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"><SendIcon className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => setGiftModalOpen(true)} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shadow-lg"><GiftIcon className="w-6 h-6 text-yellow-400" /></button>
                        {isBroadcaster && <button onClick={() => setIsToolsOpen(true)} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shadow-lg"><MoreIcon className="w-6 h-6 text-white" /></button>}
                    </div>
                </footer>
            </main>

            {/* Modals */}
            <GiftModal 
                isOpen={isGiftModalOpen}
                onClose={() => setGiftModalOpen(false)}
                currentUser={currentUser}
                onSendGift={handleSendGift}
                onRecharge={handleRecharge}
                onOpenVIPCenter={onOpenVIPCenter}
                hostUser={streamerUserObject}
                onlineUsers={onlineUsers}
                onOpenSettings={() => {}}
            />
            {isToolsOpen && (
                <ToolsModal
                    isOpen={isToolsOpen}
                    onClose={() => setIsToolsOpen(false)}
                    onOpenBeautyPanel={handleOpenBeautyPanel}
                    onOpenCoHostModal={handleOpenCoHostModal}
                    isMicrophoneMuted={liveSession?.isMicrophoneMuted || false}
                    onToggleMicrophone={handleToggleMicrophone}
                    isSoundMuted={liveSession?.isStreamMuted || false}
                    onToggleSound={handleToggleSound}
                    onOpenClarityPanel={handleOpenClarityPanel}
                    isPKBattleActive={false}
                    onStartPK={(e: React.MouseEvent) => {
                        handleOpenCoHostModal(e);
                    }}
                    onToggleModeration={() => setIsModerationMode(p => !p)}
                    isModerationActive={isModerationMode}
                    onOpenPrivateInviteModal={() => { setIsToolsOpen(false); onOpenPrivateInviteModal(); }}
                    onToggleAutoFollow={handleToggleAutoFollow}
                    isAutoFollowEnabled={liveSession?.isAutoFollowEnabled || false}
                    onToggleAutoPrivateInvite={handleToggleAutoPrivateInvite}
                    isAutoPrivateInviteEnabled={isAutoPrivateInviteEnabled}
                    onOpenPrivateChat={onOpenPrivateChat}
                    onOpenRanking={() => setIsRankingOpen(true)}
                />
            )}
            {isOnlineUsersOpen && (
                 <OnlineUsersModal 
                    onClose={() => setOnlineUsersOpen(false)} 
                    users={onlineUsers}
                    streamId={streamer.id}
                    currentUser={currentUser}
                    onFollow={onFollowUser}
                />
            )}
            {isCoHostModalOpen && (
                <CoHostModal
                    isOpen={isCoHostModalOpen}
                    onClose={() => setIsCoHostModalOpen(false)}
                    onInvite={handleInvite}
                    onOpenTimerSettings={onOpenPKTimerSettings}
                    currentUser={currentUser}
                    addToast={addToast}
                    streamId={streamer.id}
                />
            )}
            {isResolutionPanelOpen && (
                <ResolutionPanel 
                    isOpen={isResolutionPanelOpen}
                    onClose={() => setResolutionPanelOpen(false)}
                    onSelectResolution={handleSelectResolution}
                    currentResolution={currentResolution}
                />
            )}
            {isBeautyPanelOpen && (
                <BeautyEffectsPanel 
                    onClose={() => setBeautyPanelOpen(false)} 
                    addToast={addToast}
                />
            )}
            {isRankingOpen && (
                 <ContributionRankingModal
                    onClose={() => setIsRankingOpen(false)}
                    liveRanking={onlineUsers}
                />
            )}
            {userActionModalState.isOpen && (
                <UserActionModal 
                    {...userActionModalState}
                    onClose={handleCloseUserActions}
                    onKick={handleKickUser}
                    onMakeModerator={handleMakeModerator}
                    onMention={handleMentionUser}
                    onViewProfile={onViewProfile}
                />
            )}
            <FanClubModal 
                isOpen={isFanClubModalOpen} 
                onClose={() => setIsFanClubModalOpen(false)}
                streamer={streamerUserObject}
                isMember={isFanClubMember}
                currentUser={currentUser}
                onConfirmJoin={() => {
                    setIsFanClubModalOpen(false);
                    setIsJoinFanClubModalOpen(true);
                }}
                onOpenMembers={onOpenFanClubMembers}
            />
            <JoinFanClubModal 
                isOpen={isJoinFanClubModalOpen}
                onClose={() => setIsJoinFanClubModalOpen(false)}
                onConfirm={() => {
                    setIsJoinFanClubModalOpen(false);
                    const fanClubGift = allGifts.find(g => g.name === 'Fã Clube');
                    if (fanClubGift) {
                        handleSendGift(fanClubGift, 1);
                    }
                }}
            />
            {isPrivateChatOpen && (
                <PrivateChatScreen 
                    user={streamerUserObject} 
                    onClose={() => setIsPrivateChatOpen(false)} 
                    variant="modal"
                    onBlock={handleBlockAndCloseChat}
                    addToast={addToast}
                />
            )}
            {luckyGiftPayload && (
                 <LuckyGiftModal
                    isOpen={isLuckyGiftModalOpen}
                    onClose={() => {
                        setIsLuckyGiftModalOpen(false);
                        setLuckyGiftPayload(null);
                    }}
                    giftPayload={luckyGiftPayload}
                />
            )}
        </div>
    );
};