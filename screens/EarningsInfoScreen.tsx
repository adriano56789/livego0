
import React from 'react';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface EarningsInfoScreenProps {
    setActiveScreen: (screen: string) => void;
}

const EarningsInfoScreen: React.FC<EarningsInfoScreenProps> = ({ setActiveScreen }) => {
    return (
        <div className="bg-black min-h-screen text-white">
            <header className="p-4 flex items-center border-b border-gray-800">
                <button onClick={() => setActiveScreen('settings')} className="absolute" aria-label="Back to settings">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Informações de Ganhos
                </h1>
            </header>
            <main className="p-6 space-y-8">
                <h2 className="text-2xl font-bold">Nossa Política de "Ganhos"</h2>

                <div>
                    <h3 className="text-xl font-bold text-green-400">Conversão de Ganhos para Dinheiro</h3>
                    <p className="mt-2 text-gray-300 leading-relaxed">
                        A conversão dos seus "Ganhos" acumulados na plataforma para Reais (BRL) é <span className="font-bold text-white">totalmente gratuita</span>. Não há nenhuma taxa oculta neste processo. Seu saldo de Ganhos é convertido usando a taxa de câmbio atual da plataforma.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-yellow-400">Taxa de Saque</h3>
                    <p className="mt-2 text-gray-300 leading-relaxed">
                        Quando você solicita um saque, uma taxa de serviço é aplicada para cobrir os custos operacionais e de processamento de pagamento. A divisão é transparente:
                    </p>
                </div>

                <div className="bg-[#166534] bg-opacity-30 border border-green-700 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-green-400">80% para Você (Streamer)</h4>
                    <p className="mt-1 text-gray-300">A maior parte do valor é sua! Acreditamos em recompensar nossos criadores de conteúdo.</p>
                </div>

                <div className="bg-[#991b1b] bg-opacity-30 border border-red-700 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-red-500">20% para a Plataforma</h4>
                    <p className="mt-1 text-gray-300">Esta taxa nos ajuda a manter a plataforma segura, desenvolver novos recursos e oferecer suporte à comunidade.</p>
                </div>
            </main>
        </div>
    );
};

export default EarningsInfoScreen;
