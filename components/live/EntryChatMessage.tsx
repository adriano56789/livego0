import React from 'react';

interface EntryChatMessageProps {
    user: string;
    avatar: string;
}

const EntryChatMessage: React.FC<EntryChatMessageProps> = ({ user, avatar }) => {
    return (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 inline-flex items-center self-start space-x-2 animate-fade-in">
            <img src={avatar} alt={user} className="w-6 h-6 rounded-full" />
            <p className="text-sm text-gray-200">
                <span className="font-semibold text-cyan-300">{user}</span> entrou na sala.
            </p>
        </div>
    );
};

export default EntryChatMessage;
