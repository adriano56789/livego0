
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, CopyIcon, CheckIcon, ClockIcon } from '../icons';
import { LoadingSpinner } from '../Loading';
import { mercadoPagoService } from '../../services/mercadopago';
import { ToastType } from '../../types';
import { webSocketManager } from '../../services/websocket';

interface PixPaymentScreenProps {
    packageDetails: { diamonds: number; price: number };
    onClose: () => void;
    addToast?: (type: ToastType, message: string) => void;
}

const PixPaymentScreen: React.FC<PixPaymentScreenProps> = ({ packageDetails, onClose, addToast }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [pixData, setPixData] = useState<{ qrCodeBase64: string; qrCode: string; expiresAt: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isPaid, setIsPaid] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const createPix = async () => {
            setIsLoading(true);
            try {
                const data = await mercadoPagoService.createPixPayment(packageDetails);
                setPixData(data);
                const expiration = new Date(data.expiresAt).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.floor((expiration - now) / 1000));
            } catch (error) {
                addToast?.(ToastType.Error, (error as Error).message || 'Falha ao gerar PIX.');
                onClose();
            } finally {
                setIsLoading(false);
            }
        };
        createPix();
    }, [packageDetails, addToast, onClose]);

    useEffect(() => {
        if (pixData && !isPaid) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [pixData, isPaid]);

    useEffect(() => {
        const handlePaymentSuccess = () => {
            setIsPaid(true);
            addToast?.(ToastType.Success, 'Pagamento confirmado!');
            setTimeout(onClose, 3000); // Close modal after 3 seconds
        };
        webSocketManager.on('payment:success', handlePaymentSuccess);
        return () => {
            webSocketManager.off('payment:success', handlePaymentSuccess);
        };
    }, [addToast, onClose]);

    const handleCopyToClipboard = () => {
        if (pixData?.qrCode) {
            navigator.clipboard.writeText(pixData.qrCode);
            addToast?.(ToastType.Info, 'Código PIX copiado!');
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[160] bg-[#121212] flex flex-col font-sans animate-in slide-in-from-right duration-300">
            <header className="flex items-center p-4 bg-[#121212] border-b border-white/5 shrink-0">
                <button onClick={onClose} className="p-1 -ml-2"><ChevronLeftIcon className="text-white w-6 h-6" /></button>
                <h2 className="flex-1 text-center text-white text-base font-bold mr-4">Pagar com PIX</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                {isLoading ? <LoadingSpinner /> : isPaid ? (
                    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-4 border-green-500/20">
                            <CheckIcon className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-400">Pagamento Aprovado!</h3>
                        <p className="text-gray-400 text-sm">Seus diamantes já foram adicionados. A janela fechará em breve.</p>
                    </div>
                ) : pixData ? (
                    <div className="w-full max-w-sm flex flex-col items-center">
                        <p className="text-gray-300 text-sm mb-4">Escaneie o QR Code abaixo com seu app do banco:</p>
                        <div className="bg-white p-4 rounded-2xl border-4 border-white/50 shadow-2xl mb-6">
                            <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="PIX QR Code" className="w-48 h-48" />
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400 mb-6">
                            <ClockIcon className="w-5 h-5" />
                            <span className="font-mono text-lg font-bold">Expira em: {formatTime(timeLeft)}</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">Ou use o PIX Copia e Cola:</p>
                        <button onClick={handleCopyToClipboard} className="w-full bg-[#2C2C2E] p-4 rounded-xl text-xs text-gray-300 break-all text-left relative hover:bg-[#3a3a3c] transition-colors">
                            {pixData.qrCode}
                            <div className="absolute top-2 right-2 p-2 bg-black/30 rounded-full">
                                <CopyIcon className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    </div>
                ) : <p className="text-red-400">Não foi possível gerar o código PIX.</p>}
            </div>
        </div>
    );
};

export default PixPaymentScreen;
