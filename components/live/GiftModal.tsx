import React, { useState } from 'react';
import DiamondIcon from '../icons/DiamondIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import PurchaseDiamondsModal from './PurchaseDiamondsModal';
import LevelGemIcon from '../icons/LevelGemIcon';

const gifts = [
  { name: 'Coração', price: 1, icon: '❤️' },
  { name: 'Rosa', price: 10, icon: '🌹' },
  { name: 'Batom', price: 25, icon: '💄' },
  { name: 'Sorvete', price: 50, icon: '🍦' },
  { name: 'Perfume', price: 75, icon: '🧴' },
  { name: 'Alvo', price: 100, icon: '🎯' },
  { name: 'Urso', price: 150, icon: '🧸' },
  { name: 'Boia', price: 200, icon: '🍩' },
  { name: 'Gema de Nível', price: 250, icon: <LevelGemIcon className="w-8 h-8" /> },
  { name: 'Coroa', price: 500, icon: '👑' },
  { name: 'Foguete', price: 1000, icon: '🚀' },
  { name: 'Anel', price: 2000, icon: '💍' },
  { name: 'Carro', price: 5000, icon: '🚗' },
  { name: 'Carrão', price: 10000, icon: '🏎️' },
  { name: 'Castelo', price: 20000, icon: '🏰' },
  { name: 'Helicóptero', price: 30000, icon: '🚁' },
  { name: 'Iate', price: 50000, icon: '⭐' },
  { name: 'Diamante', price: 100000, icon: '💎' },
  { name: 'Túmulo', price: 1, icon: '🪦' },
];


const quantities = [1, 10, 30, 66, 99];

interface GiftModalProps {
    onClose: () => void;
}

const GiftModal: React.FC<GiftModalProps> = ({ onClose }) => {
    const [selectedGift, setSelectedGift] = useState(gifts[0]);
    const [selectedQuantity, setSelectedQuantity] = useState(quantities[0]);
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);

    const handleGiftSelect = (gift: typeof gifts[0]) => {
        setSelectedGift(gift);
    };
    
    if (isPurchaseModalOpen) {
        return <PurchaseDiamondsModal onClose={() => setPurchaseModalOpen(false)} />;
    }

    return (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end z-20" onClick={onClose}>
            <div className="bg-[#1e1e1e] w-full rounded-t-2xl pt-4 text-white" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-4 gap-4 px-4 h-40 overflow-y-auto no-scrollbar">
                    {gifts.map(gift => (
                        <button
                            key={gift.name}
                            onClick={() => handleGiftSelect(gift)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${selectedGift.name === gift.name ? 'bg-purple-600/50 border border-purple-500' : gift.name === 'Gema de Nível' ? 'bg-gradient-to-br from-purple-500/70 to-pink-500/50' : 'bg-[#2d2d2d]'}`}
                        >
                            <span className="text-3xl flex items-center justify-center h-10">{gift.icon}</span>
                            <span className="text-xs mt-1">{gift.name}</span>
                            <div className="flex items-center space-x-1 mt-1">
                                <DiamondIcon className="w-3 h-3" />
                                <span className="text-xs font-semibold">{gift.price.toLocaleString('pt-BR')}</span>
                            </div>
                        </button>
                    ))}
                </div>
                
                <div className="px-4 py-3 border-t border-b border-gray-700 mt-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold text-gray-400">Quantidade</span>
                        <div className="flex items-center space-x-2">
                            {quantities.map(q => (
                                <button
                                    key={q}
                                    onClick={() => setSelectedQuantity(q)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold ${selectedQuantity === q ? 'bg-purple-600 text-white' : 'bg-[#3a3a3a] text-gray-300'}`}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#121212]">
                    <button onClick={() => setPurchaseModalOpen(true)} className="flex items-center space-x-2">
                         <DiamondIcon className="w-6 h-6" />
                         <span className="text-xl font-bold">50.000</span>
                         <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="bg-gray-600 text-white font-bold py-3 px-10 rounded-full">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GiftModal;