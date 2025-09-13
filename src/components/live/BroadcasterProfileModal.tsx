import React, { useState } from 'react';
import BroadcasterProfileScreen, { ProfileUser } from '../../screens/BroadcasterProfileScreen';
import BroadcasterTopFansScreen from '../../screens/BroadcasterTopFansScreen';
import FollowingScreen from '../../screens/FollowingScreen';
import { api } from '../../services/apiService';

interface BroadcasterProfileModalProps {
    onClose: () => void;
    user: ProfileUser;
    onStartChat?: (user: ProfileUser) => void;
    isSelf: boolean;
}

const BroadcasterProfileModal: React.FC<BroadcasterProfileModalProps> = ({ onClose, user, onStartChat, isSelf }) => {
    const [modalScreen, setModalScreen] = useState('broadcasterProfile');

    const navigate = (screen: string) => {
        if (screen === 'profile' || screen === 'broadcasterProfile') {
            setModalScreen('broadcasterProfile');
        } else {
            setModalScreen(screen);
        }
    };
    
    // In a modal context for another user, we don't have their full self-user data
    // so we fetch a fresh copy if needed.
    const [displayUser, setDisplayUser] = useState(user);
    const [loading, setLoading] = useState(false);
    
     React.useEffect(() => {
        if (!user.isLive) { // isLive is a good indicator if it's the limited self-user from live
            setLoading(true);
            api.fetchUser(user.id).then(fullUser => {
                if(fullUser) setDisplayUser(fullUser);
            }).finally(() => setLoading(false));
        }
    }, [user]);


    const renderContent = () => {
        if (loading || !displayUser) {
            return <div className="h-full flex items-center justify-center">Carregando...</div>;
        }

        switch (modalScreen) {
            case 'broadcasterProfile':
                return (
                    <BroadcasterProfileScreen
                        setActiveScreen={navigate}
                        isModal={true}
                        onModalClose={onClose}
                        user={displayUser}
                        isSelf={isSelf}
                        onStartChat={onStartChat}
                    />
                );
            case 'broadcasterTopFans':
                return <BroadcasterTopFansScreen setActiveScreen={navigate} userId={displayUser.id} />;
            case 'following':
                return <FollowingScreen setActiveScreen={navigate} userId={displayUser.id} />;
            default:
                onClose();
                return null;
        }
    };

    return (
        <div className="absolute inset-0 z-30 bg-black overflow-y-auto no-scrollbar">
            {renderContent()}
        </div>
    );
};

export default BroadcasterProfileModal;