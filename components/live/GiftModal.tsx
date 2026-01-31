import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Gift, User, GiftTask } from '../../types';
import { YellowDiamondIcon, CheckIcon, ChevronDownIcon, SettingsIcon } from '../icons';
import { useTranslation } from '../../i18n';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Loading';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onUpdateUser?: (user: User) => void;
    onSendGift: (gift: Gift, quantity: number, targetId?: string) => Promise<User | null> | void;
    onRecharge: () => void;
    isBroadcaster?: boolean;
    onOpenVIPCenter: () => void;
    streamId?: string;
    hostId?: string;
    onlineUsers?: User[];
    hostUser?: User;
    onOpenSettings?: (view?: string) => void;
}

const STORAGE_KEY_PREFIX = 'livego:giftOrder:';

const GiftModal: React.FC<GiftModalProps> = ({ 
    isOpen, 
    onClose, 
    currentUser,
    onSendGift, 
    onRecharge, 
    isBroadcaster = false, 
    onOpenVIPCenter,
    hostUser,
    onOpenSettings,
    onlineUsers,
}) => {
    const { t } = useTranslation();
    const userDiamonds = currentUser.diamonds;
    const isVIP = !!currentUser.isVIP;

    const [allGifts, setAllGifts] = useState<Gift[]>([]);
    const [isLoadingGifts, setIsLoadingGifts] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [giftsByTab, setGiftsByTab] = useState<Record<string, Gift[]>>({});
    const [targetUser, setTargetUser] = useState<User>(hostUser || currentUser);
    const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
    const [receivedGifts, setReceivedGifts] = useState<(Gift & { count: number })[]>([]);
    const [galleryLoaded, setGalleryLoaded] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [tasks, setTasks] = useState<GiftTask[]>([
        { id: 't1', title: 'Envie 1x Rosa', reward: '+50 EXP Fã-Clube', current: 0, total: 1, action: 'send', giftName: 'Rosa' },
        { id: 't2', title: 'Envie 10 mensagens no chat', reward: '+20 EXP Fã-Clube', current: 3, total: 10, action: 'chat' },
        { id: 't3', title: 'Assista por 15 minutos', reward: '+100 EXP Fã-Clube', current: 5, total: 15, action: 'watch' },
    ]);

    const giftCategories = useMemo(() => {
        const categories: (Gift['category'] | 'Galeria' | 'Mochila')[] = ['Mochila', 'Popular', 'Luxo', 'Atividade', 'VIP', 'Efeito', 'Entrada', 'Galeria'];
        return categories.filter(c => c !== 'VIP' || isVIP);
    }, [isVIP]);

    const [activeTab, setActiveTab] = useState<(Gift['category'] | 'Galeria' | 'Mochila')>(giftCategories[0]);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [quantity, setQuantity] = useState(1);
    const presetQuantities = [1, 10, 99, 188, 520, 1314];

    const dragItem = useRef<Gift | null>(null);
    const dragOverItem = useRef<Gift | null>(null);

    useEffect(() => {
        if (isOpen && hostUser) {
            setTargetUser(hostUser);
        }
    }, [isOpen, hostUser]);
    
    useEffect(() => {
        if (isOpen) {
            setIsLoadingGifts(true);
            api.gifts.list().then(fetchedGifts => {
                const gifts = fetchedGifts || [];
                const rocketIndex = gifts.findIndex(g => g.name === 'Foguete');
                if (rocketIndex !== -1) {
                    gifts[rocketIndex].isLucky = true;
                }
                setAllGifts(gifts);
            }).catch(() => {
                setAllGifts([]);
            }).finally(() => {
                setIsLoadingGifts(false);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && activeTab === 'Galeria' && !galleryLoaded) {
            api.gifts.getGallery().then(gifts => {
                if (Array.isArray(gifts)) {
                    setReceivedGifts(gifts);
                    setGalleryLoaded(true);
                }
            });
        }
    }, [isOpen, activeTab, galleryLoaded]);

    useEffect(() => {
        if (!isOpen) {
            setGalleryLoaded(false);
            setReceivedGifts([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const groupedGifts = allGifts.reduce((acc, gift) => {
            const category = gift.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(gift);
            return acc;
        }, {} as Record<string, Gift[]>);

        Object.keys(groupedGifts).forEach(category => {
            try {
                const savedOrderIdsJson = localStorage.getItem(`${STORAGE_KEY_PREFIX}${category}`);
                if (savedOrderIdsJson) {
                    const savedOrderIds: string[] = JSON.parse(savedOrderIdsJson);
                    if (Array.isArray(savedOrderIds)) {
                        const giftMap: Map<string, Gift> = new Map(groupedGifts[category].map(g => [g.id, g]));
                        const orderedGifts: Gift[] = [];
                        
                        savedOrderIds.forEach((id: string) => {
                            if (giftMap.has(id)) {
                                orderedGifts.push(giftMap.get(id)!);
                                giftMap.delete(id);
                            }
                        });

                        for (const newGift of giftMap.values()) {
                            orderedGifts.push(newGift);
                        }
                        
                        groupedGifts[category] = orderedGifts;
                    }
                }
            } catch (e) {
                console.warn(`Failed to parse gift order for ${category}`, e);
            }
        });

        setGiftsByTab(groupedGifts);
    }, [allGifts, isOpen]);

    useEffect(() => {
        if (isEditMode) setSelectedGift(null);
    }, [isEditMode]);

    useEffect(() => setIsEditMode(false), [activeTab]);
    
    const backpackGifts = useMemo((): Gift[] => {
        if (!currentUser.ownedGifts) return [];
        return currentUser.ownedGifts.map(owned => {
            const giftDetails = allGifts.find(g => g.id === owned.giftId);
            if (!giftDetails) return null;
            return { ...giftDetails, isFromBackpack: true, ownedQuantity: owned.quantity };
        }).filter(Boolean) as Gift[];
    }, [currentUser.ownedGifts, allGifts]);

    const filteredGifts = useMemo(() => {
        if (activeTab === 'Galeria' || activeTab === 'Mochila') return [];
        return giftsByTab[activeTab as string] || [];
    }, [activeTab, giftsByTab]);
    
    const maxCanSend = useMemo(() => {
        if (!selectedGift) return 0;
        if (selectedGift.isFromBackpack) return selectedGift.ownedQuantity || 0;
        if (!selectedGift.price || selectedGift.price === 0) return 9999;
        return Math.floor(userDiamonds / selectedGift.price);
    }, [selectedGift, userDiamonds]);

    const handleSelectGift = (gift: Gift) => {
        if (isEditMode) return;
        setSelectedGift(gift);
        setQuantity(1);
    };

    const handleSend = async () => {
        if (isEditMode || !selectedGift || isSending) return;
        setIsSending(true);
        let sentSuccessfully = false;
        
        const action = selectedGift.isFromBackpack
            ? () => quantity > 0 && quantity <= (selectedGift.ownedQuantity || 0)
            : () => quantity > 0 && quantity * (selectedGift.price || 0) <= userDiamonds;

        if (action()) {
            const updatedUser = await onSendGift(selectedGift, quantity, targetUser.id);
            if (updatedUser) sentSuccessfully = true;
        } else if (!selectedGift.isFromBackpack) {
            onRecharge();
        }
    
        setIsSending(false);
        if (sentSuccessfully) {
            setSelectedGift(null);
            setQuantity(1);
            onClose();
        }
    };

    const canReorderCurrentTab = useMemo(() => ['Popular', 'Luxo', 'Atividade', 'VIP', 'Efeito'].includes(activeTab), [activeTab]);
    
    const handleDragSort = () => {
        if (!dragItem.current || !dragOverItem.current || !giftsByTab[activeTab as string]) return;
        const currentGifts = [...giftsByTab[activeTab as string]];
        const dragItemIndex = currentGifts.findIndex(g => g.id === dragItem.current!.id);
        const dragOverItemIndex = currentGifts.findIndex(g => g.id === dragOverItem.current!.id);
        if (dragItemIndex === -1 || dragOverItemIndex === -1 || dragItemIndex === dragOverItemIndex) return;
        
        const newGifts = [...currentGifts];
        const [draggedItem] = newGifts.splice(dragItemIndex, 1);
        newGifts.splice(dragOverItemIndex, 0, draggedItem);
    
        setGiftsByTab(prev => ({ ...prev, [activeTab as string]: newGifts }));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${activeTab}`, JSON.stringify(newGifts.map(g => g.id)));

        dragItem.current = null;
        dragOverItem.current = null;
    };
    
    const handleRestoreDefault = () => {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${activeTab}`);
        const defaultGiftsForTab = allGifts.filter(g => g.category === activeTab);
        setGiftsByTab(prev => ({ ...prev, [activeTab as string]: defaultGiftsForTab }));
    };

    const selectableUsers = useMemo(() => {
        const usersMap = new Map<string, User>();
        if (hostUser) usersMap.set(hostUser.id, hostUser);
        (onlineUsers || []).forEach(user => {
            if (user.id !== currentUser.id && !usersMap.has(user.id)) {
                usersMap.set(user.id, user);
            }
        });
        return Array.from(usersMap.values());
    }, [hostUser, onlineUsers, currentUser.id]);

    const TaskItem: React.FC<{ task: GiftTask }> = ({ task }) => {
        const progress = (task.current / task.total) * 100;
        const isCompleted = task.current >= task.total;
        const handleAction = () => {
            if (isCompleted) return;
            if (task.action === 'send' && task.giftName) {
                const giftToSend = allGifts.find(g => g.name === task.giftName);
                if (giftToSend) handleSelectGift(giftToSend);
            }
            if (task.action === 'chat') onClose();
        };

        return (
            <div className="bg-[#2C2C2E]/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="flex-1">
                    <p className="text-white font-bold text-xs">{task.title}</p>
                    <p className="text-purple-400 text-[10px] font-semibold">{task.reward}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        <span className="text-gray-400 text-[10px] font-mono">{task.current}/{task.total}</span>
                    </div>
                </div>
                <button onClick={handleAction} disabled={isCompleted} className={`text-xs font-black uppercase px-4 py-2 rounded-full transition-all whitespace-nowrap ${isCompleted ? 'bg-white/10 text-gray-500 cursor-default' : 'bg-purple-600 text-white active:scale-95'}`}>
                    {isCompleted ? 'Feito' : task.action === 'watch' ? 'Assistindo' : 'Ir'}
                </button>
            </div>
        );
    };

    return (
        <div className={`absolute inset-0 z-30 flex items-end ${isOpen ? '' : 'pointer-events-none'}`} onClick={onClose}>
            <div className={`bg-[#1C1C1E] w-full max-w-md h-[65%] rounded-t-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                <header className="flex-shrink-0 p-3">
                    <div className="flex justify-between items-center mb-2 relative text-center h-9">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {canReorderCurrentTab && <button onClick={() => setIsEditMode(!isEditMode)} className="text-sm font-semibold text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20">{isEditMode ? t('gifts.done') : t('gifts.reorder')}</button>}
                            {isEditMode && <button onClick={handleRestoreDefault} className="text-sm font-semibold text-gray-500 hover:text-white">Restaurar</button>}
                            {!isEditMode && onOpenSettings && <button onClick={() => { onClose(); onOpenSettings('NotifPresentes'); }} className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"><SettingsIcon className="w-4 h-4" /></button>}
                        </div>
                        <h2 className="text-base font-bold text-white mx-auto">{t('gifts.title')}</h2>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2"><div className="flex items-center space-x-2 bg-[#2C2C2E] p-1.5 rounded-full"><YellowDiamondIcon className="w-5 h-5 text-yellow-400" /><span className="text-white font-semibold text-sm">{userDiamonds.toLocaleString('pt-BR')}</span><button onClick={onRecharge} className="text-xs text-yellow-400 font-bold bg-yellow-400/20 px-2 py-0.5 rounded-full hover:bg-yellow-400/30">{t('gifts.recharge')}</button></div></div>
                    </div>
                    <div className="px-1 py-1 relative"><div className="bg-black/20 p-1.5 rounded-full flex items-center text-xs"><span className="text-gray-400 px-2 font-bold">Para:</span><div className="relative flex-1"><button onClick={() => setIsUserSelectorOpen(!isUserSelectorOpen)} className="bg-white/10 rounded-full w-full p-1.5 flex items-center justify-between text-left"><div className="flex items-center gap-2"><img src={targetUser.avatarUrl} className="w-5 h-5 rounded-full" alt={targetUser.name} /><span className="text-white font-bold text-xs">{targetUser.name}</span></div><ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isUserSelectorOpen ? 'rotate-180' : ''}`}/></button>{isUserSelectorOpen && <div className="absolute bottom-full mb-1 w-full bg-[#2C2C2E] rounded-lg max-h-48 overflow-y-auto border border-white/10 z-10 shadow-lg">{selectableUsers.map(user => <div key={user.id} onClick={() => { setTargetUser(user); setIsUserSelectorOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer"><img src={user.avatarUrl} className="w-8 h-8 rounded-full" alt={user.name} /><span className="text-white text-sm font-semibold">{user.name}</span>{user.id === targetUser.id && <CheckIcon className="w-4 h-4 text-purple-400 ml-auto" />}</div>)}</div>}</div></div></div>
                    <nav className="flex items-center space-x-4 border-b border-gray-700 mt-2">{giftCategories.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`text-sm font-semibold transition-colors relative py-2 ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}>{tab}{activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></div>}</button>)}</nav>
                </header>
                <main className="flex-grow overflow-y-auto p-2 no-scrollbar">
                    {isLoadingGifts ? <div className="flex items-center justify-center h-full"><LoadingSpinner /></div> : 
                    activeTab === 'Atividade' ? <div className="p-2 space-y-4">{!isEditMode && <div><h3 className="text-purple-300 text-sm font-bold mb-3 px-1">Tarefas Diárias de Atividade</h3><div className="space-y-2">{tasks.map(task => <TaskItem key={task.id} task={task} />)}</div></div>}<div><h3 className={`text-gray-400 text-sm font-bold px-1 ${isEditMode ? 'mb-3' : 'my-4 border-t border-white/10 pt-4'}`}>{isEditMode ? t('gifts.dragToReorder') : 'Presentes de Atividade'}</h3>{filteredGifts.length > 0 ? <div className="grid grid-cols-4 gap-2">{filteredGifts.map(gift => <GiftButton key={gift.id} gift={gift} isSelected={selectedGift?.id === gift.id} isEditMode={isEditMode} onSelect={handleSelectGift} onDragStart={handleDragSort} onDragEnter={handleDragSort} onDragEnd={handleDragSort} />)}</div> : <div className="text-center text-gray-600 text-xs py-8">Nenhum presente.</div>}</div></div> :
                    activeTab === 'Galeria' ? <div className="grid grid-cols-4 gap-2">{receivedGifts.map(gift => <div key={gift.name} className="relative flex flex-col items-center justify-center space-y-1 p-2 rounded-lg aspect-square"><div className="w-12 h-12 flex items-center justify-center">{gift.component ? gift.component : <span className="text-4xl">{gift.icon}</span>}</div><div className="h-8 w-full flex items-center justify-center px-1"><p className="text-xs text-white text-center line-clamp-2">{gift.name}</p></div><div className="flex items-center space-x-1"><span className="text-xs text-gray-400">x{gift.count}</span></div></div>)}</div> :
                    activeTab === 'Mochila' ? <div className="grid grid-cols-4 gap-2">{backpackGifts.map(gift => <GiftButton key={gift.id} gift={gift} isSelected={selectedGift?.id === gift.id} isEditMode={isEditMode} onSelect={handleSelectGift} />)}</div> :
                    <div className="grid grid-cols-4 gap-2">{filteredGifts.map(gift => <GiftButton key={gift.id} gift={gift} isSelected={selectedGift?.id === gift.id} isEditMode={isEditMode} onSelect={handleSelectGift} onDragStart={() => dragItem.current = gift} onDragEnter={() => dragOverItem.current = gift} onDragEnd={handleDragSort} onDragOver={e => e.preventDefault()} />)}</div>}
                </main>
                {isEditMode ? <div className="flex-shrink-0 p-4 border-t border-gray-700 text-center text-gray-400 text-sm">{t('gifts.dragToReorder')}</div> :
                <footer className="flex-shrink-0 p-3 border-t border-gray-700 flex flex-col space-y-3">
                    <div className="flex items-center justify-between"><div className="text-xs text-gray-400">{selectedGift ? t('gifts.canSend', { count: maxCanSend }) : t('gifts.selectGift')}</div><button onClick={handleSend} disabled={!selectedGift || quantity > maxCanSend || isSending} className="bg-purple-600 text-white font-bold px-8 py-2.5 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed">{isSending ? "Enviando..." : t('common.send')}</button></div>
                    <div className="grid grid-cols-6 gap-2">{presetQuantities.map(q => <button key={q} onClick={() => setQuantity(q)} className={`text-sm py-1 rounded-md transition-colors ${quantity === q ? 'bg-purple-500 text-white' : 'bg-[#2C2C2E] text-gray-300 hover:bg-gray-700/50'}`}>{q}</button>)}</div>
                </footer>}
            </div>
        </div>
    );
};

const GiftButton: React.FC<{gift: Gift, isSelected: boolean, isEditMode: boolean, onSelect: (g: Gift) => void, [key: string]: any}> = ({ gift, isSelected, isEditMode, onSelect, ...dragProps }) => (
    <button onClick={() => onSelect(gift)} draggable={isEditMode} {...dragProps} className={`relative flex flex-col items-center justify-center space-y-1 p-2 rounded-lg aspect-square transition-all bg-transparent hover:bg-gray-800/50 ${isEditMode ? 'cursor-move' : ''}`}>
        {gift.isLucky && <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg">SORTE</div>}
        {gift.isFromBackpack && <div className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-[#1C1C1E]">x{gift.ownedQuantity}</div>}
        <div className="w-12 h-12 flex items-center justify-center">{gift.component ? gift.component : <span className="text-4xl">{gift.icon}</span>}</div>
        <div className="h-8 w-full flex items-center justify-center px-1"><p className="text-xs text-white text-center line-clamp-2">{gift.name}</p></div>
        <div className="flex items-center space-x-1">
            {gift.isFromBackpack ? <span className="text-xs text-gray-400">Grátis</span> : <><YellowDiamondIcon className="w-3 h-3 text-yellow-400" /><span className="text-xs text-yellow-400">{gift.price}</span></>}
        </div>
        {isSelected && !isEditMode && <div className="absolute inset-0 bg-purple-600/60 rounded-lg flex items-center justify-center border-2 border-purple-400"><CheckIcon className="w-10 h-10 text-white" /></div>}
    </button>
);

export default GiftModal;