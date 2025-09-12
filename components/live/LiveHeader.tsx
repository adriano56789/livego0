
import React from 'react';
import CloseIcon from '../icons/CloseIcon';
import SoundWaveIcon from '../icons/SoundWaveIcon';
import UserGroupIcon from '../icons/UserGroupIcon';
import PlusIcon from '../icons/PlusIcon';
import UserIcon from '../icons/UserIcon';
import LockIcon from '../icons/LockIcon';

interface LiveHeaderProps {
    onClose: () => void;
    onProfileClick: () => void;
    onOnlineUsersClick: () => void;
    isPrivate?: boolean;
}

const LiveHeader: React.FC<LiveHeaderProps> = ({ onClose, onProfileClick, onOnlineUsersClick, isPrivate }) => {
    return (
        <header className="p-3 flex justify-between items-start z-10 flex-shrink-0">
            <div className="flex items-center space-x-2">
                <button onClick={onProfileClick} className="bg-black/30 rounded-full p-1 flex items-center space-x-2">
                    <img src="https://picsum.photos/seed/profile/40/40" alt="User avatar" className="w-10 h-10 rounded-full" />
                    <div className="pr-4">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm">Rainha PK</p>
                            {isPrivate && <LockIcon className="w-3 h-3 ml-1 text-yellow-400"/>}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-300">
                            <UserIcon className="w-3 h-3" />
                            <span>0</span>
                        </div>
                    </div>
                    <SoundWaveIcon className="w-6 h-6 text-green-400 mr-2" />
                </button>
                <button className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                   <img src="https://i.pravatar.cc/150?img=3" alt="viewer" className="w-8 h-8 rounded-full border-2 border-black/50" />
                </div>
                 <button onClick={onOnlineUsersClick} className="bg-black/30 rounded-full px-3 py-1 text-sm flex items-center space-x-1">
                     <UserGroupIcon className="w-4 h-4" />
                     <span>0</span>
                 </button>
                <button onClick={onClose} className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default LiveHeader;