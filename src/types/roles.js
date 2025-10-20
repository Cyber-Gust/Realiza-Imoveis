/**
 * Define os perfis de usuário do sistema.
 * Usado para controle de acesso (RLS) e lógica de permissões na aplicação.
 * Mantém consistência com o ENUM 'user_role' do banco de dados (banco.sql).
 */
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  FINANCE: 'finance',
  INSPECTOR: 'inspector',
  OWNER: 'owner',
  TENANT: 'tenant',
  CONTRACTOR: 'contractor',
  VIEWER: 'viewer',
};
