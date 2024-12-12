import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user_id, amount } = req.body;

        try {
            const { data: wallet, error: fetchError } = await supabase
                .from('Wallet')
                .select('balance')
                .eq('user_id', user_id)
                .single();

            if (fetchError) throw fetchError;

            if (wallet.balance < amount) {
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            const { error: updateError } = await supabase
                .from('Wallet')
                .update({ balance: wallet.balance - amount })
                .eq('user_id', user_id);

            if (updateError) throw updateError;

            res.status(200).json({ message: 'Withdrawal successful' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
