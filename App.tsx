
import React, { useState, useCallback, useEffect, useRef } from 'react';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import MessagesScreen from './components/screens/MessagesScreen';
import FooterNav from './components/FooterNav';
import ReminderModal from './components/ReminderModal';
import HistoryModal from './components/HistoryModal';
import RegionModal from './components/RegionModal';
import GoLiveScreen from './components/GoLiveScreen';
import { ToastType, ToastData, Streamer, User, StreamSummaryData, LiveSessionState } from './types';
import Toast from './components/Toast';
import UserProfileScreen from './components/screens/UserProfileDetailScreen';
import WalletScreen from './components/WalletScreen';
import AdminWalletScreen from './components/AdminWalletScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import SearchScreen from './components/SearchScreen';
import VideoScreen from './components/screens/VideoScreen';
import LanguageSelectionModal from './components/LanguageSelectionModal';
import { api, storage, fetcher } from './services/api';
import { LoadingSpinner } from './components/Loading';
import { webSocketManager } from './services/websocket';
import { LanguageProvider } from './i18n';
import EndStreamConfirmationModal from './components/EndStreamConfirmationModal';
import EndStreamSummaryScreen from './components/EndStreamSummaryScreen';
import RelationshipScreen from './components/screens/RelationshipScreen';
import { LevelScreen, TopFansScreen, BlockListScreen } from './components/screens/ProfileSubScreens';
import MarketScreen from './components/screens/MarketScreen';
import FanClubMembersScreen from './components/screens/FanClubMembersScreen';
import { StreamRoom } from './components/StreamRoom';
import { PKBattleScreen } from './components/PKBattleScreen';
import PrivateInviteModal from './components/live/PrivateInviteModal';
import EditProfileScreen from './components/EditProfileScreen';
import DatabaseScreen from './components/DatabaseScreen';
import AppIntegrityTesterScreen from './components/screens/AppIntegrityTesterScreen';
import FullApiCheckupScreen from './components/screens/FullApiCheckupScreen';
import PaymentFeedbackScreen from './components/screens/PaymentFeedbackScreen';


// Contador global para garantir IDs únicos nos toasts
let toastCounter = 0;

const AppContent: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
    const [activeScreen, setActiveScreen] = useState<'main' | 'profile' | 'messages' | 'video'>('main');
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [liveSession, setLiveSession] = useState<LiveSessionState | null>(null);
    const tapCount = useRef(0);
    const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [chatTargetUser, setChatTargetUser] = useState<User | null>(null);
    const [showPaymentFeedback, setShowPaymentFeedback] = useState(false);
    
    const [visitors, setVisitors] = useState<User[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = `toast-${Date.now()}-${toastCounter++}`;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    useEffect(() => {
        if (window.location.pathname === '/payment-feedback') {
            setShowPaymentFeedback(true);
        }

        const checkAuth = async () => {
            const savedUser = storage.getUser();
            const token = storage.getToken();

            if (savedUser && token) {
                try {
                    // Carrega os dados do usuário
                    const freshUser = await api.users.me();
                    setCurrentUser(freshUser);
                    setIsAuthenticated(true);
                    
                    // Conecta ao WebSocket
                    webSocketManager.connect(freshUser.id);
                    
                    // Carrega todos os dados necessários em paralelo
                    try {
                        // Atualiza status online
                        await fetcher('POST', '/api/sim/status', { isOnline: true });
                        
                        // Obtém os dados iniciais em paralelo
                        const [
                            userData,
                            messages,
                            regions,
                            gifts,
                            streamHistory,
                            purchaseHistory,
                            followingUsers,
                            fans,
                            reminders,
                            notificationSettings,
                            pkConfig,
                            dailyRanking,
                            weeklyRanking,
                            monthlyRanking,
                            popularStreams
                        ] = await Promise.all([
                            // Dados do usuário
                            api.users.me(),
                            api.getMessages(freshUser.id),
                            api.regions.list(),
                            api.gifts.list(),
                            api.getStreamHistory(),
                            api.purchases.getHistory(freshUser.id),
                            api.users.getFollowingUsers(freshUser.id),
                            api.users.getFansUsers(freshUser.id),
                            api.getReminders(),
                            api.notifications.getSettings(freshUser.id),
                            api.pk.getConfig(),
                            
                            // Rankings
                            api.getDailyRanking(),
                            api.getWeeklyRanking(),
                            api.getMonthlyRanking(),
                            
                            // Streams populares
                            api.streams.listByCategory('popular', '')
                        ]);
                        
                        // Atualiza o estado com os dados obtidos
                        setCurrentUser(userData);
                        setVisitors(await api.getVisitors(freshUser.id));
                        
                        console.log('Todas as chamadas de API iniciais foram concluídas com sucesso!');
                    } catch (error) {
                        console.error('Erro ao carregar dados iniciais:', error);
                        addToast(ToastType.Error, 'Alguns dados podem estar incompletos. Por favor, tente novamente.');
                    }
                    
                } catch (e) {
                    console.error("Erro ao carregar dados iniciais:", e);
                    storage.clear();
                }
            }
            setIsLoadingInitial(false);
        };
        checkAuth();
    }, []);

    const [activeStream, setActiveStream] = useState<Streamer | null>(null);
    const [pkOpponent, setPkOpponent] = useState<User | null>(null);
    const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
    
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [isPrivateInviteModalOpen, setIsPrivateInviteModalOpen] = useState(false);

    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [walletTab, setWalletTab] = useState<'Diamante' | 'Ganhos'>('Diamante');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsInitialView, setSettingsInitialView] = useState('root');
    const [isMarketOpen, setIsMarketOpen] = useState(false);
    const [isLevelOpen, setIsLevelOpen] = useState(false);
    const [isAdminWalletOpen, setIsAdminWalletOpen] = useState(false);
    const [isBlockListOpen, setIsBlockListOpen] = useState(false);
    const [isTopFansOpen, setIsTopFansOpen] = useState(false);
    const [isFanClubMembersOpen, setIsFanClubMembersOpen] = useState(false);
    const [isZoomSettingsOpen, setIsZoomSettingsOpen] = useState(false);
    const [isDatabaseMonitorOpen, setIsDatabaseMonitorOpen] = useState(false);
    const [isIntegrityTesterOpen, setIsIntegrityTesterOpen] = useState(false);
    const [isFullApiCheckupOpen, setIsFullApiCheckupOpen] = useState(false);
    
    const [relTab, setRelTab] = useState<'following' | 'fans' | 'visitors'>('following');
    const [isRelOpen, setIsRelOpen] = useState(false);
    
    const [profileToView, setProfileToView] = useState<User | null>(null);

    const [isEndConfirmationOpen, setIsEndConfirmationOpen] = useState(false);
    const [showStreamSummary, setShowStreamSummary] = useState(false);
    const [lastSummary, setLastSummary] = useState<StreamSummaryData | null>(null);

    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [isLoadingStreams, setIsLoadingStreams] = useState(false);
    
    // Efeito para gerenciar eventos do WebSocket
    useEffect(() => {
        if (!isAuthenticated) return;
        
        // Atualiza a lista de streamers quando uma nova transmissão é iniciada
        const handleStreamStarted = (newStream: Streamer) => {
            console.log('[WebSocket] Nova transmissão iniciada:', newStream);
            setStreamers(prevStreamers => {
                // Verifica se o stream já existe na lista
                const exists = prevStreamers.some(s => s.id === newStream.id);
                if (exists) {
                    // Atualiza o stream existente
                    return prevStreamers.map(s => 
                        s.id === newStream.id ? { ...s, ...newStream, isLive: true } : s
                    );
                } else {
                    // Adiciona o novo stream à lista
                    return [...prevStreamers, { ...newStream, isLive: true }];
                }
            });
        };
        
        // Remove o stream da lista quando uma transmissão é encerrada
        const handleStreamEnded = (data: { streamId: string }) => {
            console.log('[WebSocket] Transmissão encerrada:', data.streamId);
            setStreamers(prevStreamers => 
                prevStreamers.filter(s => s.id !== data.streamId)
            );
        };
        
        // Registra os listeners
        webSocketManager.on('stream:started', handleStreamStarted);
        webSocketManager.on('stream:ended', handleStreamEnded);
        
        // Limpeza dos listeners
        return () => {
            webSocketManager.off('stream:started', handleStreamStarted);
            webSocketManager.off('stream:ended', handleStreamEnded);
        };
    }, [isAuthenticated]);
    const [activeTab, setActiveTab] = useState('popular');
    const [selectedRegion, setSelectedRegion] = useState('global');
    const [followingUsers, setFollowingUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;
        const fetchStreams = async () => {
            setIsLoadingStreams(true);
            try {
                let list: Streamer[] = [];
                if (activeTab === 'amigos') {
                    const friends: User[] = await api.users.getFriends(currentUser.id);
                    const friendIds = friends.map(f => f.id);
                    const allStreamsResult: any = await api.streams.listByCategory('popular', selectedRegion);
                    const allStreams: Streamer[] = Array.isArray(allStreamsResult) ? allStreamsResult : (allStreamsResult?.data || []);
                    list = allStreams.filter(stream => friendIds.includes(stream.hostId));
                } else {
                    const result: any = await api.streams.listByCategory(activeTab, selectedRegion);
                    list = Array.isArray(result) ? result : (result?.data || []);
                }
                setStreamers(list);
            } catch (err) {
                console.error("[MainScreen] Falha ao carregar lives:", err);
                setStreamers([]);
            } finally {
                setIsLoadingStreams(false);
            }
        };
        fetchStreams();
    }, [activeTab, selectedRegion, isAuthenticated, currentUser]);

    const updateCurrentUser = (user: User) => {
        setCurrentUser(user);
        storage.setUser(user);
    };

    const handleLogin = (data: { user: User; token: string }) => {
        storage.setUser(data.user);
        storage.setToken(data.token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        webSocketManager.connect(data.user.id);
    };

    const handleLogout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.warn("Logout API call failed, proceeding with client-side logout.", error);
        } finally {
            storage.clear();
            setIsAuthenticated(false);
            setCurrentUser(null);
            webSocketManager.disconnect();
        }
    };
    
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSelectStream = async (streamer: Streamer) => {
        if (activeStream?.id === streamer.id) return;
        setActiveStream(streamer);

        try {
            const sessionData = await api.streams.getSession(streamer.id);
            setLiveSession(sessionData);
        } catch (error) {
            console.error("Failed to fetch stream session:", error);
            addToast(ToastType.Error, "Não foi possível carregar a sessão da live.");
            // Fallback to a default/empty session state
            setLiveSession({
                viewers: streamer.viewers || 0,
                peakViewers: streamer.viewers || 0,
                coins: 0,
                followers: 0,
                members: 0,
                fans: 0,
                events: [],
                isMicrophoneMuted: false,
                isStreamMuted: false,
                isAutoFollowEnabled: false,
                isAutoPrivateInviteEnabled: false,
                startTime: Date.now()
            });
        }
    };

    const handleLeaveStream = () => {
        setActiveStream(null);
        setLiveSession(null);
    };
    
    const handleStartStream = (streamData: Partial<Streamer>) => {
        // Usa os dados da transmissão fornecidos, que já foram criados no backend
        const newStreamer: Streamer = {
            id: streamData.id || `live_${Date.now()}`,
            hostId: currentUser!.id,
            name: streamData.name || `Live de ${currentUser!.name}`,
            avatar: streamData.avatar || currentUser!.avatarUrl,
            location: streamData.location || currentUser!.location || 'Brasil',
            viewers: 1,
            tags: [],
            category: streamData.category || 'Geral',
            isPrivate: streamData.isPrivate || false,
            streamUrl: streamData.streamUrl,
            thumbnail: streamData.thumbnail || currentUser!.avatarUrl,
            description: streamData.description || `Live de ${currentUser!.name}`,
            isLive: true
        };
        
        console.log('[App] Iniciando transmissão:', newStreamer);
        setActiveStream(newStreamer);
        setIsGoLiveOpen(false);

        // Inicializa sessão de live para Broadcaster (Zerada)
        setLiveSession({
            viewers: 1,
            peakViewers: 1,
            coins: 0,
            followers: 0,
            members: 0,
            fans: 0,
            events: [],
            isMicrophoneMuted: false,
            isStreamMuted: false,
            isAutoFollowEnabled: false,
            isAutoPrivateInviteEnabled: false,
            startTime: Date.now()
        });
        
        // Notifica outros clientes sobre a nova transmissão
        webSocketManager.emit('stream:started', newStreamer);
    };
    
    const handleEndStream = () => {
        setIsEndConfirmationOpen(false);
        
        webSocketManager.stopStreaming();

        if (activeStream) {
            webSocketManager.emit('stream:ended', { streamId: activeStream.id });
        }

        const isBroadcaster = activeStream?.hostId === currentUser?.id;
        if (activeStream && isBroadcaster) {
            api.streams.deleteById(activeStream.id).then((res: any) => {
                 addToast(ToastType.Info, res.message || "Stream encerrada no servidor.");
            }).catch(err => {
                console.error("Failed to delete stream:", err);
                addToast(ToastType.Error, "Falha ao encerrar a stream no servidor.");
            });
        }

        setActiveStream(null);
        if (liveSession) {
            const duration = (Date.now() - liveSession.startTime) / 1000;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const summary = {
                viewers: liveSession.peakViewers,
                duration: `${minutes}m ${seconds}s`,
                coins: liveSession.coins,
                followers: liveSession.followers,
                members: liveSession.members,
                fans: liveSession.fans
            };
            setLastSummary(summary);
            setShowStreamSummary(true);
        }
        setLiveSession(null);
    };
    
    const handleViewProfile = (userToView: User) => {
        setProfileToView(userToView);
    };
    
    const handleOpenRelationship = (tab: 'following' | 'fans' | 'visitors') => {
        setRelTab(tab);
        setIsRelOpen(true);
    };
    
    const handleStartPK = (opponent: User) => {
        setPkOpponent(opponent);
    };

    const handleSecretTap = () => {
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
        tapCount.current += 1;
        if (tapCount.current >= 5) {
            // Secret action removed
            tapCount.current = 0;
        }
        tapTimeout.current = setTimeout(() => {
            tapCount.current = 0;
        }, 1000);
    };
    
    const handleStartChatWith = (user: User) => {
        if (profileToView) setProfileToView(null);
        if (activeStream) handleLeaveStream();
        setChatTargetUser(user);
        setActiveScreen('messages');
    };

    const handleOpenSettings = (initialView = 'root') => {
        setSettingsInitialView(initialView);
        setIsSettingsOpen(true);
    };

    const handleFollowUser = (userToFollow: User, streamId?: string) => {
        if (!currentUser) return;
        const isAlreadyFollowing = followingUsers.some(u => u.id === userToFollow.id);
        if (!isAlreadyFollowing) {
            setFollowingUsers(prev => [...prev, userToFollow]);
            addToast(ToastType.Success, `Você começou a seguir ${userToFollow.name}!`);
        }
        api.users.toggleFollow(userToFollow.id).catch(() => {
             setFollowingUsers(prev => prev.filter(u => u.id !== userToFollow.id));
        });
    };

    const updateLiveSessionState = (updates: Partial<LiveSessionState>) => {
        setLiveSession(prev => prev ? { ...prev, ...updates } : null);
    };

    const handleRegionSelect = (region: string) => {
        setSelectedRegion(region);
        addToast(ToastType.Info, `Região alterada para ${region.toUpperCase()}.`);
    };

    const handleOpenPrivateChat = () => {
        if (activeStream && currentUser) {
            const isBroadcaster = activeStream.hostId === currentUser.id;
            if (isBroadcaster) {
                handleLeaveStream();
                setActiveScreen('messages');
            } else {
                const streamerUserObject: User = {
                    id: activeStream.hostId, identification: activeStream.hostId,
                    name: activeStream.name, avatarUrl: activeStream.avatar,
                    coverUrl: `https://picsum.photos/seed/${activeStream.id}/800/1600`,
                    country: activeStream.country || 'br', age: 23, gender: 'female',
                    level: 1, xp: 0, location: activeStream.location, fans: 0, following: 0,
                    receptores: 0, enviados: 0, isLive: true, diamonds: 0, earnings: 0, earnings_withdrawn: 0
                };
                handleStartChatWith(streamerUserObject);
            }
        } else {
            setActiveScreen('messages');
        }
    };
    
    const handleClosePaymentFeedback = () => {
        setShowPaymentFeedback(false);
        window.history.pushState({}, document.title, window.location.pathname.split('?')[0].replace('/payment-feedback', '/'));
        api.users.me().then(updateCurrentUser); // Re-fetch user to update diamond balance
    };

    if (isLoadingInitial) {
        return <div className="h-screen w-screen flex items-center justify-center bg-black"><LoadingSpinner /></div>;
    }

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden select-none">
          <div className="absolute top-0 left-0 right-0 z-[200] flex flex-col items-center pt-4 pointer-events-none">
                {toasts.map(t => (
                    <Toast key={t.id} data={t} onClose={() => {}} />
                ))}
          </div>

          {showPaymentFeedback && <PaymentFeedbackScreen onClose={handleClosePaymentFeedback} />}
    
          {isWalletOpen && currentUser && <WalletScreen onClose={() => setIsWalletOpen(false)} initialTab={walletTab} currentUser={currentUser} updateUser={updateCurrentUser} addToast={addToast} />}
          {isAdminWalletOpen && currentUser && <AdminWalletScreen onClose={() => setIsAdminWalletOpen(false)} user={currentUser} addToast={addToast} />}
          {isSettingsOpen && currentUser && (
            <SettingsScreen 
                currentUser={currentUser}
                onClose={() => setIsSettingsOpen(false)}
                onLogout={handleLogout}
                onOpenBlockList={() => setIsBlockListOpen(true)}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                onOpenWallet={(tab) => { setIsWalletOpen(true); setWalletTab(tab || 'Diamante'); }}
                initialView={settingsInitialView}
                updateUser={updateCurrentUser}
                addToast={addToast}
                onOpenZoomSettings={() => {}}
            />
          )}
          {isDatabaseMonitorOpen && <DatabaseScreen onClose={() => setIsDatabaseMonitorOpen(false)} addToast={addToast} />}
          {isIntegrityTesterOpen && <AppIntegrityTesterScreen onClose={() => setIsIntegrityTesterOpen(false)} />}
          {isFullApiCheckupOpen && <FullApiCheckupScreen onClose={() => setIsFullApiCheckupOpen(false)} />}

          {isMarketOpen && currentUser && <MarketScreen onClose={() => setIsMarketOpen(false)} user={currentUser} updateUser={updateCurrentUser} onOpenWallet={(tab) => {setIsWalletOpen(true); setWalletTab(tab)}} addToast={addToast} />}
          {isLevelOpen && currentUser && <LevelScreen onClose={() => setIsLevelOpen(false)} currentUser={currentUser} />}
          {isBlockListOpen && <BlockListScreen onClose={() => setIsBlockListOpen(false)} />}
          {isTopFansOpen && <TopFansScreen onClose={() => setIsTopFansOpen(false)} />}
          {isFanClubMembersOpen && profileToView && <FanClubMembersScreen streamer={profileToView} onClose={() => setIsFanClubMembersOpen(false)} onViewProfile={handleViewProfile} />}

          {isRelOpen && currentUser && <RelationshipScreen initialTab={relTab} onClose={() => setIsRelOpen(false)} currentUser={currentUser} onViewProfile={handleViewProfile} />}

          {showStreamSummary && lastSummary && currentUser && (
              <EndStreamSummaryScreen 
                  currentUser={currentUser}
                  summaryData={lastSummary} 
                  onClose={() => setShowStreamSummary(false)} 
              />
          )}

          {isLanguageModalOpen && <LanguageSelectionModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />}
        
          <div className={`w-full h-full transition-all duration-300 ${activeStream ? 'blur-sm scale-95' : ''}`}>
             {activeScreen === 'main' && (
                <MainScreen
                    onOpenReminderModal={() => setIsReminderOpen(true)}
                    onOpenRegionModal={() => setIsRegionOpen(true)}
                    onSelectStream={handleSelectStream}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    streamers={streamers}
                    isLoading={isLoadingStreams}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    showLocationBanner={!currentUser?.location}
                />
             )}
            {activeScreen === 'profile' && currentUser && (
                <ProfileScreen
                    currentUser={currentUser}
                    onOpenUserDetail={() => setProfileToView(currentUser)}
                    onOpenWallet={(tab) => { setIsWalletOpen(true); setWalletTab(tab || 'Diamante'); }}
                    onOpenFollowing={() => handleOpenRelationship('following')}
                    onOpenFans={() => handleOpenRelationship('fans')}
                    onOpenVisitors={() => handleOpenRelationship('visitors')}
                    onNavigateToMessages={() => setActiveScreen('messages')}
                    onOpenMarket={() => setIsMarketOpen(true)}
                    onOpenMyLevel={() => setIsLevelOpen(true)}
                    onOpenBlockList={() => setIsBlockListOpen(true)}
                    onOpenFAQ={() => { /* Placeholder */ }}
                    onOpenSettings={() => handleOpenSettings()}
                    onOpenSupportChat={() => { /* Placeholder */ }}
                    onOpenAdminWallet={() => setIsAdminWalletOpen(true)}
                    onOpenApiTracker={() => {}}
                    onOpenHealthMonitor={() => {}}
                    onOpenDatabaseMonitor={() => setIsDatabaseMonitorOpen(true)}
                    onOpenIntegrityTester={() => setIsIntegrityTesterOpen(true)}
                    onOpenFullApiCheckup={() => setIsFullApiCheckupOpen(true)}
                    visitors={visitors}
                />
            )}
            {activeScreen === 'messages' && <MessagesScreen addToast={addToast} initialChatUser={chatTargetUser} onChatOpened={() => setChatTargetUser(null)} />}
            {activeScreen === 'video' && currentUser && <VideoScreen addToast={addToast} currentUser={currentUser} />}

            <FooterNav 
                currentUser={currentUser} 
                onOpenGoLive={() => setIsGoLiveOpen(true)}
                activeTab={activeScreen}
                onNavigate={setActiveScreen}
                onSecretTap={handleSecretTap}
            />
          </div>

          {profileToView && currentUser && (
              <UserProfileScreen
                  userToView={profileToView}
                  loggedInUser={currentUser}
                  onClose={() => setProfileToView(null)}
                  onUpdateUser={(updated) => { if (updated.id === currentUser.id) updateCurrentUser(updated); setProfileToView(updated); }}
                  onOpenFans={() => { setProfileToView(null); handleOpenRelationship('fans'); }}
                  onOpenFollowing={() => { setProfileToView(null); handleOpenRelationship('following'); }}
                  onOpenTopFans={() => { setProfileToView(null); setIsTopFansOpen(true); }}
                  onChat={() => profileToView && handleStartChatWith(profileToView)}
                  onFollow={() => handleFollowUser(profileToView)}
                  addToast={addToast}
              />
          )}

          {activeStream && currentUser && (
             pkOpponent ? (
                <PKBattleScreen 
                    streamer={activeStream}
                    opponent={pkOpponent}
                    onEndPKBattle={() => setPkOpponent(null)}
                    currentUser={currentUser}
                    updateUser={updateCurrentUser}
                    onRequestEndStream={() => setIsEndConfirmationOpen(true)}
                    onLeaveStreamView={handleLeaveStream}
                    onViewProfile={handleViewProfile}
                    onOpenWallet={(tab) => { setIsWalletOpen(true); setWalletTab(tab || 'Diamante'); }}
                    onFollowUser={handleFollowUser}
                    onOpenPrivateChat={handleOpenPrivateChat}
                    onOpenPrivateInviteModal={() => setIsPrivateInviteModalOpen(true)}
                    onOpenPKTimerSettings={() => {}}
                    onOpenFans={() => handleOpenRelationship('fans')}
                    onOpenFriendRequests={() => {}}
                    liveSession={liveSession}
                    updateLiveSession={updateLiveSessionState}
                    logLiveEvent={() => {}}
                    onStreamUpdate={(updates) => setActiveStream(prev => prev ? { ...prev, ...updates } : null)}
                    addToast={addToast}
                    setActiveScreen={setActiveScreen}
                    followingUsers={followingUsers}
                    pkBattleDuration={5}
                    streamers={streamers}
                    onSelectStream={handleSelectStream}
                    onOpenVIPCenter={() => setIsMarketOpen(true)}
                    onOpenFanClubMembers={(user) => {setProfileToView(user); setIsFanClubMembersOpen(true)}}
                    onOpenSettings={handleOpenSettings}
                />
             ) : (
                <StreamRoom 
                    streamer={activeStream}
                    currentUser={currentUser}
                    updateUser={updateCurrentUser}
                    onRequestEndStream={() => setIsEndConfirmationOpen(true)}
                    onLeaveStreamView={handleLeaveStream}
                    onStartPKBattle={handleStartPK}
                    onViewProfile={handleViewProfile}
                    onOpenWallet={(tab) => { setIsWalletOpen(true); setWalletTab(tab || 'Diamante'); }}
                    onFollowUser={handleFollowUser}
                    onOpenPrivateChat={handleOpenPrivateChat}
                    onOpenPrivateInviteModal={() => setIsPrivateInviteModalOpen(true)}
                    onOpenPKTimerSettings={() => {}}
                    onOpenFans={() => handleOpenRelationship('fans')}
                    onOpenFriendRequests={() => {}}
                    liveSession={liveSession}
                    updateLiveSession={updateLiveSessionState}
                    logLiveEvent={() => {}}
                    onStreamUpdate={(updates) => setActiveStream(prev => prev ? { ...prev, ...updates } : null)}
                    addToast={addToast}
                    setActiveScreen={setActiveScreen}
                    followingUsers={followingUsers}
                    streamers={streamers}
                    onSelectStream={handleSelectStream}
                    onOpenVIPCenter={() => setIsMarketOpen(true)}
                    onOpenFanClubMembers={(user) => {setProfileToView(user); setIsFanClubMembersOpen(true)}}
                    onOpenSettings={handleOpenSettings}
                />
             )
          )}
          
          <EndStreamConfirmationModal isOpen={isEndConfirmationOpen} onConfirm={handleEndStream} onCancel={() => setIsEndConfirmationOpen(false)} />
          {isGoLiveOpen && currentUser && <GoLiveScreen currentUser={currentUser} onClose={() => setIsGoLiveOpen(false)} onStartStream={handleStartStream} addToast={addToast} />}
          {isReminderOpen && <ReminderModal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} onOpenHistory={() => { setIsReminderOpen(false); setIsHistoryOpen(true); }} onSelectStream={handleSelectStream} />}
          {isHistoryOpen && <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} onSelectStream={handleSelectStream} />}
          {isRegionOpen && <RegionModal isOpen={isRegionOpen} onClose={() => setIsRegionOpen(false)} onSelectRegion={handleRegionSelect} />}
          {isSearchOpen && <SearchScreen onClose={() => setIsSearchOpen(false)} onUserSelected={(user) => { setIsSearchOpen(false); handleViewProfile(user); }} />}
          {isPrivateInviteModalOpen && activeStream && <PrivateInviteModal isOpen={isPrivateInviteModalOpen} onClose={() => setIsPrivateInviteModalOpen(false)} streamId={activeStream.id} hostId={activeStream.hostId} />}

        </div>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;
