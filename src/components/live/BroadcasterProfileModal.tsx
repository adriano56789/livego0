import React, { useState } from 'react';
import BroadcasterProfileScreen, { ProfileUser, selfUser as defaultSelfUser } from '../../screens/BroadcasterProfileScreen';
import BroadcasterTopFansScreen from '../../screens/BroadcasterTopFansScreen';
import FollowingScreen from '../../screens/FollowingScreen';

interface BroadcasterProfileModalProps {
    onClose: () => void;
    user?: ProfileUser;
    onStartChat?: (user: ProfileUser) => void;
}

const BroadcasterProfileModal: React.FC<BroadcasterProfileModalProps> = ({ onClose, user, onStartChat }) => {
    const [modalScreen, setModalScreen] = useState('broadcasterProfile');

    const navigate = (screen: string) => {
        if (screen === 'profile') {
            setModalScreen('broadcasterProfile');
        } else {
            setModalScreen(screen);
        }
    };

    const selfUserWithModalStats: ProfileUser = {
        ...defaultSelfUser,
        receptores: '0',
        enviados: '0',
        isLive: true,
    };

    const displayUser = user || selfUserWithModalStats;
    const isSelf = !user;

    const renderContent = () => {
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
                return <BroadcasterTopFansScreen setActiveScreen={navigate} />;
            case 'following':
                return <FollowingScreen setActiveScreen={navigate} />;
            default:
                // Fallback to closing the modal if screen is not recognized
                onClose();
                return null;
        }
    };

    return (
        <div className="absolute inset-0 z-30 bg-black overflow-y-auto">
            {renderContent()}
        </div>
    );
};

export default BroadcasterProfileModal;