import { verifyOrCreateUser } from '@/utils/verifyOrCreateUser';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phone_number, amount } = req.body;

        try {
            // Configuração do ASAAS
            const ASAS_API_KEY = process.env.ASAAS_API_KEY;
            const ASAS_BASE_URL = 'https://www.asaas.com/api/v3/paymentLinks';

            // Lista de tipos de cobrança
            const billingTypes = ['BOLETO', 'CREDIT_CARD', 'PIX'];
            const paymentLinks = [];

            // Cria um link para cada tipo de cobrança
            for (const billingType of billingTypes) {
                const paymentData = {
                    name: 'Depósito na Wallet',
                    description: `Depósito de R$${amount.toFixed(2)} - Método: ${billingType}`,
                    chargeType: 'DETACHED',
                    billingType,
                    value: amount,
                    dueDateLimitDays: 7, // Link válido por 7 dias
                };

                const response = await fetch(ASAS_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': ASAS_API_KEY,
                    },
                    body: JSON.stringify(paymentData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro na criação do link ASAAS: ${errorData.errors[0]?.description || response.statusText}`);
                }

                const paymentLink = await response.json();
                paymentLinks.push({ billingType, url: paymentLink.url });
            }

            // Retorna todas as opções de links
            res.status(201).json({ paymentLinks });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

