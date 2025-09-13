import React, { useState, useEffect, useRef } from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import MoreHorizIcon from '../components/icons/MoreHorizIcon';
import FemaleIcon from '../components/icons/FemaleIcon';
import LevelBadgeIcon from '../components/icons/LevelBadgeIcon';
import { ProfileUser } from './BroadcasterProfileScreen';
import MaleIcon from '../components/icons/MaleIcon';
import { api } from '../services/apiService';

interface ChatScreenProps {
    user: ProfileUser;
    onBack: () => void;
    onOpenProfile: (user: ProfileUser) => void;
    currentUser: ProfileUser;
}

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}


const ChatScreen: React.FC<ChatScreenProps> = ({ user, currentUser, onBack, onOpenProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        api.fetchChatHistory(currentUser.id, user.id)
            .then(setMessages)
            .catch(err => {
                console.error("Failed to fetch chat history:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [currentUser.id, user.id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            const sentMessage = await api.sendMessage(currentUser.id, user.id, newMessage);
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
        } catch (err: any) {
            console.error("Failed to send message:", err);
            // Optionally, show a toast or an error message near the input
            alert(`Error sending message: ${err.message}`);
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 flex flex-col justify-end z-30" onClick={() => setIsModalOpen(false)}>
            <div className="bg-[#282828] rounded-t-2xl p-2" onClick={e => e.stopPropagation()}>
                <div className="bg-[#1e1e1e] rounded-xl text-center">
                    <button className="w-full p-4 text-red-500 font-semibold border-b border-gray-600">Cancelar amizade</button>
                    <button className="w-full p-4 text-white font-semibold">Bloquear</button>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-full text-center p-4 text-blue-400 font-bold bg-[#1e1e1e] rounded-xl mt-2">Cancelar</button>
            </div>
        </div>
    );

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <header className="p-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} aria-label="Back">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => onOpenProfile(user)} className="text-left">
                        <h1 className="text-lg font-semibold">{user.name}</h1>
                        {user.id !== 'support-01' && (
                            <div className="flex items-center space-x-1 mt-1">
                                <div className={`flex items-center ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                                    {user.gender === 'male' ? <MaleIcon className="w-2.5 h-2.5"/> : <FemaleIcon className="w-2.5 h-2.5"/>}
                                    <span>{user.age}</span>
                                </div>
                                <div className="flex items-center bg-orange-500 rounded-full px-1.5 py-0.5 text-xs font-semibold space-x-1 text-white">
                                    <LevelBadgeIcon className="w-2.5 h-2.5" />
                                    <span>{user.level}</span>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-green-400 mt-1">On-line</p>
                    </button>
                </div>
                <button onClick={() => setIsModalOpen(true)}>
                    <MoreHorizIcon className="w-6 h-6" />
                </button>
            </header>
            <main ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto no-scrollbar">
                 {loading && <p className="text-center text-gray-400">Carregando histórico...</p>}
                 {error && <p className="text-center text-red-400">Erro ao carregar mensagens: {error}</p>}
                 {!loading && !error && messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : ''}`}>
                        <div className={`${msg.senderId === currentUser.id ? 'bg-purple-600' : 'bg-[#2a2a2a]'} p-3 rounded-lg max-w-xs`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs ${msg.senderId === currentUser.id ? 'text-purple-200' : 'text-gray-500'} text-right mt-1`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </main>
            <footer className="p-4 bg-black border-t border-gray-800">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        placeholder="Sua mensagem..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        className="flex-grow bg-[#2a2a2a] rounded-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
                    />
                    <button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-full">
                        Enviar
                    </button>
                </div>
            </footer>
            {isModalOpen && renderModal()}
        </div>
    );
};

export default ChatScreen;