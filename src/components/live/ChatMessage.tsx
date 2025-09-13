
import React, { useId } from 'react';

const LevelBadge: React.FC<{ level: number; className?: string }> = ({ level, className }) => {
    const getGradientColors = () => {
        if (level < 10) return ['#a855f7', '#ec4899'];
        if (level < 20) return ['#22d3ee', '#3b82f6'];
        if (level < 30) return ['#facc15', '#fb923c'];
        if (level < 40) return ['#4ade80', '#16a34a'];
        if (level < 60) return ['#f87171', '#dc2626'];
        return ['#f5f5f5', '#9ca3af'];
    };

    const [startColor, endColor] = getGradientColors();
    const id = useId();
    const gradientId = `levelBadgeGrad-${id}`;

    const fontSize = level > 99 ? '7px' : '9px';

    return (
        <div className={`relative inline-flex items-center justify-center font-bold text-white w-4 h-4 flex-shrink-0 ${className}`}>
            <svg width="16" height="18" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                </defs>
                <path d="M10 0L19.5 5.5V16.5L10 22L0.5 16.5V5.5L10 0Z" fill={`url(#${gradientId})`} />
            </svg>
            <span className="relative z-10" style={{ fontSize }}>{level}</span>
        </div>
    );
};

interface ChatMessageProps {
    user: string;
    level: number;
    message: string;
    avatarUrl: string;
    onAvatarClick: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ user, level, message, avatarUrl, onAvatarClick }) => {
    return (
        <div className="bg-black/40 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 inline-flex items-center align-middle space-x-2 max-w-full animate-fade-in">
            <button onClick={onAvatarClick} className="flex-shrink-0 rounded-full focus:outline-none ring-2 ring-transparent focus:ring-purple-500">
                <img src={avatarUrl} alt={user} className="w-7 h-7 rounded-full" />
            </button>
            <LevelBadge level={level} />
            <span className="text-gray-400 font-semibold text-sm flex-shrink-0">{user}:</span>
            <span className="text-white text-sm break-words">{message}</span>
        </div>
    );
};

export default ChatMessage;
