import React, { useEffect, useRef } from 'react';

interface GiftNotificationProps {
    sender: string;
    giftName: string;
    giftIcon: string | React.ReactNode;
    onAnimationEnd: () => void;
}

const GiftNotification: React.FC<GiftNotificationProps> = ({ sender, giftName, giftIcon, onAnimationEnd }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = ref.current;
        const handleAnimationEnd = () => {
            if (onAnimationEnd) {
                onAnimationEnd();
            }
        };

        if (node) {
            node.addEventListener('animationend', handleAnimationEnd);
            return () => {
                node.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, [onAnimationEnd]);

    return (
        <div ref={ref} className="standard-entry-notification bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 shadow-lg border border-white/20">
            <span className="text-3xl animate-pulse">{giftIcon}</span>
            <p className="text-sm text-white">
                <span className="font-bold">{sender}</span> sent a {giftName}!
            </p>
        </div>
    );
};

export default GiftNotification;
