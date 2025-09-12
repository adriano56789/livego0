
import React, { useState } from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';
import PixIcon from '../components/PixIcon';
import MercadoPagoIcon from '../components/MercadoPagoIcon';
import CheckCircleIcon from '../components/CheckCircleIcon';

interface WithdrawMethodScreenProps {
    setActiveScreen: (screen: string) => void;
}

type PaymentMethod = 'pix' | 'mercado-pago';

const WithdrawMethodScreen: React.FC<WithdrawMethodScreenProps> = ({ setActiveScreen }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix');

    const MethodButton: React.FC<{ method: PaymentMethod; label: string; icon: React.ReactNode; bgColor: string }> = ({ method, label, icon, bgColor }) => {
        const isSelected = selectedMethod === method;
        return (
            <button
                onClick={() => setSelectedMethod(method)}
                className={`relative flex-1 bg-[#1e1e1e] rounded-lg p-4 flex flex-col items-center justify-center space-y-2 border-2 transition-colors
                    ${isSelected ? 'border-green-500' : 'border-[#1e1e1e]'}`}
                aria-pressed={isSelected}
            >
                {isSelected && <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${bgColor}`}>
                    {icon}
                </div>
                <span className="font-semibold text-lg">{label}</span>
            </button>
        );
    };

    return (
        <div className="bg-[#121212] h-full text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('wallet')} className="absolute" aria-label="Go back to wallet">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Configurar Método de Saque
                </h1>
            </header>

            <main className="flex-grow p-6 space-y-8 overflow-y-auto no-scrollbar">
                <div>
                    <p className="text-gray-300">Selecione como você gostaria de receber seu dinheiro.</p>
                    <div className="flex items-center space-x-4 mt-4">
                        <MethodButton method="pix" label="PIX" icon={<PixIcon />} bgColor="bg-[#1A2A22]" />
                        <MethodButton method="mercado-pago" label="Mercado Pago" icon={<MercadoPagoIcon />} bgColor="bg-[#009EE3]" />
                    </div>
                </div>

                {selectedMethod === 'pix' ? (
                    <div>
                        <label htmlFor="pix-key" className="font-semibold text-gray-300">Chave PIX</label>
                        <input
                            id="pix-key"
                            type="text"
                            placeholder="CPF, e-mail ou telefone"
                            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 mt-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="mp-email" className="font-semibold text-gray-300">E-Mail</label>
                        <input
                            id="mp-email"
                            type="email"
                            placeholder="E-mail da conta Mercado Pago"
                            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 mt-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                )}
            </main>

            <footer className="p-6">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-colors text-lg">
                    Salvar
                </button>
            </footer>
        </div>
    );
};

export default WithdrawMethodScreen;
