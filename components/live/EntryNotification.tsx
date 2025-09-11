import React, { useEffect, useRef } from 'react';

interface EntryNotificationProps {
    username: string;
    onAnimationEnd: () => void;
}

const EntryNotification: React.FC<EntryNotificationProps> = ({ username, onAnimationEnd }) => {
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
        <div ref={ref} className="standard-entry-notification bg-black/50 backdrop-blur-sm rounded-full px-4 py-1 inline-block">
            <p className="text-sm text-gray-200">
                <span className="font-semibold text-cyan-300">{username}</span> entrou na sala.
            </p>
        </div>
    );
};

export default EntryNotification;
