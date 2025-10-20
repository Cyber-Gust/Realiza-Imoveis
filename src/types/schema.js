/**
 * Mapeia os nomes das tabelas do banco de dados para constantes.
 * Evita erros de digitação e centraliza os nomes das tabelas em um único lugar.
 * Facilita a manutenção e a refatoração.
 */
export const TABLES = {
  // Core
  USERS: 'users',
  TENANTS: 'tenants',
  PROFILES: 'profiles',
  USER_TENANTS: 'user_tenants',
  CONTACTS: 'contacts',
  PROPERTIES: 'properties',
  NEIGHBORHOODS: 'neighborhoods',

  // CRM
  LEADS: 'leads',
  DEALS: 'deals',
  ACTIVITIES: 'activities',
  APPOINTMENTS: 'appointments',
  PROPOSALS: 'proposals',

  // Contracts
  CONTRACTS: 'contracts',
  CONTRACT_TEMPLATES: 'contract_templates',
  DOCUMENTS: 'documents',

  // Financials
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  OWNER_PAYOUTS: 'owner_payouts',
  COMMISSIONS: 'commissions',
  COST_CENTERS: 'cost_centers',
  CHART_OF_ACCOUNTS: 'chart_of_accounts',

  // Maintenance
  TICKETS: 'tickets',
  WORK_ORDERS: 'work_orders',
  INSPECTIONS: 'inspections',
  VENDORS: 'vendors',
  
  // System
  AUDIT_LOG: 'audit_log',
};
