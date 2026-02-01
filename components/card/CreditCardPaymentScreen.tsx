
import React, { useState } from 'react';
import { ChevronLeftIcon, LockIcon, CreditCardIcon, CheckIcon } from '../icons';
import { ToastType } from '../../types';
import { mercadoPagoService } from '@/services/mercadopago';
import { LoadingSpinner } from '@/components/Loading';

interface CreditCardPaymentScreenProps {
    packageDetails: { diamonds: number; price: number };
    onClose: () => void;
    addToast?: (type: ToastType, message: string) => void;
}

const CreditCardPaymentScreen: React.FC<CreditCardPaymentScreenProps> = ({ packageDetails, onClose, addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(value.substring(0, 19));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setExpiry(value.substring(0, 5));
    };

    const handleConfirmPayment = async () => {
        if (!cardNumber || !cardName || !expiry || !cvv) {
            addToast?.(ToastType.Error, "Preencha todos os campos do cartão.");
            return;
        }

        setIsLoading(true);
        addToast?.(ToastType.Info, "Iniciando processamento seguro...");

        try {
            // Chama o serviço do Mercado Pago para criar a preferência
            const { init_point } = await mercadoPagoService.createCardPreference(packageDetails);
            
            if (init_point) {
                // Redireciona para finalizar a transação
                window.location.href = init_point;
            } else {
                throw new Error("Não foi possível iniciar o pagamento.");
            }
        } catch (error) {
            console.error("Erro no pagamento:", error);
            addToast?.(ToastType.Error, (error as Error).message || "Erro no pagamento.");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[160] bg-[#121212] flex flex-col font-sans animate-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="flex items-center p-4 bg-[#121212] border-b border-white/5 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/5">
                    <ChevronLeftIcon className="text-white w-6 h-6" />
                </button>
                <h2 className="flex-1 text-center text-white text-base font-bold mr-4">Checkout</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-5 mb-8 text-black shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Valor Total</p>
                            <h3 className="text-3xl font-black tracking-tight">R$ {packageDetails.price.toFixed(2).replace('.', ',')}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-600 font-bold text-sm">
                                <CheckIcon className="w-4 h-4" />
                                <span>{packageDetails.diamonds.toLocaleString()} Diamantes Pack</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-2xl text-white">💎</span>
                        </div>
                    </div>
                </div>

                {/* Tabs / Method Indicator */}
                <div className="flex bg-[#2C2C2E] p-1 rounded-xl mb-6">
                    <button className="flex-1 py-2.5 bg-white text-black rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all">
                        <CreditCardIcon className="w-4 h-4" /> Cartão de Crédito
                    </button>
                    <button className="flex-1 py-2.5 text-gray-400 text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                        Pix
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <label className="text-white text-xs font-bold ml-1">Número do Cartão</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                maxLength={19}
                                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-4 pl-4 pr-10 outline-none focus:border-[#00E676] transition-colors placeholder-gray-600 font-mono"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                <LockIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-white text-xs font-bold ml-1">Nome do Titular</label>
                        <input 
                            type="text" 
                            placeholder="Como escrito no cartão"
                            value={cardName}
                            onChange={e => setCardName(e.target.value.toUpperCase())}
                            className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-4 outline-none focus:border-[#00E676] transition-colors placeholder-gray-600 uppercase"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-white text-xs font-bold ml-1">Validade</label>
                            <input 
                                type="text" 
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={handleExpiryChange}
                                maxLength={5}
                                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-4 outline-none focus:border-[#00E676] transition-colors placeholder-gray-600 text-center"
                            />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <label className="text-white text-xs font-bold ml-1 flex justify-between">CVV</label>
                            <input 
                                type="password" 
                                placeholder="123"
                                value={cvv}
                                onChange={e => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                maxLength={4}
                                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-4 outline-none focus:border-[#00E676] transition-colors placeholder-gray-600 text-center tracking-widest"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center py-4 gap-3 opacity-50">
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><LockIcon className="w-3 h-3"/> SSL SECURE</span>
                    </div>

                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-[#121212] border-t border-white/5 safe-area-bottom">
                <button 
                    onClick={handleConfirmPayment}
                    disabled={isLoading}
                    className="w-full bg-[#00E676] hover:bg-[#00C853] text-black font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner /> : (
                        <>
                            Confirmar Compra <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                        </>
                    )}
                </button>
                <p className="text-gray-600 text-[10px] text-center mt-3">
                    Ao confirmar, você concorda com nossos Termos de Serviço.
                </p>
            </div>
        </div>
    );
};

export default CreditCardPaymentScreen;
