import React from 'react';
import FemaleIcon from '../icons/FemaleIcon';
import MaleIcon from '../icons/MaleIcon';
import LevelBadgeIcon from '../icons/LevelBadgeIcon';

interface PKInvitationModalProps {
    user: {
        avatar: string;
        name: string;
        age: number;
        gender: 'male' | 'female';
        level: number;
    };
}

const PKInvitationModal: React.FC<PKInvitationModalProps> = ({ user }) => {
    const borderAnimation = `
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animated-border::before {
            content: '';
            position: absolute;
            z-index: -1;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            background: conic-gradient(#db2777, #9333ea, #db2777);
            border-radius: 50%;
            animation: rotate 4s linear infinite;
        }
    `;

    return (
      <>
        <style>{borderAnimation}</style>
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center w-80 flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="relative animated-border w-32 h-32 mb-4">
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover p-1 bg-[#2a2a2a]" />
                </div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <div className="flex items-center space-x-1 my-2">
                    <div className={`flex items-center ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                        {user.gender === 'male' ? <MaleIcon className="w-2.5 h-2.5"/> : <FemaleIcon className="w-2.5 h-2.5"/>}
                        <span>{user.age}</span>
                    </div>
                    <div className="flex items-center bg-cyan-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                        <LevelBadgeIcon className="w-2.5 h-2.5" />
                        <span>{user.level}</span>
                    </div>
                </div>
                <p className="text-gray-400 my-4">Convite enviado</p>
            </div>
        </div>
      </>
    );
};

export default PKInvitationModal;