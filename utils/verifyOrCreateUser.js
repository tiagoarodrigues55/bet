import { supabase } from './supabase';

/**
 * Verifica se um usuário existe pelo número de telefone.
 * Se não existir, cria um novo usuário.
 * 
 * @param {string} phone_number - O número de telefone do usuário.
 * @returns {Promise<number>} - Retorna o `user_id` do usuário encontrado ou criado.
 */
export async function verifyOrCreateUser(phone_number) {
    try {
        // Verifica se o usuário já existe
        let { data: user, error: userError } = await supabase
            .from('Users')
            .select('id')
            .eq('phone_number', phone_number)
            .single();

        if (userError && userError.code !== 'PGRST116') {
            throw userError;
        }

        if (!user) {
            // Cria o usuário se ele não existir
            const { data: newUser, error: createUserError } = await supabase
                .from('Users')
                .insert([{ phone_number }])
                .select('id')
                .single();

            if (createUserError) throw createUserError;

            user = newUser;
        }

        return user.id;
    } catch (err) {
        throw new Error(`Error verifying or creating user: ${err.message}`);
    }
}
