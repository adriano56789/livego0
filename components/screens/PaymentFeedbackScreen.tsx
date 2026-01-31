import React, { useEffect, useState } from 'react';
import { CheckIcon, CloseIcon, ClockIcon } from '../icons';
import { LoadingSpinner } from '../Loading';

const PaymentFeedbackScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'failure' | 'pending'>('loading');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('status');
        
        if (paymentStatus === 'approved') {
            setStatus('success');
        } else if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
            setStatus('pending');
        } else {
            setStatus('failure');
        }
    }, []);

    const StatusDisplay = () => {
        switch(status) {
            case 'success':
                return {
                    icon: <CheckIcon className="w-12 h-12 text-green-400" />,
                    title: "Pagamento Aprovado!",
                    message: "Seus diamantes serão creditados em instantes. Verifique seu saldo."
                };
            case 'failure':
                return {
                    icon: <CloseIcon className="w-12 h-12 text-red-400" />,
                    title: "Pagamento Falhou",
                    message: "Não foi possível processar seu pagamento. Por favor, tente novamente."
                };
            case 'pending':
                return {
                    icon: <ClockIcon className="w-12 h-12 text-yellow-400" />,
                    title: "Pagamento Pendente",
                    message: "Seu pagamento está sendo processado. Você será notificado quando for aprovado."
                };
            default:
                return {
                    icon: <LoadingSpinner />,
                    title: "Verificando Pagamento...",
                    message: "Aguarde um momento enquanto confirmamos o status da sua transação."
                };
        }
    };

    const { icon, title, message } = StatusDisplay();

    return (
        <div className="fixed inset-0 z-[200] bg-[#121212] flex flex-col items-center justify-center text-center p-8 font-sans">
            <div className="mb-8">{icon}</div>
            <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
            <p className="text-gray-400 text-sm mb-12">{message}</p>
            <button
                onClick={onClose}
                className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full"
            >
                Voltar para o App
            </button>
        </div>
    );
};

export default PaymentFeedbackScreen;
