
import React, { useState } from 'react';
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
import BroadcasterProfileScreen, { selfUser, ProfileUser } from './screens/BroadcasterProfileScreen';
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
import ReminderScreen from './screens/ReminderScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import HelpTopicScreen from './screens/HelpTopicScreen';
import { Stream } from './types';
import { MOCK_STREAMS } from './constants';

// Fix: Create a mock user to pass to ChatScreen, as the current navigation doesn't provide it.
const mockChatUser: ProfileUser = {
    name: 'Lest Go 500 K...',
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

const mockSupportUser: ProfileUser = {
    name: 'Suporte LiveGo',
    avatarUrl: 'https://picsum.photos/seed/support/150/150',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    country: 'br',
    id: 'support-01',
    age: 0,
    gender: 'female',
    level: 99,
    location: 'Online',
    distance: '0 km',
    fans: 'N/A',
    following: 'N/A',
    receptores: 'N/A',
    enviados: 'N/A',
    topFansAvatars: [],
    isLive: false,
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home'); 
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [showStreamSummary, setShowStreamSummary] = useState(false);
  const [streamDuration, setStreamDuration] = useState('00:00:00.0000000000');
  const [selectedPurchasePackage, setSelectedPurchasePackage] = useState<{ amount: number; price: number } | null>(null);
  const [isReminderPanelOpen, setReminderPanelOpen] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(null);
  const [streams, setStreams] = useState<Stream[]>(MOCK_STREAMS);
  const [isStreamPrivate, setIsStreamPrivate] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
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

  const handleRefreshStreams = () => {
    // Simple shuffle to simulate a refresh
    setStreams(prevStreams => [...prevStreams].sort(() => Math.random() - 0.5));
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (showStreamSummary) {
      return <StreamEndedSummaryScreen duration={streamDuration} onBackToHome={handleCloseSummary} />;
    }

    if (isLive) {
      return <LiveStreamRoomScreen onEndLive={handleEndLive} isPrivate={isStreamPrivate} />;
    }

    let screenContent;
    switch (activeScreen) {
      case 'home':
        screenContent = <HomeScreen streams={streams} setActiveScreen={setActiveScreen} onOpenReminderPanel={() => setReminderPanelOpen(true)} />;
        break;
      case 'profile':
        screenContent = <ProfileScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'broadcasterProfile':
        screenContent = <BroadcasterProfileScreen user={selfUser} isSelf={true} setActiveScreen={setActiveScreen} />;
        break;
      case 'editProfile':
        screenContent = <EditProfileScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'following':
        screenContent = <FollowingScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'fans':
        screenContent = <FansScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'visitors':
        screenContent = <VisitorsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'broadcasterTopFans':
        screenContent = <BroadcasterTopFansScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'wallet':
        screenContent = <WalletScreen setActiveScreen={setActiveScreen} onPurchaseClick={handleInitiatePurchase} />;
        break;
      case 'purchaseHistory':
        screenContent = <PurchaseHistoryScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'withdrawMethod':
        screenContent = <WithdrawMethodScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'level':
        screenContent = <LevelScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'topFans':
        screenContent = <TopFansScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'avatarProtection':
        screenContent = <AvatarProtectionScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'reports':
        screenContent = <ReportsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'blockList':
        screenContent = <BlockListScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'settings':
        screenContent = <SettingsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'connectedAccounts':
        screenContent = <ConnectedAccountsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'notificationSettings':
        screenContent = <NotificationSettingsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'giftNotificationSettings':
        screenContent = <GiftNotificationSettingsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'privateLiveSettings':
        screenContent = <PrivateLiveSettingsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'privacySettings':
        screenContent = <PrivacySettingsScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'whoCanMessage':
        screenContent = <WhoCanMessageScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'appVersion':
        screenContent = <AppVersionScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'earningsInfo':
        screenContent = <EarningsInfoScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'pushSettings':
        screenContent = <PushSettingsScreen setActiveScreen={setActiveScreen} />;
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
        screenContent = <PlaceholderScreen setActiveScreen={setActiveScreen} screenName="Loja" />;
        break;
      case 'liveApp':
        screenContent = <PlaceholderScreen setActiveScreen={setActiveScreen} screenName="Aplicativo ao Vivo" />;
        break;
      case 'customerService':
        screenContent = <PlaceholderScreen setActiveScreen={setActiveScreen} screenName="Atendimento ao Cliente" />;
        break;
      case 'helpCenter':
        screenContent = <HelpCenterScreen setActiveScreen={setActiveScreen} onSelectTopic={handleSelectHelpTopic} />;
        break;
      case 'helpTopic':
        if (selectedHelpTopic) {
          screenContent = <HelpTopicScreen setActiveScreen={setActiveScreen} topic={selectedHelpTopic} />;
        } else {
          setActiveScreen('helpCenter');
          screenContent = null;
        }
        break;
      case 'messages':
        screenContent = <MessagesScreen setActiveScreen={setActiveScreen} />;
        break;
      case 'chat':
        // Fix: Pass the required props `user`, `onBack`, and `onOpenProfile` to ChatScreen.
        // This resolves the compilation error on line 177.
        screenContent = (
          <ChatScreen
            user={mockChatUser}
            onBack={() => setActiveScreen('messages')}
            onOpenProfile={(user) => {
              // Note: This navigates to the profile screen, which is currently hardcoded
              // to show the self-user. A larger refactor would be needed to show other users' profiles.
              setActiveScreen('broadcasterProfile');
            }}
          />
        );
        break;
      case 'supportChat':
        screenContent = (
          <ChatScreen
            user={mockSupportUser}
            onBack={() => setActiveScreen('helpCenter')}
            onOpenProfile={() => {}} // No profile for support agent
          />
        );
        break;
      case 'searchFriends':
        screenContent = <SearchFriendsScreen setActiveScreen={setActiveScreen} />;
        break;
      default:
        screenContent = <HomeScreen streams={streams} setActiveScreen={setActiveScreen} onOpenReminderPanel={() => setReminderPanelOpen(true)} />;
    }

    const showBottomNav = activeScreen === 'home' || activeScreen === 'profile' || activeScreen === 'messages';

    return (
      <div className="relative h-full flex flex-col overflow-hidden bg-black">
        <div className="flex-grow flex flex-col min-h-0">
          {screenContent}
        </div>
        {showBottomNav && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} onGoLiveClick={() => setIsGoLiveOpen(true)} onRefreshStreams={handleRefreshStreams} />}
        {isGoLiveOpen && <GoLiveScreen onClose={() => setIsGoLiveOpen(false)} onStartLive={handleStartLive} />}
        {isReminderPanelOpen && <ReminderScreen onClose={() => setReminderPanelOpen(false)} />}
      </div>
    );
  };

  return renderContent();
};

export default App;
