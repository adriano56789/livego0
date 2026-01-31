
import React from 'react';
import { ChevronLeftIcon, SolidDiamondIcon, PixIcon } from './icons';
import { ToastType } from '../types';
import { CreditCardIcon } from 'lucide-react';

interface ConfirmPurchaseScreenProps {
    packageDetails: { diamonds: number; price: number };
    onClose: () => void;
    onSelectCreditCard: () => void;
    onSelectPix: () => void;
    addToast?: (type: ToastType, message: string) => void;
}

const ConfirmPurchaseScreen: React.FC<ConfirmPurchaseScreenProps> = ({ packageDetails, onClose, onSelectCreditCard, onSelectPix }) => {
    return (
        <div className="fixed inset-0 z-[150] bg-[#121212] flex flex-col font-sans animate-in slide-in-from-right duration-300">
            <header className="flex items-center p-4 bg-[#121212] border-b border-white/5 shrink-0 z-10">
                <button onClick={onClose} className="p-1 -ml-2">
                    <ChevronLeftIcon className="text-white w-6 h-6" />
                </button>
                <h2 className="flex-1 text-center text-white text-base font-bold mr-4">Finalizar Compra</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <SolidDiamondIcon className="w-8 h-8 text-[#FFC107]" />
                        <div>
                            <span className="text-white font-bold text-base">{packageDetails.diamonds.toLocaleString('pt-BR')} Diamantes</span>
                            <span className="text-gray-400 text-xs block">Pacote Selecionado</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between text-lg pt-3 border-t border-white/10 mt-3">
                        <span className="text-gray-300 font-medium">Total a Pagar</span>
                        <span className="text-white font-bold">R$ {packageDetails.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-gray-400 text-sm font-bold px-2">Escolha o método de pagamento:</h3>
                    
                    <button 
                        onClick={onSelectCreditCard}
                        className="w-full bg-[#2C2C2E] p-5 rounded-2xl flex items-center gap-4 text-left hover:bg-[#3a3a3c] transition-colors border border-white/5"
                    >
                        <CreditCardIcon className="w-8 h-8 text-blue-400" />
                        <div>
                            <span className="text-white font-bold">Cartão de Crédito</span>
                            <span className="text-gray-400 text-xs block">Pague com segurança via Mercado Pago.</span>
                        </div>
                    </button>
                    
                    <button 
                        onClick={onSelectPix}
                        className="w-full bg-[#2C2C2E] p-5 rounded-2xl flex items-center gap-4 text-left hover:bg-[#3a3a3c] transition-colors border border-white/5"
                    >
                        <PixIcon className="w-8 h-8" />
                         <div>
                            <span className="text-white font-bold">PIX</span>
                            <span className="text-gray-400 text-xs block">Pagamento instantâneo com QR Code.</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPurchaseScreen;
