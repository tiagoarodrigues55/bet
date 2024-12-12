import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('Offers')
                .select('id, status, offer_date, mode, Offer_Options(id, name, description, odds, status)');

            if (error) throw error;

            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
