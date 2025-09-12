
import React, { useState } from 'react';
import MaleIcon from '../components/MaleIcon';
import FemaleIcon from '../components/FemaleIcon';
import LevelBadgeIcon from '../components/LevelBadgeIcon';

interface MessagesScreenProps {
    setActiveScreen: (screen: string) => void;
}

const conversations = [
    { id: 1, name: 'Lest Go 500 K...', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'Olá! Tudo bem?', time: '3 horas', icons: true, age: 22, gender: 'female', level: 21 },
];

const friends = [
    { id: 1, name: 'Lest Go 500 K...', userId: '55218901', avatar: 'https://i.pravatar.cc/150?img=2', age: 22, gender: 'female', level: 21 },
];

const MessagesScreen: React.FC<MessagesScreenProps> = ({ setActiveScreen }) => {
    const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'friends'

    const renderMessages = () => (
        <ul>
            {conversations.map(convo => (
                <li key={convo.id} onClick={() => setActiveScreen('chat')} className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-[#1f1f1f]">
                    <img src={convo.avatar} alt={convo.name} className="w-14 h-14 rounded-full" />
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-white flex items-center">{convo.name} 👑</p>
                            <p className="text-xs text-gray-500">{convo.time}</p>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                            <div className={`flex items-center ${convo.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                                {convo.gender === 'male' ? <MaleIcon className="w-2.5 h-2.5"/> : <FemaleIcon className="w-2.5 h-2.5"/>}
                                <span>{convo.age}</span>
                            </div>
                            <div className="flex items-center bg-cyan-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                <LevelBadgeIcon className="w-2.5 h-2.5" />
                                <span>{convo.level}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 truncate">{convo.lastMessage}</p>
                    </div>
                </li>
            ))}
        </ul>
    );

    const renderFriends = () => (
        <ul>
            {friends.map(friend => (
                 <li key={friend.id} onClick={() => setActiveScreen('broadcasterProfile')} className="flex items-center p-4 space-x-4 cursor-pointer hover:bg-[#1f1f1f]">
                    <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full" />
                    <div className="flex-grow">
                        <p className="font-semibold text-white">{friend.name}</p>
                         <div className="flex items-center space-x-1 mt-1">
                            <div className={`flex items-center ${friend.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                                {friend.gender === 'male' ? <MaleIcon className="w-2.5 h-2.5"/> : <FemaleIcon className="w-2.5 h-2.5"/>}
                                <span>{friend.age}</span>
                            </div>
                            <div className="flex items-center bg-cyan-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                <LevelBadgeIcon className="w-2.5 h-2.5" />
                                <span>{friend.level}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Identificação: {friend.userId}</p>
                    </div>
                    <button className="bg-[#3a3a3a] text-gray-300 font-semibold py-2 px-6 rounded-full text-sm">
                        Seguido
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="bg-[#121212] h-full text-white flex flex-col">
            <header className="sticky top-0 z-10 bg-[#121212] py-2 px-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setActiveTab('messages')} className={`text-2xl font-bold ${activeTab === 'messages' ? 'text-white' : 'text-gray-600'}`}>
                            Mensagens
                            {activeTab === 'messages' && <div className="h-1 w-8 bg-white mx-auto mt-1 rounded-full"></div>}
                        </button>
                         <button onClick={() => setActiveTab('friends')} className={`text-2xl font-bold ${activeTab === 'friends' ? 'text-white' : 'text-gray-600'}`}>
                            Amigos
                            {activeTab === 'friends' && <div className="h-1 w-8 bg-white mx-auto mt-1 rounded-full"></div>}
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto no-scrollbar pb-24">
                {activeTab === 'messages' ? renderMessages() : renderFriends()}
            </main>
        </div>
    );
};

export default MessagesScreen;
