import { supabase } from './supabase';

/**
 * Obtém os dados do usuário logado a partir de uma sessão.
 * Ideal para ser usado em rotas de API protegidas.
 * @param {object} session - O objeto de sessão do NextAuth ou Supabase.
 * @returns {Promise<object|null>} O objeto do usuário ou null se não houver sessão.
 */
export async function getUserFromSession(session) {
  if (!session) {
    return null;
  }

  // O Supabase pode validar o token da sessão para obter o usuário
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Erro ao obter usuário da sessão:', error);
    return null;
  }

  return user;
}
