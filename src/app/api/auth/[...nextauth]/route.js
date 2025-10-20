import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import { ROLES } from '@/types/roles';

/**
 * Configurações do NextAuth.js para autenticação com Supabase.
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Cliente Supabase específico para esta função, usando chaves de ambiente
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // 1. Tenta autenticar o usuário no Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError || !authData.user) {
          console.error("Erro de autenticação Supabase:", authError?.message);
          return null; // Falha na autenticação
        }
        
        const user = authData.user;

        // 2. Busca o perfil e o tenant/role do usuário no banco de dados
        // Usamos a service_role key para buscar dados internos necessários para a sessão
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        const { data: tenantData, error: tenantError } = await supabaseAdmin
          .from('user_tenants')
          .select('tenant_id, role')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single(); // Assumindo que um usuário pertence a um tenant ativo por vez

        if (profileError || tenantError) {
          console.error("Erro ao buscar perfil/tenant:", profileError || tenantError);
          // Não retorna o usuário se dados essenciais não forem encontrados
          return null;
        }
        
        // 3. Monta o objeto de usuário que será salvo no token JWT
        return {
          id: user.id,
          email: user.email,
          name: profileData.full_name,
          image: profileData.avatar_url,
          role: tenantData.role || ROLES.VIEWER,
          tenantId: tenantData.tenant_id,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // O callback 'jwt' é chamado sempre que um JWT é criado ou atualizado.
    async jwt({ token, user }) {
      // Se o objeto 'user' existir (ocorre no login), persistimos os dados no token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    // O callback 'session' é chamado sempre que uma sessão é acessada.
    async session({ session, token }) {
      // Adicionamos os dados do token ao objeto da sessão.
      // Agora `session.user.role` etc. estarão disponíveis no cliente.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Página de login personalizada
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
