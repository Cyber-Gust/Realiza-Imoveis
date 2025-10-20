/**
 * Constantes para status de anúncios de imóveis.
 * Alinhado com o ENUM 'listing_status' do banco.sql.
 */
export const LISTING_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  RENTED: 'rented',
  SOLD: 'sold',
  ARCHIVED: 'archived',
};

/**
 * Constantes para os estágios do pipeline de negócios (CRM).
 * Alinhado com o ENUM 'deal_stage' do banco.sql.
 */
export const DEAL_STAGE = {
  NEW: 'new',
  QUALIFIED: 'qualified',
  VISIT: 'visit',
  PROPOSAL: 'proposal',
  DOCS: 'docs',
  CONTRACT: 'contract',
  WON: 'won',
  LOST: 'lost',
};

/**
 * Constantes para status de contratos.
 * Alinhado com o ENUM 'contract_status' do banco.sql.
 */
export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING_SIGN: 'pending_sign',
  ACTIVE: 'active',
  TERMINATED: 'terminated',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

/**
 * Constantes para status de faturas.
 * Alinhado com o ENUM 'invoice_status' do banco.sql.
 */
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELED: 'canceled',
};
