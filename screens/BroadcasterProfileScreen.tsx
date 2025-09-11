import React, { useState } from 'react';
import MaleIcon from '../components/icons/MaleIcon';
import LevelBadgeIcon from '../components/icons/LevelBadgeIcon';
import CopyIcon from '../components/icons/CopyIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import EditIcon from '../components/icons/EditIcon';
import PlayOutlineIcon from '../components/icons/PlayOutlineIcon';
import HeartIcon from '../components/icons/HeartIcon';
import DocumentDetailsIcon from '../components/icons/DocumentDetailsIcon';
import MoreHorizIcon from '../components/icons/MoreHorizIcon';
import SoundWaveIcon from '../components/icons/SoundWaveIcon';
import StarIcon from '../components/icons/StarIcon';
import FemaleIcon from '../components/icons/FemaleIcon';

export interface ProfileUser {
    name: string;
    avatarUrl: string;
    coverUrl: string;
    country: 'br' | 'us';
    id: string;
    age: number;
    gender: 'male' | 'female';
    level: number;
    location: string;
    distance: string;
    fans: string;
    following: string;
    receptores: string;
    enviados: string;
    topFansAvatars: string[];
    isLive?: boolean;
}

export const selfUser: ProfileUser = {
    name: 'Seu Perfil',
    avatarUrl: 'https://picsum.photos/seed/profile/100/100',
    coverUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    country: 'br',
    id: '10755083',
    age: 22,
    gender: 'male',
    level: 6,
    location: 'Brasil, São Paulo',
    distance: '0,00 km',
    fans: '3',
    following: '0',
    receptores: '125,00 mil',
    enviados: '0',
    topFansAvatars: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'],
    isLive: false,
};

interface BroadcasterProfileScreenProps {
    setActiveScreen: (screen: string) => void;
    isModal?: boolean;
    onModalClose?: () => void;
    user: ProfileUser;
    isSelf: boolean;
    onStartChat?: (user: ProfileUser) => void;
}

const StatButton: React.FC<{ value: string; label: string; onClick: () => void }> = ({ value, label, onClick }) => (
    <button onClick={onClick} className="text-center">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </button>
);

const TabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex-grow flex flex-col items-center justify-center space-y-1 py-3 ${active ? 'text-purple-400' : 'text-gray-500'}`}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

const BroadcasterProfileScreen: React.FC<BroadcasterProfileScreenProps> = ({ setActiveScreen, isModal, onModalClose, user, isSelf, onStartChat }) => {
    const [activeTab, setActiveTab] = useState('obras');
    const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

    const handleBack = () => {
        if (isModal && onModalClose) {
            onModalClose();
        } else {
            setActiveScreen('profile');
        }
    };

    const renderOptionsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-end z-30" onClick={() => setOptionsModalOpen(false)}>
            <div className="bg-[#282828] rounded-t-2xl p-2" onClick={e => e.stopPropagation()}>
                <div className="bg-[#1e1e1e] rounded-xl">
                    <button className="w-full text-center p-4 text-red-500 font-semibold border-b border-gray-600">Adicionar à lista de bloqueios</button>
                    <button className="w-full text-center p-4 text-white font-semibold">Relatório</button>
                </div>
                <button onClick={() => setOptionsModalOpen(false)} className="w-full text-center p-4 text-white font-bold bg-[#1e1e1e] rounded-xl mt-2">Cancelar</button>
            </div>
        </div>
    );

    return (
        <div className={`bg-black min-h-screen text-white ${isModal && !isSelf ? 'pb-40' : 'pb-24'}`}>
            <div className="relative h-60">
                <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                
                <button onClick={handleBack} className="absolute top-6 left-4 z-10 p-2 bg-black bg-opacity-40 rounded-full"><ChevronRightIcon className="w-6 h-6 rotate-180" /></button>
                
                <div className="absolute top-6 right-4 z-10 flex space-x-2">
                    {isSelf && !isModal && <button onClick={() => setActiveScreen('editProfile')} className="bg-black bg-opacity-50 p-2.5 rounded-full"><EditIcon className="w-5 h-5 text-white" /></button>}
                    <button onClick={() => setOptionsModalOpen(true)} className="bg-black bg-opacity-50 p-2.5 rounded-full"><MoreHorizIcon className="w-5 h-5" /></button>
                </div>

                <div className="absolute -bottom-12 left-6 z-10">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={user.avatarUrl} alt="User avatar" className="w-24 h-24 rounded-full border-4 border-black" />
                             <img src={`https://flagcdn.com/${user.country}.svg`} width="28" alt="Brazil" className="absolute bottom-1 right-1 rounded-full border-2 border-black" />
                            {isModal && user.isLive && (
                                <div className="absolute bottom-1 left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" title="Online" />
                            )}
                        </div>
                        {isModal && user.isLive && (
                            <div className="mt-2 flex items-center space-x-1 bg-pink-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg">
                                <SoundWaveIcon className="w-3.5 h-3.5 text-white"/>
                                <span>AO VIVO</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-20 px-4 pb-4">
                <h1 className="text-2xl font-bold">
                    {user.name}
                </h1>
                <div className="flex items-center text-gray-400 text-sm space-x-2 mt-1">
                    <span>Identificação: {user.id}</span>
                    <button className="hover:text-white transition-colors">
                        <CopyIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center space-x-2 my-2">
                    <div className={`flex items-center ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'} rounded-full px-2 py-0.5 text-xs font-semibold space-x-1 text-white`}>
                        {user.gender === 'male' ? <MaleIcon className="w-3 h-3"/> : <FemaleIcon className="w-3 h-3"/>}
                        <span>{user.age}</span>
                    </div>
                    <div className="flex items-center bg-cyan-500 rounded-full px-2 py-0.5 text-xs font-semibold space-x-1 text-white">
                        <LevelBadgeIcon className="w-3 h-3" />
                        <span>{user.level}</span>
                    </div>
                </div>
                 <p className="text-gray-400 text-sm mt-1">{user.location} | {user.distance}</p>
            </div>
            
            <div className="px-6 py-4 flex justify-between">
                <StatButton value={user.fans} label="Fãs" onClick={() => setActiveScreen('broadcasterTopFans')} />
                <StatButton value={user.following} label="Seguido" onClick={() => setActiveScreen('following')} />
                <StatButton value={user.receptores} label="Receptores" onClick={() => {}} />
                <StatButton value={user.enviados} label="Enviados" onClick={() => {}} />
            </div>

            <div className="px-4">
                <button onClick={() => setActiveScreen('broadcasterTopFans')} className="flex justify-between items-center py-3 px-4 bg-[#1f1f1f] rounded-lg w-full">
                    <span className="font-semibold">Principais fãs</span>
                    <div className="flex items-center">
                        <div className="flex -space-x-4">
                            {user.topFansAvatars.slice(0, 2).map((avatarUrl, index) => (
                                <div key={index} className="relative">
                                    <img className="w-8 h-8 rounded-full border-2 border-black" src={avatarUrl} alt="fan avatar"/>
                                    {index === 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5">
                                            <StarIcon className="w-3 h-3 text-black" fill="black"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500 ml-2" />
                    </div>
                </button>
            </div>
            
            <div className="px-4 mt-4">
                <div className="relative flex justify-around border-b border-gray-800">
                    <TabButton label="Obras" icon={<PlayOutlineIcon />} active={activeTab === 'obras'} onClick={() => setActiveTab('obras')} />
                    <TabButton label="Curtidas" icon={<HeartIcon />} active={activeTab === 'curtidas'} onClick={() => setActiveTab('curtidas')} />
                    <TabButton label="Detalhes" icon={<DocumentDetailsIcon />} active={activeTab === 'detalhes'} onClick={() => setActiveTab('detalhes')} />
                    <div className={`absolute bottom-0 h-1 bg-purple-400 rounded-full transition-all duration-300 w-1/3 ${activeTab === 'obras' ? 'left-0' : activeTab === 'curtidas' ? 'left-1/3' : 'left-2/3'}`}></div>
                </div>

                <div className="py-16 text-center text-gray-500">
                    {activeTab === 'obras' && "Nenhuma obra publicada."}
                    {activeTab === 'curtidas' && "Nenhuma curtida encontrada."}
                    {activeTab === 'detalhes' && "Nenhum detalhe disponível."}
                </div>
            </div>
            
            {isSelf && !isModal && (
              <button
                onClick={() => setActiveScreen('editProfile')}
                className="fixed bottom-24 right-4 bg-white text-black font-semibold py-2 px-4 rounded-full flex items-center justify-center text-sm shadow-lg z-20"
              >
                  <EditIcon className="w-4 h-4 mr-2" />
                  Ajuste
              </button>
            )}

            {isModal && !isSelf && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm z-20">
                    <div className="flex space-x-4">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-full">Seguir</button>
                        <button onClick={() => onStartChat && onStartChat(user)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3.5 rounded-full">Mensagem</button>
                    </div>
                </div>
            )}

            {isOptionsModalOpen && renderOptionsModal()}
        </div>
    );
};

export default BroadcasterProfileScreen;