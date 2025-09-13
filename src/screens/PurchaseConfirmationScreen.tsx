
import React, { useState } from 'react';
import DiamondIcon from '../components/DiamondIcon';
import BankIcon from '../components/BankIcon';
import CreditCardIcon from '../components/CreditCardIcon';
import EditIcon from '../components/EditIcon';
import ChevronLeftIcon from '../components/ChevronLeftIcon';

interface PurchaseConfirmationScreenProps {
    onClose: () => void;
    packageInfo: {
        amount: number;
        price: number;
    };
}

const FormInput: React.FC<{
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    name: string;
}> = ({ label, value, onChange, placeholder, className, name }) => (
    <div className={`flex flex-col ${className}`}>
        {label && <label htmlFor={name} className="text-sm text-gray-400 mb-1.5">{label}</label>}
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-[#2d2d2d] border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
        />
    </div>
);

const InfoRow: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
    </div>
);

const PurchaseConfirmationScreen: React.FC<PurchaseConfirmationScreenProps> = ({ onClose, packageInfo }) => {
    const [activeTab, setActiveTab] = useState<'transferencia' | 'cartao'>('transferencia');
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const [isCardSaved, setIsCardSaved] = useState(false);
    const [isPaymentInfoSaved, setIsPaymentInfoSaved] = useState(true);
    const [isEditingPayment, setIsEditingPayment] = useState(false);

    const [paymentInfo, setPaymentInfo] = useState({
        bank: 'Banco do Brasil (001)',
        agency: '1234-5',
        cnpj: '123.***.***-00',
        holder: 'LiveGo Pagamentos Ltda.',
    });
    
    const [editablePaymentInfo, setEditablePaymentInfo] = useState(paymentInfo);

    const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvc: '' });
    const [addressInfo, setAddressInfo] = useState({ street: '', number: '', neighborhood: '', city: '', zip: '' });

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSavePayment = () => {
        setPaymentInfo(editablePaymentInfo);
        setIsEditingPayment(false);
        setIsPaymentInfoSaved(true);
    };
    
    const handleCancelEditPayment = () => {
        setEditablePaymentInfo(paymentInfo);
        setIsEditingPayment(false);
    }

    const canConfirmPurchase = (activeTab === 'transferencia' && isAddressSaved && isPaymentInfoSaved) || (activeTab === 'cartao' && isAddressSaved && isCardSaved);

    return (
        <div className="fixed inset-0 bg-[#121212] text-white flex flex-col z-50">
            <header className="p-4 flex items-center border-b border-gray-800 flex-shrink-0">
                <button onClick={onClose} className="absolute" aria-label="Close purchase screen">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold">
                    Confirmar compra
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                <div className="bg-[#1e1e1e] rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <DiamondIcon className="w-8 h-8"/>
                        <div>
                            <h2 className="font-semibold text-lg">{packageInfo.amount.toLocaleString('pt-BR')} Diamantes</h2>
                            <p className="text-sm text-gray-400">Pacote Selecionado</p>
                        </div>
                    </div>
                    <div className="space-y-1 mt-3 pt-3 border-t border-gray-700/50">
                        <InfoRow label="Valor do Pacote" value={`R$ ${packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                        <InfoRow label="Taxas" value="R$ 0,00" />
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 mt-2 border-t border-gray-700/50">
                        <span>Total a Pagar</span>
                        <span>R$ {packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
                
                <div className="bg-[#1e1e1e] rounded-xl p-4 space-y-4">
                    <div className="flex bg-[#121212] rounded-full p-1">
                        <button 
                            onClick={() => setActiveTab('transferencia')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-colors font-semibold ${activeTab === 'transferencia' ? 'bg-[#2d2d2d]' : 'text-gray-400'}`}
                        >
                            <BankIcon className="w-5 h-5"/>
                            <span>Transferência</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('cartao')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-full transition-colors font-semibold ${activeTab === 'cartao' ? 'bg-[#2d2d2d]' : 'text-gray-400'}`}
                        >
                            <CreditCardIcon className="w-5 h-5"/>
                            <span>Cartão de Crédito</span>
                        </button>
                    </div>

                    {activeTab === 'transferencia' && (
                        <div className="pt-2 space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-green-400 flex items-center space-x-2">
                                    <BankIcon className="w-5 h-5"/>
                                    <span>Informações para Pagamento</span>
                                </h3>
                                {!isEditingPayment && (
                                    <button onClick={() => { setIsEditingPayment(true); setIsPaymentInfoSaved(false); }} className="flex items-center space-x-1 text-gray-400 hover:text-white">
                                        <EditIcon className="w-4 h-4 "/>
                                        <span>Editar</span>
                                    </button>
                                )}
                            </div>
                            {isEditingPayment ? (
                                <div className="space-y-3">
                                    <FormInput name="bank" label="Banco" value={editablePaymentInfo.bank} onChange={handleInputChange(setEditablePaymentInfo)} />
                                    <FormInput name="agency" label="Agência" value={editablePaymentInfo.agency} onChange={handleInputChange(setEditablePaymentInfo)} />
                                    <FormInput name="cnpj" label="CPF/CNPJ" value={editablePaymentInfo.cnpj} onChange={handleInputChange(setEditablePaymentInfo)} />
                                    <FormInput name="holder" label="Titular" value={editablePaymentInfo.holder} onChange={handleInputChange(setEditablePaymentInfo)} />
                                    <div className="flex space-x-3 pt-2">
                                        <button onClick={handleCancelEditPayment} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-full text-sm">Cancelar</button>
                                        <button onClick={handleSavePayment} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-full text-sm">Salvar</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm space-y-1 border-t border-gray-700/50 pt-2">
                                    <InfoRow label="Banco" value={paymentInfo.bank} />
                                    <InfoRow label="Agência" value={paymentInfo.agency} />
                                    <InfoRow label="Conta Corrente" value="*****_0" />
                                    <InfoRow label="CPF/CNPJ" value={paymentInfo.cnpj} />
                                    <InfoRow label="Titular" value={paymentInfo.holder} />
                                </div>
                            )}
                            <p className="text-xs text-gray-400 text-center px-4 pt-2">
                                Após a transferência, envie o comprovante para o suporte para creditarmos seus diamantes.
                            </p>
                        </div>
                    )}

                    {activeTab === 'cartao' && (
                        <div className="pt-2 space-y-3">
                            <h3 className="font-semibold">Detalhes do Cartão</h3>
                            <FormInput name="number" placeholder="Número do cartão" value={cardInfo.number} onChange={handleInputChange(setCardInfo)} />
                            <FormInput name="name" placeholder="Nome no Cartão" value={cardInfo.name} onChange={handleInputChange(setCardInfo)} />
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput name="expiry" placeholder="MM/AA" value={cardInfo.expiry} onChange={handleInputChange(setCardInfo)} />
                                <FormInput name="cvc" placeholder="CVC" value={cardInfo.cvc} onChange={handleInputChange(setCardInfo)} />
                            </div>
                             <div className="flex space-x-3 pt-2">
                                <button onClick={() => { setCardInfo({ number: '', name: '', expiry: '', cvc: '' }); setIsCardSaved(false); }} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-full text-sm">Cancelar</button>
                                <button onClick={() => setIsCardSaved(true)} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-full text-sm">Salvar Cartão</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[#1e1e1e] rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold">Endereço de Cobrança (Obrigatório)</h3>
                    <div className="grid grid-cols-5 gap-3">
                      <FormInput name="street" placeholder="Rua" value={addressInfo.street} onChange={handleInputChange(setAddressInfo)} className="col-span-4" />
                      <FormInput name="number" placeholder="Nº" value={addressInfo.number} onChange={handleInputChange(setAddressInfo)} className="col-span-1" />
                    </div>
                    <FormInput name="neighborhood" placeholder="Bairro" value={addressInfo.neighborhood} onChange={handleInputChange(setAddressInfo)} />
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput name="city" placeholder="Cidade" value={addressInfo.city} onChange={handleInputChange(setAddressInfo)} />
                        <FormInput name="zip" placeholder="CEP" value={addressInfo.zip} onChange={handleInputChange(setAddressInfo)} />
                    </div>
                    <div className="flex space-x-3 pt-2">
                        <button onClick={() => { setAddressInfo({ street: '', number: '', neighborhood: '', city: '', zip: '' }); setIsAddressSaved(false); }} className="flex-1 bg-gray-600 hover:bg-gray-500 font-bold py-3 rounded-full text-sm">Cancelar</button>
                        <button onClick={() => setIsAddressSaved(true)} className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-3 rounded-full text-sm">Salvar Endereço</button>
                    </div>
                </div>
            </main>
            
            <footer className="p-4 space-y-3 border-t border-gray-800 bg-[#121212] flex-shrink-0">
                {!canConfirmPurchase && (
                    <p className="text-yellow-500 text-xs text-center font-semibold">
                        Por favor, salve os detalhes obrigatórios de cada seção para continuar.
                    </p>
                )}
                <button
                    disabled={!canConfirmPurchase}
                    className="w-full font-bold py-3.5 rounded-full text-lg transition-colors disabled:bg-[#2d2d2d] disabled:text-gray-500 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white"
                >
                    Confirmar Compra (R$ {packageInfo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </button>
            </footer>
        </div>
    );
};

export default PurchaseConfirmationScreen;
