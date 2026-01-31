
import { api } from './api';

interface ItemDetails {
    diamonds: number;
    price: number;
}

const createCardPreference = async (item: ItemDetails): Promise<{ preferenceId: string, init_point: string }> => {
    console.log('[MercadoPago Service] Criando preferência de cartão...');
    const response = await api.mercadopago.createCardPreference(item);
    console.log('[MercadoPago Service] Preferência de cartão criada:', response.preferenceId);
    return response;
};

const createPixPayment = async (item: ItemDetails): Promise<{ qrCodeBase64: string, qrCode: string, paymentId: string, expiresAt: string }> => {
    console.log('[MercadoPago Service] Criando pagamento PIX...');
    const response = await api.mercadopago.createPixPayment(item);
    console.log('[MercadoPago Service] Pagamento PIX criado:', response.paymentId);
    return response;
};

export const mercadoPagoService = {
    createCardPreference,
    createPixPayment,
};
