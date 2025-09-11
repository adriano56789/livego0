
import React, { useState } from 'react';
import DiamondIcon from '../components/icons/DiamondIcon';
import BankIcon from '../components/icons/BankIcon';
import CreditCardIcon from '../components/icons/CreditCardIcon';
import EditIcon from '../components/icons/EditIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';

interface PurchaseConfirmationScreenProps {
    onBack: () => void;
    packageInfo: {
        amount: number;
        price: number;
    };
}

const InputField: React.FC<{ 
    label: string; 
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string; 
    className?: string;
    name: string;
}> = ({ label, value, onChange, placeholder, className, name }) => (
    <div className={`flex flex-col ${className}`}>
        <label htmlFor={name} className="text-sm text-gray-400 mb-1">{label}</label>
        <input 
            type="text" 
            id={name} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-[#2d2d2d] rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    </div>
);

const PurchaseConfirmationScreen: React.FC<PurchaseConfirmationScreenProps> = ({ onBack, packageInfo }) => {
    const [activeTab, setActiveTab] = useState<'transferencia' | 'cartao'>('transferencia');
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const [isCardSaved, setIsCardSaved] = useState(false);
    const [isPaymentInfoSaved, setIsPaymentInfoSaved] = useState(true);
    const [isEditingPayment, setIsEditingPayment] = useState(false);

    const [paymentInfo, setPaymentInfo] = useState({
        bank: 'Banco do Brasil (001)',
        agency: '1234-5',
        account: '12345-6',
        cnpj: '123.***.***-00',
        holder: 'LiveGo Pagamentos Ltda.',
    });

    const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvc: '' });
    const [addressInfo, setAddressInfo] = useState({ street: '', number: '', neighborhood: '', city: '', zip: '' });

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSavePayment = () => {
        setIsEditingPayment(false);
        setIsPaymentInfoSaved(true);
    };

    const canConfirmPurchase = (activeTab === 'transferencia' && isAddressSaved && isPaymentInfoSaved) || (activeTab === 'cartao' && isAddressSaved && isCardSaved);

    return (
        <div className="bg-[#121212] absolute inset-0 text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800 flex-shrink-0">
                <button onClick={onBack} className="absolute" aria-label="Back to wallet">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Confirmar compra
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <main className="p-6 space-y-6">
                    {/* Package Info */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <DiamondIcon className="w-8 h-8"/>
                            <div>
                                <h2 className="font-semibold">{packageInfo.amount.toLocaleString('pt-BR')} Diamantes</h2>
                                <p className="text-sm text-gray-400">Pacote Selecionado</p>
                            </div>
                        </div>
                        <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Valor do Pacote</span>
                                <span>R$ {packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Taxas</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-600 mt-2">
                                <span>Total a Pagar</span>
                                <span>R$ {packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Tabs */}
                    <div className="flex bg-[#1e1e1e] rounded-lg p-1">
                        <button 
                            onClick={() => setActiveTab('transferencia')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${activeTab === 'transferencia' ? 'bg-[#2d2d2d]' : ''}`}
                        >
                            <BankIcon className="w-5 h-5"/>
                            <span className="font-semibold">Transferência</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('cartao')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${activeTab === 'cartao' ? 'bg-[#2d2d2d]' : ''}`}
                        >
                            <CreditCardIcon className="w-5 h-5"/>
                            <span className="font-semibold">Cartão de Crédito</span>
                        </button>
                    </div>

                    {/* Payment Details */}
                    {activeTab === 'transferencia' ? (
                        <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-green-400">Informações para Pagamento</h3>
                                <button onClick={() => { setIsEditingPayment(prev => !prev); setIsPaymentInfoSaved(false); }}>
                                    <EditIcon className="w-4 h-4 text-gray-400"/>
                                </button>
                            </div>
                            {isEditingPayment ? (
                                <div className="space-y-3">
                                    <InputField name="bank" label="Banco" value={paymentInfo.bank} onChange={handleInputChange(setPaymentInfo)} />
                                    <InputField name="agency" label="Agência" value={paymentInfo.agency} onChange={handleInputChange(setPaymentInfo)} />
                                    <InputField name="account" label="Conta Corrente" value={paymentInfo.account} onChange={handleInputChange(setPaymentInfo)} />
                                    <InputField name="cnpj" label="CPF/CNPJ" value={paymentInfo.cnpj} onChange={handleInputChange(setPaymentInfo)} />
                                    <InputField name="holder" label="Titular" value={paymentInfo.holder} onChange={handleInputChange(setPaymentInfo)} />
                                    <div className="flex space-x-4 pt-2">
                                        <button onClick={() => setIsEditingPayment(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-lg">Cancelar</button>
                                        <button onClick={handleSavePayment} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-lg">Salvar</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between"><span className="text-gray-400">Banco</span><span>{paymentInfo.bank}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400">Agência</span><span>{paymentInfo.agency}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400">Conta Corrente</span><span>{paymentInfo.account}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400">CPF/CNPJ</span><span>{paymentInfo.cnpj}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400">Titular</span><span>{paymentInfo.holder}</span></div>
                                </div>
                            )}
                            <p className="text-xs text-gray-400 pt-2 border-t border-gray-600 mt-2">
                                Após a transferência, envie o comprovante para o suporte para creditarmos seus diamantes.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-4">
                            <h3 className="font-semibold">Detalhes do Cartão</h3>
                            <InputField name="number" label="Número do cartão" value={cardInfo.number} onChange={handleInputChange(setCardInfo)} />
                            <InputField name="name" label="Nome no Cartão" value={cardInfo.name} onChange={handleInputChange(setCardInfo)} />
                            <div className="flex space-x-4">
                                <InputField name="expiry" label="MM/AA" className="flex-1" value={cardInfo.expiry} onChange={handleInputChange(setCardInfo)} />
                                <InputField name="cvc" label="CVC" className="flex-1" value={cardInfo.cvc} onChange={handleInputChange(setCardInfo)} />
                            </div>
                            <div className="flex space-x-4">
                                <button onClick={() => setIsCardSaved(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-lg">Cancelar</button>
                                <button onClick={() => setIsCardSaved(true)} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-lg">Salvar Cartão</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Billing Address */}
                    <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold">Endereço de Cobrança (Obrigatório)</h3>
                        <div className="flex space-x-4">
                            <InputField name="street" label="Rua" className="flex-grow" value={addressInfo.street} onChange={handleInputChange(setAddressInfo)} />
                            <InputField name="number" label="Nº" className="w-20" value={addressInfo.number} onChange={handleInputChange(setAddressInfo)} />
                        </div>
                        <InputField name="neighborhood" label="Bairro" value={addressInfo.neighborhood} onChange={handleInputChange(setAddressInfo)} />
                        <div className="flex space-x-4">
                            <InputField name="city" label="Cidade" className="flex-grow" value={addressInfo.city} onChange={handleInputChange(setAddressInfo)} />
                            <InputField name="zip" label="CEP" className="w-32" value={addressInfo.zip} onChange={handleInputChange(setAddressInfo)} />
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => setIsAddressSaved(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-lg">Cancelar</button>
                            <button onClick={() => setIsAddressSaved(true)} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-lg">Salvar Endereço</button>
                        </div>
                    </div>
                </main>
                <footer className="p-6 space-y-3 border-t border-gray-700 bg-[#121212]">
                    {!canConfirmPurchase && (
                        <p className="text-center text-yellow-500 text-sm font-semibold">
                            Por favor, salve os detalhes obrigatórios de cada seção para continuar.
                        </p>
                    )}
                    <button 
                        disabled={!canConfirmPurchase}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-colors text-lg disabled:bg-[#2d2d2d] disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        Confirmar Compra (R$ {packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PurchaseConfirmationScreen;
