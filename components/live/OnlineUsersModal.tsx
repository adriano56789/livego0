import React from 'react';
import CloseIcon from '../icons/CloseIcon';
import RefreshIcon from '../icons/RefreshIcon';
import StarIcon from '../icons/StarIcon';

interface OnlineUsersModalProps {
    onClose: () => void;
}

const OnlineUsersModal: React.FC<OnlineUsersModalProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#422d6b] to-[#2a1a4a] rounded-t-2xl h-[40%] flex flex-col p-4 z-10" onClick={onClose}>
            <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                    <h2 className="text-lg font-semibold">Usuários Online ( 0 )</h2>
                    <button><RefreshIcon className="w-6 h-6" /></button>
                </div>
            </div>
            <ul className="flex-grow overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                <li className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img 
                                src="https://picsum.photos/seed/profile/48/48" 
                                alt="User avatar" 
                                className="w-12 h-12 rounded-full" 
                                style={{boxShadow: '0 0 15px #facc15'}}
                             />
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-0.5 rounded-full border-2 border-[#3a255a]">
                                 <StarIcon className="w-3 h-3 text-black" fill="black" />
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold">Rainha PK</p>
                            <p className="text-xs text-gray-300">Identificação: 66345102</p>
                        </div>
                    </div>
                    <span className="font-bold text-yellow-300">999999</span>
                </li>
            </ul>
        </div>
    );
};
export default OnlineUsersModal;