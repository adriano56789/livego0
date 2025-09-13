import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import WalletScreen from './screens/WalletScreen';
import PurchaseHistoryScreen from './screens/PurchaseHistoryScreen';
import WithdrawMethodScreen from './screens/WithdrawMethodScreen';
import BottomNav from './components/BottomNav';
import LevelScreen from './screens/LevelScreen';
import TopFansScreen from './screens/TopFansScreen';
import AvatarProtectionScreen from './screens/AvatarProtectionScreen';
import ReportsScreen from './screens/ReportsScreen';
import BlockListScreen from './screens/BlockListScreen';
import SettingsScreen from './screens/SettingsScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import ConnectedAccountsScreen from './screens/ConnectedAccountsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import GiftNotificationSettingsScreen from './screens/GiftNotificationSettingsScreen';
import PrivateLiveSettingsScreen from './screens/PrivateLiveSettingsScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import EarningsInfoScreen from './screens/EarningsInfoScreen';
import PushSettingsScreen from './screens/PushSettingsScreen';
import AppVersionScreen from './screens/AppVersionScreen';
import WhoCanMessageScreen from './screens/WhoCanMessageScreen';
import BroadcasterProfileScreen, { ProfileUser } from './screens/BroadcasterProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import FollowingScreen from './screens/FollowingScreen';
import FansScreen from './screens/FansScreen';
import VisitorsScreen from './screens/VisitorsScreen';
import BroadcasterTopFansScreen from './screens/BroadcasterTopFansScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import SearchFriendsScreen from './screens/SearchFriendsScreen';
import GoLiveScreen from './screens/GoLiveScreen';
import LiveStreamRoomScreen from './screens/LiveStreamRoomScreen';
import StreamEndedSummaryScreen from './screens/StreamEndedSummaryScreen';
import PurchaseConfirmationScreen from './screens/PurchaseConfirmationScreen';
import { ReminderScreen } from './screens/ReminderScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import HelpTopicScreen from './screens/HelpTopicScreen';
import { api } from './services/apiService';
import ApiLogger from './components/ApiLogger';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ProfileUser | null>(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showStreamSummary, setShowStreamSummary] = useState(false);
  const [streamDuration, setStreamDuration] = useState('00:00:00.0000000000');
  const [selectedPurchasePackage, setSelectedPurchasePackage] = useState<{ amount: number; price: number } | null>(null);
  const [isReminderPanelOpen, setReminderPanelOpen] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(null);
  const [isStreamPrivate, setIsStreamPrivate] = useState(false);
  const [chatUser, setChatUser] = useState<ProfileUser | null>(null);

  const isAuthenticated = !!currentUser;

  const handleLogin = async () => {
    try {
      const user = await api.login();
      const wallet = await api.fetchWallet(user.id);
      const userWithWallet = { ...user, wallet };
      setCurrentUser(userWithWallet);
      setViewedUserId(user.id); // Default to viewing own profile after login
    } catch (error) {
        alert(`Falha no login: ${error}. Verifique se o servidor backend está rodando em http://localhost:3001.`);
        console.error(error);
    }
  };

  const handleStartLive = (isPrivate: boolean) => {
    setIsStreamPrivate(isPrivate);
    setIsGoLiveOpen(false);
    setIsLive(true);
  };

  const handleEndLive = (duration: string) => {
    setIsLive(false);
    setStreamDuration(duration);
    setShowStreamSummary(true);
  };

  const handleCloseSummary = () => {
    setShowStreamSummary(false);
    setActiveScreen('home');
  };

  const handleInitiatePurchase = (pkg: { amount: number; price: number }) => {
    setSelectedPurchasePackage(pkg);
    setActiveScreen('purchaseConfirmation');
  };

  const handleSelectHelpTopic = (topic: string) => {
    setSelectedHelpTopic(topic);
    setActiveScreen('helpTopic');
  };

  const navigateTo = (screen: string, userId?: string) => {
    if (userId) {
      setViewedUserId(userId);
    } else if (currentUser) {
        if (['profile', 'following', 'fans', 'visitors', 'topFans'].includes(screen)) {
            setViewedUserId(currentUser.id);
        }
    }
    setActiveScreen(screen);
  };
  
  const navigateToChat = async (userId: string) => {
    try {
        const user = await api.fetchUser(userId);
        if(user) {
            setChatUser(user);
            setActiveScreen('chat');
        } else {
            alert(`Usuário com ID ${userId} não encontrado.`);
        }
    } catch(err) {
        alert(`Erro ao buscar dados do usuário para o chat: ${err}`);
    }
  };


  const renderContent = () => {
    if (!isAuthenticated || !currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (showStreamSummary) {
      return <StreamEndedSummaryScreen duration={streamDuration} onBackToHome={handleCloseSummary} />;
    }

    if (isLive) {
      return <LiveStreamRoomScreen onEndLive={handleEndLive} isPrivate={isStreamPrivate} currentUser={currentUser} />;
    }

    let screenContent;
    switch (activeScreen) {
      case 'home':
        screenContent = <HomeScreen setActiveScreen={navigateTo} onOpenReminderPanel={() => setReminderPanelOpen(true)} />;
        break;
      case 'profile':
        screenContent = <ProfileScreen setActiveScreen={navigateTo} currentUser={currentUser} />;
        break;
      case 'broadcasterProfile': {
        const BroadcasterProfileWrapper: React.FC<{userId: string; currentUserId: string;}> = ({ userId, currentUserId }) => {
            const [user, setUser] = useState<ProfileUser | null>(null);
            const [error, setError] = useState<string|null>(null);
            const [loading, setLoading] = useState(true);
            
            useEffect(() => {
                setError(null);
                setUser(null);
                setLoading(true);
                api.fetchUser(userId).then(fetchedUser => {
                    if (fetchedUser) setUser(fetchedUser);
                    else setError("Usuário não encontrado.");
                }).catch(err => {
                    console.error(err);
                    setError(err.message);
                }).finally(() => setLoading(false));
            }, [userId]);
            
            if (loading) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Carregando perfil...</div>;
            if (error) return <div className="bg-black min-h-screen text-white flex justify-center items-center text-red-400 p-4 text-center">Erro ao carregar perfil:<br/>{error}</div>;
            if (!user) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Usuário não encontrado.</div>;


            return <BroadcasterProfileScreen 
                        user={user} 
                        isSelf={userId === currentUserId} 
                        setActiveScreen={navigateTo}
                        onStartChat={(userToChat) => navigateToChat(userToChat.id)}
                   />;
        };
        screenContent = <BroadcasterProfileWrapper userId={viewedUserId || currentUser.id} currentUserId={currentUser.id} />;
        break;
      }
      case 'editProfile':
        screenContent = <EditProfileScreen setActiveScreen={navigateTo} currentUserId={currentUser.id} />;
        break;
      case 'following':
        screenContent = <FollowingScreen setActiveScreen={navigateTo} userId={viewedUserId || currentUser.id} />;
        break;
      case 'fans':
        screenContent = <FansScreen setActiveScreen={navigateTo} userId={viewedUserId || currentUser.id} />;
        break;
      case 'visitors':
        screenContent = <VisitorsScreen setActiveScreen={navigateTo} userId={currentUser.id} />;
        break;
      case 'broadcasterTopFans':
        screenContent = <BroadcasterTopFansScreen setActiveScreen={navigateTo} userId={viewedUserId || currentUser.id} />;
        break;
      case 'wallet':
        screenContent = <WalletScreen setActiveScreen={navigateTo} onPurchaseClick={handleInitiatePurchase} currentUserId={currentUser.id} />;
        break;
      case 'purchaseHistory':
        screenContent = <PurchaseHistoryScreen setActiveScreen={navigateTo} />;
        break;
      case 'withdrawMethod':
        screenContent = <WithdrawMethodScreen setActiveScreen={navigateTo} />;
        break;
      case 'level':
        screenContent = <LevelScreen setActiveScreen={navigateTo} />;
        break;
      case 'topFans':
        screenContent = <TopFansScreen setActiveScreen={navigateTo} userId={currentUser.id} />;
        break;
      case 'avatarProtection':
        screenContent = <AvatarProtectionScreen setActiveScreen={navigateTo} />;
        break;
      case 'reports':
        screenContent = <ReportsScreen setActiveScreen={navigateTo} />;
        break;
      case 'blockList':
        screenContent = <BlockListScreen setActiveScreen={navigateTo} />;
        break;
      case 'settings':
        screenContent = <SettingsScreen setActiveScreen={navigateTo} />;
        break;
      case 'connectedAccounts':
        screenContent = <ConnectedAccountsScreen setActiveScreen={navigateTo} />;
        break;
      case 'notificationSettings':
        screenContent = <NotificationSettingsScreen setActiveScreen={navigateTo} />;
        break;
      case 'giftNotificationSettings':
        screenContent = <GiftNotificationSettingsScreen setActiveScreen={navigateTo} />;
        break;
      case 'privateLiveSettings':
        screenContent = <PrivateLiveSettingsScreen setActiveScreen={navigateTo} />;
        break;
      case 'privacySettings':
        screenContent = <PrivacySettingsScreen setActiveScreen={navigateTo} />;
        break;
      case 'whoCanMessage':
        screenContent = <WhoCanMessageScreen setActiveScreen={navigateTo} />;
        break;
      case 'appVersion':
        screenContent = <AppVersionScreen setActiveScreen={navigateTo} />;
        break;
      case 'earningsInfo':
        screenContent = <EarningsInfoScreen setActiveScreen={navigateTo} />;
        break;
      case 'pushSettings':
        screenContent = <PushSettingsScreen setActiveScreen={navigateTo} currentUserId={currentUser.id} />;
        break;
      case 'purchaseConfirmation':
        if (selectedPurchasePackage) {
            screenContent = <PurchaseConfirmationScreen
                packageInfo={selectedPurchasePackage}
                onClose={() => setActiveScreen('wallet')}
            />;
        } else {
            setActiveScreen('wallet');
            screenContent = null;
        }
        break;
      case 'shop':
        screenContent = <PlaceholderScreen setActiveScreen={navigateTo} screenName="Loja" />;
        break;
      case 'liveApp':
        screenContent = <PlaceholderScreen setActiveScreen={navigateTo} screenName="Aplicativo ao Vivo" />;
        break;
      case 'customerService':
        screenContent = <PlaceholderScreen setActiveScreen={navigateTo} screenName="Atendimento ao Cliente" />;
        break;
      case 'helpCenter':
        screenContent = <HelpCenterScreen setActiveScreen={navigateTo} onSelectTopic={handleSelectHelpTopic} />;
        break;
      case 'helpTopic':
        if (selectedHelpTopic) {
          screenContent = <HelpTopicScreen setActiveScreen={navigateTo} topic={selectedHelpTopic} />;
        } else {
          setActiveScreen('helpCenter');
          screenContent = null;
        }
        break;
      case 'messages':
        screenContent = <MessagesScreen setActiveScreen={navigateTo} currentUserId={currentUser.id} onConversationSelect={navigateToChat} />;
        break;
      case 'chat':
        if (chatUser) {
          screenContent = <ChatScreen user={chatUser} currentUser={currentUser} onBack={() => setActiveScreen('messages')} onOpenProfile={(user) => navigateTo('broadcasterProfile', user.id)} />;
        } else {
           setActiveScreen('messages');
           screenContent = null;
        }
        break;
      case 'supportChat': {
         const SupportChatWrapper = () => {
            const [supportUser, setSupportUser] = useState<ProfileUser|null>(null);
            const [error, setError] = useState<string|null>(null);
            const [loading, setLoading] = useState(true);
            
            useEffect(() => {
                setLoading(true);
                api.fetchUser('support-01').then(user => {
                    if(user) setSupportUser(user);
                    else setError("Agente de suporte não encontrado.");
                }).catch(err => {
                    console.error(err);
                    setError(err.message);
                }).finally(() => setLoading(false));
            }, []);

            if(loading) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Carregando chat de suporte...</div>;
            if(error) return <div className="bg-black min-h-screen text-white flex justify-center items-center text-red-400">Erro: {error}</div>;
            if(!supportUser) return <div className="bg-black min-h-screen text-white flex justify-center items-center">Agente de suporte não encontrado.</div>;
            
            return <ChatScreen user={supportUser} currentUser={currentUser} onBack={() => setActiveScreen('helpCenter')} onOpenProfile={() => {}} />;
         }
         screenContent = <SupportChatWrapper />;
         break;
      }
      case 'searchFriends':
        screenContent = <SearchFriendsScreen setActiveScreen={navigateTo} />;
        break;
      default:
        screenContent = <HomeScreen setActiveScreen={navigateTo} onOpenReminderPanel={() => setReminderPanelOpen(true)} />;
    }

    const showBottomNav = activeScreen === 'home' || activeScreen === 'profile' || activeScreen === 'messages';

    return (
      <div className="relative h-full flex flex-col overflow-hidden bg-black">
        <div className="flex-grow flex flex-col min-h-0">
          {screenContent}
        </div>
        {showBottomNav && <BottomNav activeScreen={activeScreen} setActiveScreen={navigateTo} onGoLiveClick={() => setIsGoLiveOpen(true)} />}
        {isGoLiveOpen && <GoLiveScreen onClose={() => setIsGoLiveOpen(false)} onStartLive={handleStartLive} />}
        {isReminderPanelOpen && <ReminderScreen onClose={() => setReminderPanelOpen(false)} />}
        {isAuthenticated && <ApiLogger />}
      </div>
    );
  };

  return renderContent();
};

export default App;