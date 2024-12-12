import { supabase } from '@/utils/supabase';
import { verifyOrCreateUser } from '@/utils/verifyOrCreateUser';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phone_number, amount } = req.query;

        try {
            // Obtém o user_id usando a função utilitária
            const user_id = await verifyOrCreateUser(phone_number);

            // Busca os dados da carteira do usuário
            const { data, error } = await supabase
                .from('wallet')
                .insert([{ user_id, amount }]);

            if (error) throw error;

            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
