import { TransactionModel } from '../models/Transaction.js';
import { UserModel } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const mercadoPagoController = {
    // Mantém a preferência de cartão (Checkout Pro) caso necessário, mas foca no Pix abaixo
    createCardPreference: async (req, res) => {
        try {
            const { details } = req.body;
            const { diamonds, price } = details;
            const userId = req.userId;
            if (!userId || !diamonds || typeof price === 'undefined') {
                return sendError(res, "Dados da preferência inválidos.", 400);
            }
            const internalTransactionId = `pref-${Date.now()}-${userId}`;
            await TransactionModel.create({
                id: internalTransactionId,
                userId: userId,
                type: 'recharge',
                amountDiamonds: diamonds,
                amountBRL: price,
                status: 'pending',
                details: { method: 'mercadopago_card' }
            });
            const preference = {
                items: [{ title: `${diamonds.toLocaleString('pt-BR')} Diamantes`, quantity: 1, currency_id: 'BRL', unit_price: price }],
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment-feedback?status=approved`,
                    failure: `${process.env.FRONTEND_URL}/payment-feedback?status=failure`,
                    pending: `${process.env.FRONTEND_URL}/payment-feedback?status=pending`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
                external_reference: internalTransactionId,
            };
            const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
                },
                body: JSON.stringify(preference)
            });
            const data = await mpResponse.json();
            if (!mpResponse.ok)
                throw new Error(data.message || 'Falha ao criar preferência de pagamento.');
            return sendSuccess(res, { preferenceId: data.id, init_point: data.init_point });
        }
        catch (err) {
            console.error("[MercadoPago Card] Erro:", err);
            return sendError(res, "Falha ao criar preferência de pagamento.");
        }
    },
    // IMPLEMENTAÇÃO DE PIX DIRETO (SERVER-SIDE)
    createPixPayment: async (req, res) => {
        try {
            const { details } = req.body;
            const { diamonds, price } = details;
            const userId = req.userId;
            // 1. Validar Usuário e Dados
            const user = await UserModel.findOne({ id: userId });
            if (!user || !diamonds || !price) {
                return sendError(res, "Dados de pagamento inválidos.", 400);
            }
            const numericPrice = Number(price);
            const internalTransactionId = `pix-${Date.now()}-${userId}`;
            // 2. Sanitização de E-mail (CRÍTICO PARA PRODUÇÃO)
            // O Mercado Pago bloqueia pagamentos onde payer.email == merchant.email (auto-financiamento).
            // Se o usuário logado tiver o mesmo e-mail da conta MP, usamos um alias.
            let payerEmail = user.email && user.email.includes('@') ? user.email.trim().toLowerCase() : `user.${userId}@livego.client`;
            // Fallback de segurança simples para evitar erro de "payer cannot be the same as collector"
            if (payerEmail.includes('adrianomdk5')) { // Exemplo: seu e-mail de admin
                payerEmail = `customer.${userId}.${Date.now()}@temp-mail.com`;
            }
            const rawName = user.name || 'Usuario LiveGo';
            const [firstName, ...lastNameParts] = rawName.trim().split(' ');
            const lastName = lastNameParts.join(' ') || 'Cliente';
            // 3. Montar Payload do Pagamento V1
            const paymentData = {
                transaction_amount: numericPrice,
                description: `Recarga ${diamonds} Diamantes`,
                payment_method_id: 'pix',
                payer: {
                    email: payerEmail,
                    first_name: firstName.substring(0, 30),
                    last_name: lastName.substring(0, 30)
                },
                notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
                external_reference: internalTransactionId,
                date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
            };
            console.log(`[MercadoPago PIX] Criando Tx: ${internalTransactionId} | Valor: ${numericPrice}`);
            // 4. Chamada Direta à API V1 (SEM OAUTH, SEM FRONTEND)
            const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Token APP_USR de Produção
                    'X-Idempotency-Key': internalTransactionId
                },
                body: JSON.stringify(paymentData)
            });
            const data = await mpResponse.json();
            if (!mpResponse.ok) {
                console.error("[MercadoPago PIX] Erro API:", JSON.stringify(data, null, 2));
                const msg = data.message || (data.cause && data.cause[0]?.description) || 'Recusado pelo gateway.';
                return sendError(res, `Erro MP: ${msg}`, 400);
            }
            // 5. Salvar Transação no Banco Local
            await TransactionModel.create({
                id: internalTransactionId,
                userId: userId,
                type: 'recharge',
                amountDiamonds: diamonds,
                amountBRL: numericPrice,
                status: 'pending',
                details: {
                    method: 'pix',
                    paymentId: data.id,
                    mpStatus: data.status,
                    qrCode: data.point_of_interaction?.transaction_data?.qr_code
                }
            });
            const transactionData = data.point_of_interaction?.transaction_data;
            if (!transactionData) {
                return sendError(res, "O Mercado Pago não retornou o QR Code.", 500);
            }
            // 6. Retornar APENAS os dados necessários para o Frontend renderizar
            return sendSuccess(res, {
                qrCodeBase64: transactionData.qr_code_base64,
                qrCode: transactionData.qr_code,
                paymentId: data.id,
                expiresAt: data.date_of_expiration
            });
        }
        catch (err) {
            console.error("[MercadoPago PIX] Exception:", err.message);
            return sendError(res, "Erro interno ao processar Pix.", 500);
        }
    },
    webhook: async (req, res) => {
        const payment = req.query;
        const io = req.io;
        try {
            if (payment.type === 'payment' || payment.topic === 'payment') {
                const paymentId = payment['data.id'] || payment.id;
                if (!paymentId)
                    return res.status(200).send('OK');
                // Consulta status atualizado no MP
                const paymentInfoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` }
                });
                if (!paymentInfoResponse.ok)
                    return res.status(200).send('OK');
                const paymentInfo = await paymentInfoResponse.json();
                const internalTxId = paymentInfo.external_reference;
                const status = paymentInfo.status;
                if (!internalTxId)
                    return res.status(200).send('OK');
                const transaction = await TransactionModel.findOne({ id: internalTxId });
                if (!transaction)
                    return res.status(200).send('OK');
                // Processa aprovação (Idempotente)
                if (transaction.status !== 'completed' && status === 'approved') {
                    transaction.status = 'completed';
                    transaction.details = { ...transaction.details, approvedAt: new Date() };
                    await transaction.save();
                    // Credita Diamantes
                    await UserModel.findOneAndUpdate({ id: transaction.userId }, { $inc: { diamonds: transaction.amountDiamonds } });
                    // Notifica Frontend via WebSocket
                    io.to(transaction.userId).emit('payment:success', {
                        diamonds: transaction.amountDiamonds,
                        price: transaction.amountBRL
                    });
                    console.log(`[Webhook] ✅ Pagamento Aprovado: ${transaction.amountDiamonds} diamantes para ${transaction.userId}`);
                }
                else if (status === 'cancelled' || status === 'rejected') {
                    if (transaction.status !== 'failed') {
                        transaction.status = 'failed';
                        await transaction.save();
                    }
                }
            }
            res.status(200).send('OK');
        }
        catch (err) {
            console.error('[Webhook] Erro:', err);
            res.status(500).send('Erro');
        }
    }
};
