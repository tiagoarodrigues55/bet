import { supabase } from '@/utils/supabase';
import { verifyOrCreateUser } from '@/utils/verifyOrCreateUser';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phone_number, option_id, amount, status } = req.body;

        try {
            // Obtém o user_id usando a função utilitária
            const user_id = await verifyOrCreateUser(phone_number);

            // Insere a aposta
            const { data, error } = await supabase
                .from('bets')
                .insert([{ user_id, option_id, amount, status }]);

            if (error) throw error;

            res.status(201).json(data[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
