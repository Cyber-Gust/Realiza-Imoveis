import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente garantem que suas chaves fiquem seguras.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A Service Role Key é usada para operações de backend que precisam de privilégios de administrador.
// ATENÇÃO: Nunca exponha esta chave no lado do cliente (navegador).
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Cliente Supabase para uso no lado do cliente (browser).
 * Usa a chave anônima (anon key), que respeita as políticas de RLS (Row Level Security).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente Supabase para uso no lado do servidor (API routes, server-side rendering).
 * Usa a chave de serviço (service role key) para ter acesso total ao banco de dados,
 * ignorando as políticas de RLS. Use com extremo cuidado.
 *
 * @returns Um cliente Supabase com privilégios de administrador.
 */
export const getSupabaseAdmin = () => {
  // Verifica se a chave de serviço está disponível no ambiente.
  // Isso evita erros em ambientes onde a chave não está configurada.
  if (!supabaseServiceRoleKey) {
    throw new Error('A variável de ambiente SUPABASE_SERVICE_ROLE_KEY não está definida.');
  }
  // Retorna uma nova instância do cliente com a chave de serviço.
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};
