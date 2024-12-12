import { supabase } from '@/utils/supabase';

export default async function handler(req, res) {
        try {
            const { data, error } = await supabase
                .from('offers')
                .select(`
                    *,
                    offer_options (
                        id,
                        name,
                        description,
                        odds,
                        status
                    )
                `);
            if (error) throw error;

            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
}
