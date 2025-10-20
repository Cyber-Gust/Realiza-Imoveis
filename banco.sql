-- ===========================================
-- REAL ESTATE STACK • SUPABASE ONE-SHOT SQL
-- Multi-tenant + RLS + Auditoria + Financeiro + CRM
-- Seguro para rodar múltiplas vezes (idempotente)
-- ===========================================

-- EXTENSIONS ----------------------------------------------------------
create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists "uuid-ossp";    -- opcional
-- create extension if not exists postgis;    -- opcional, se usar geo

-- ======================
-- ENUMS (tipos de domínio)
-- ======================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin','manager','agent','finance','inspector','owner','tenant','contractor','viewer');
  end if;

  if not exists (select 1 from pg_type where typname = 'listing_status') then
    create type listing_status as enum ('draft','active','paused','rented','sold','archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'listing_type') then
    create type listing_type as enum ('rent','sale');
  end if;

  if not exists (select 1 from pg_type where typname = 'media_kind') then
    create type media_kind as enum ('photo','video','tour3d','floorplan','document');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_source') then
    create type lead_source as enum ('site','whatsapp','instagram','phone','referral','zap','vivareal','olx','imovelweb','other');
  end if;

  if not exists (select 1 from pg_type where typname = 'deal_stage') then
    create type deal_stage as enum ('new','qualified','visit','proposal','docs','contract','won','lost');
  end if;

  if not exists (select 1 from pg_type where typname = 'proposal_status') then
    create type proposal_status as enum ('sent','counter','accepted','rejected','expired','withdrawn');
  end if;

  if not exists (select 1 from pg_type where typname = 'contract_status') then
    create type contract_status as enum ('draft','pending_sign','active','terminated','expired','suspended');
  end if;

  if not exists (select 1 from pg_type where typname = 'reajuste_index') then
    create type reajuste_index as enum ('igpm','ipca','custom','none');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type invoice_status as enum ('pending','paid','overdue','canceled');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('pix','boleto','card','transfer','cash','other');
  end if;

  if not exists (select 1 from pg_type where typname = 'ticket_status') then
    create type ticket_status as enum ('open','triage','awaiting_quotes','awaiting_approval','approved','in_progress','paused','done','canceled');
  end if;

  if not exists (select 1 from pg_type where typname = 'priority_level') then
    create type priority_level as enum ('low','normal','high','urgent');
  end if;
end$$;

-- ======================
-- FUNÇÕES AUXILIARES (JWT / RLS)
-- ======================
create or replace function util_get_jwt_claim(claim text)
returns text language sql stable as $$
  select coalesce( (current_setting('request.jwt.claims', true)::jsonb ->> claim), null );
$$;

create or replace function util_user_id()
returns uuid language sql stable as $$
  select auth.uid();
$$;

-- ======================
-- MULTI-TENANT / PERFIS
-- ======================
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists user_tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role user_role not null default 'viewer',
  is_active boolean not null default true,
  unique (user_id, tenant_id)
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  kind text not null check (kind in ('owner','tenant','lead','partner','contractor','other')),
  full_name text not null,
  email text,
  phone text,
  doc_id text,
  address jsonb,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ======================
-- ENDEREÇOS E REGIÕES
-- ======================
create table if not exists neighborhoods (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  city text not null,
  state text not null,
  bounds jsonb,
  created_at timestamptz not null default now()
);

-- ======================
-- IMÓVEIS (cadastro rico)
-- ======================
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  code text,
  title text not null,
  description text,
  listing_type listing_type not null,
  status listing_status not null default 'draft',
  price numeric(14,2) not null default 0,
  condo_fee numeric(14,2) not null default 0,
  iptu numeric(14,2) not null default 0,
  address jsonb not null,
  coords jsonb,
  area_m2 numeric(12,2),
  bedrooms int,
  bathrooms int,
  parking_spots int,
  pet_friendly boolean default false,
  furnished boolean default false,
  features jsonb,
  score jsonb,
  owner_contact_id uuid references contacts(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_tenant on properties(tenant_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_listing_type on properties(listing_type);

create table if not exists property_prices (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  started_at date not null default current_date,
  ended_at date,
  price numeric(14,2) not null,
  condo_fee numeric(14,2) not null default 0,
  iptu numeric(14,2) not null default 0,
  note text
);

create table if not exists property_keys (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  tag text not null,
  status text not null check (status in ('in_box','checked_out')),
  holder_contact_id uuid references contacts(id),
  checkout_by uuid references auth.users(id),
  checkout_at timestamptz,
  checkin_at timestamptz
);

create table if not exists property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  kind media_kind not null,
  storage_path text not null,
  title text,
  position int not null default 0,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists property_compliance (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  doc_type text not null,
  storage_path text not null,
  valid_until date,
  created_at timestamptz not null default now()
);

-- ======================
-- CRM & VENDAS/LOCAÇÃO
-- ======================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  source lead_source not null default 'site',
  name text,
  email text,
  phone text,
  budget_min numeric(14,2),
  budget_max numeric(14,2),
  prefs jsonb,
  score int,
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  stage deal_stage not null default 'new',
  value numeric(14,2),
  lost_reason text,
  owner_user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  deal_id uuid references deals(id) on delete cascade,
  kind text not null check (kind in ('note','call','email','task','visit','whatsapp')),
  content text,
  due_at timestamptz,
  done_at timestamptz,
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  scheduled_at timestamptz not null,
  scheduled_end timestamptz,
  place text,
  qr_code text,
  status text not null default 'scheduled',
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  deal_id uuid references deals(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  status proposal_status not null default 'sent',
  payload jsonb not null,
  valid_until date,
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ======================
-- CONTRATOS & ASSINATURA
-- ======================
create table if not exists contract_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('rent','sale','adm')),
  body_template text not null,
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  lessor_contact_id uuid references contacts(id) on delete set null,
  lessee_contact_id uuid references contacts(id) on delete set null,
  template_id uuid references contract_templates(id) on delete set null,
  status contract_status not null default 'draft',
  start_date date,
  end_date date,
  base_value numeric(14,2),
  condo_fee numeric(14,2) default 0,
  iptu numeric(14,2) default 0,
  reajuste reajuste_index not null default 'igpm',
  reajuste_day int default 1,
  signature_provider text,
  signature_meta jsonb,
  variables jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contract_reajustes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  applied_on date not null,
  index_used reajuste_index not null,
  factor numeric(10,6) not null,
  old_value numeric(14,2) not null,
  new_value numeric(14,2) not null,
  note text
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  contract_id uuid references contracts(id) on delete set null,
  doc_type text not null,
  storage_path text not null,
  verified boolean default false,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ======================
-- FINANCEIRO
-- ======================
create table if not exists cost_centers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  code text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table if not exists chart_of_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  code text not null,
  name text not null,
  kind text not null check (kind in ('revenue','expense','asset','liability','equity')),
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contract_id uuid references contracts(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  cost_center_id uuid references cost_centers(id) on delete set null,
  account_id uuid references chart_of_accounts(id) on delete set null,
  due_date date not null,
  amount_gross numeric(14,2) not null,
  discount numeric(14,2) default 0,
  fine numeric(14,2) default 0,
  interest numeric(14,2) default 0,
  amount_net numeric(14,2) generated always as (amount_gross - discount + fine + interest) stored,
  status invoice_status not null default 'pending',
  method payment_method,
  external_ref text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete cascade,
  paid_at timestamptz not null default now(),
  method payment_method not null,
  amount numeric(14,2) not null,
  txid text,
  barcode text,
  meta jsonb
);

create table if not exists owner_payouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  owner_contact_id uuid references contacts(id) on delete set null,
  period date not null,
  scheduled_for date,
  amount_gross numeric(14,2) not null default 0,
  deductions jsonb default '[]',
  amount_net numeric(14,2) not null default 0,
  status text not null default 'pending',
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  deal_id uuid references deals(id) on delete set null,
  agent_user_id uuid references auth.users(id),
  basis_amount numeric(14,2) not null,
  rate numeric(7,4) not null,
  amount numeric(14,2) generated always as (basis_amount * rate) stored,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists bank_imports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  source text not null,
  storage_path text not null,
  imported_at timestamptz not null default now(),
  meta jsonb
);

create table if not exists bank_lines (
  id uuid primary key default gen_random_uuid(),
  bank_import_id uuid not null references bank_imports(id) on delete cascade,
  occurred_at date not null,
  description text,
  amount numeric(14,2) not null,
  matched_invoice_id uuid references invoices(id) on delete set null,
  matched_payment_id uuid references payments(id) on delete set null,
  meta jsonb
);

create table if not exists nfse (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete set null,
  number text,
  status text,
  xml_storage_path text,
  issued_at timestamptz,
  taxes jsonb,
  meta jsonb
);

create table if not exists dunning_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  day_offset int not null,
  channel text not null check (channel in ('whatsapp','email','sms','letter')),
  template text not null
);

-- ======================
-- MANUTENÇÃO & OPERAÇÕES
-- ======================
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  specialties text[],
  created_at timestamptz not null default now()
);

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  opened_by_contact_id uuid references contacts(id) on delete set null,
  title text not null,
  description text,
  status ticket_status not null default 'open',
  priority priority_level not null default 'normal',
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_quotes (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  amount numeric(14,2) not null,
  storage_path text,
  approved boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists work_orders (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  scheduled_at timestamptz,
  status text not null default 'scheduled',
  checkin_code text,
  created_at timestamptz not null default now()
);

create table if not exists inspections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  contract_id uuid references contracts(id) on delete set null,
  kind text not null check (kind in ('pre_movein','post_moveout','periodic')),
  report_storage_path text,
  signed boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists inspection_items (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references inspections(id) on delete cascade,
  room text not null,
  item text not null,
  condition text,
  photo_path text,
  notes text
);

-- ======================
-- INTEGRAÇÕES & MARKETING
-- ======================
create table if not exists webhooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  target_url text not null,
  secret text,
  event text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists integration_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  provider text not null,
  credentials jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists marketing_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  slug text unique,
  body text,
  tags text[],
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ======================
-- LGPD / PRIVACIDADE
-- ======================
create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  purpose text not null,
  lawful_basis text not null,
  granted boolean not null default true,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists data_subject_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  kind text not null check (kind in ('export','erasure','rectification')),
  status text not null default 'open',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  meta jsonb
);

-- ======================
-- AUDITORIA (genérico)
-- ======================
create table if not exists audit_log (
  id bigint generated always as identity primary key,
  tenant_id uuid,
  table_name text not null,
  record_id uuid,
  action text not null,
  actor uuid,
  at timestamptz not null default now(),
  diff jsonb
);

/**
 * Função de auditoria genérica
 */
create or replace function trg_audit_generic()
returns trigger language plpgsql as $$
declare
  _tenant uuid;
  _record_id uuid;
  _diff jsonb;
begin
  if (tg_op = 'INSERT') then
    _diff := to_jsonb(NEW);
    _record_id := NEW.id;
    -- Tentativa de pegar tenant_id da nova linha (INSERT)
    begin
      _tenant := NEW.tenant_id;
    exception when others then
      _tenant := null; -- Se a tabela não tiver tenant_id, será NULL
    end;
    
    insert into audit_log(tenant_id, table_name, record_id, action, actor, diff)
    values(_tenant, tg_table_name, _record_id, 'insert', auth.uid(), _diff);
    return NEW;
  
  elsif (tg_op = 'UPDATE') then
    _diff := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
    _record_id := NEW.id;
    -- Tentativa de pegar tenant_id da nova linha (UPDATE)
    begin
      _tenant := NEW.tenant_id;
    exception when others then
      _tenant := null; 
    end;

    insert into audit_log(tenant_id, table_name, record_id, action, actor, diff)
    values(_tenant, tg_table_name, _record_id, 'update', auth.uid(), _diff);
    return NEW;
  
  elsif (tg_op = 'DELETE') then
    _diff := to_jsonb(OLD);
    _record_id := OLD.id;
    -- Tentativa de pegar tenant_id da linha antiga (DELETE)
    begin
      _tenant := OLD.tenant_id;
    exception when others then
      _tenant := null; 
    end;

    insert into audit_log(tenant_id, table_name, record_id, action, actor, diff)
    values(_tenant, tg_table_name, _record_id, 'delete', auth.uid(), _diff);
    return OLD;
  end if;
  return null;
end$$;

/**
 * Aplica o trigger de auditoria a todas as tabelas relevantes.
 */
do $$
declare r record;
begin
  for r in
    select unnest(array[
      'tenants','user_tenants','contacts','neighborhoods',
      'properties','property_prices','property_keys','property_media','property_compliance',
      'leads','deals','activities','appointments','proposals',
      'contract_templates','contracts','contract_reajustes','documents',
      'cost_centers','chart_of_accounts','invoices','payments','owner_payouts','commissions',
      'bank_imports','bank_lines','nfse','dunning_rules',
      'vendors','tickets','ticket_quotes','work_orders',
      'inspections','inspection_items',
      'webhooks','integration_accounts','marketing_posts',
      'consents','data_subject_requests'
    ]) as tbl
  loop
    execute format('drop trigger if exists trg_audit_%I on %I;', r.tbl, r.tbl);
    execute format('create trigger trg_audit_%I after insert or update or delete on %I
            for each row execute function trg_audit_generic();', r.tbl, r.tbl);
  end loop;
end$$;

-- ======================
-- RLS (Row Level Security)
-- ======================

-- View de memberships do usuário atual
create or replace view v_my_memberships as
select ut.tenant_id, ut.role
from user_tenants ut
where ut.user_id = auth.uid() and ut.is_active = true;

/** * TABELAS GENÉRICAS MULTI-TENANT (com a coluna tenant_id)
 * NOTA: 'bank_lines' foi removida.
 */
do $$
declare r record;
begin
  for r in
    select unnest(array[
      'user_tenants','contacts','neighborhoods',
      'properties',
      'leads','deals','activities','appointments','proposals',
      'contract_templates','contracts','documents',
      'cost_centers','chart_of_accounts','invoices','payments','owner_payouts','commissions',
      'bank_imports','nfse','dunning_rules', -- 'bank_lines' REMOVIDA
      'vendors','tickets','inspections','marketing_posts','webhooks','integration_accounts',
      'consents','data_subject_requests'
    ]) as tbl
  loop
    execute format('alter table %I enable row level security;', r.tbl);

    execute format($SQL$
      drop policy if exists %I_select on %I;
      create policy %I_select on %I
        for select using (
          exists (select 1 from v_my_memberships m where m.tenant_id = %I.tenant_id)
        );
    $SQL$, r.tbl, r.tbl, r.tbl, r.tbl, r.tbl);

    execute format($SQL$
      drop policy if exists %I_insert on %I;
      create policy %I_insert on %I
        for insert with check (
          exists (select 1 from v_my_memberships m 
                  where m.tenant_id = %I.tenant_id
                    and m.role in ('admin','manager','agent','finance','inspector'))
        );
    $SQL$, r.tbl, r.tbl, r.tbl, r.tbl, r.tbl);

    execute format($SQL$
      drop policy if exists %I_update on %I;
      create policy %I_update on %I
        for update using (
          exists (select 1 from v_my_memberships m where m.tenant_id = %I.tenant_id
                  and m.role in ('admin','manager','agent','finance','inspector'))
        ) with check (
          exists (select 1 from v_my_memberships m where m.tenant_id = %I.tenant_id
                  and m.role in ('admin','manager','agent','finance','inspector'))
        );
    $SQL$, r.tbl, r.tbl, r.tbl, r.tbl, r.tbl, r.tbl);

    execute format($SQL$
      drop policy if exists %I_delete on %I;
      create policy %I_delete on %I
        for delete using (
          exists (select 1 from v_my_memberships m where m.tenant_id = %I.tenant_id
                  and m.role in ('admin','manager'))
        );
    $SQL$, r.tbl, r.tbl, r.tbl, r.tbl, r.tbl);
  end loop;
end$$;

-- Perfis (um-para-um com auth.users)
alter table profiles enable row level security;

drop policy if exists profiles_self on profiles;
create policy profiles_self on profiles
for select using (id = auth.uid());

drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles
for update using (id = auth.uid()) with check (id = auth.uid());

-- TABELAS-FILHAS DE TABLES (sem tenant_id direto) ----------------

alter table property_prices      enable row level security;
alter table property_keys        enable row level security;
alter table property_media       enable row level security;
alter table property_compliance  enable row level security;
alter table contract_reajustes   enable row level security;
alter table ticket_quotes        enable row level security;
alter table work_orders          enable row level security;
alter table inspection_items     enable row level security;
alter table bank_lines           enable row level security; -- Nova política específica

-- property_prices
drop policy if exists property_prices_select_join on property_prices;
create policy property_prices_select_join on property_prices
for select using (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_prices.property_id
  )
);

drop policy if exists property_prices_cud_join on property_prices;
create policy property_prices_cud_join on property_prices
for all using (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_prices.property_id
      and m.role in ('admin','manager','agent','finance')
  )
) with check (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_prices.property_id
      and m.role in ('admin','manager','agent','finance')
  )
);

-- property_keys
drop policy if exists property_keys_all_join on property_keys;
create policy property_keys_all_join on property_keys
for all using (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_keys.property_id
  )
) with check (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_keys.property_id
      and m.role in ('admin','manager','agent','inspector')
  )
);

-- property_media
drop policy if exists property_media_all_join on property_media;
create policy property_media_all_join on property_media
for all using (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_media.property_id
  )
) with check (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_media.property_id
      and m.role in ('admin','manager','agent')
  )
);

-- property_compliance
drop policy if exists property_compliance_all_join on property_compliance;
create policy property_compliance_all_join on property_compliance
for all using (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_compliance.property_id
  )
) with check (
  exists (
    select 1 from properties p
    join v_my_memberships m on m.tenant_id = p.tenant_id
    where p.id = property_compliance.property_id
      and m.role in ('admin','manager','inspector')
  )
);

-- contract_reajustes
drop policy if exists contract_reajustes_all_join on contract_reajustes;
create policy contract_reajustes_all_join on contract_reajustes
for all using (
  exists (
    select 1 from contracts c
    join v_my_memberships m on m.tenant_id = c.tenant_id
    where c.id = contract_reajustes.contract_id
  )
) with check (
  exists (
    select 1 from contracts c
    join v_my_memberships m on m.tenant_id = c.tenant_id
    where c.id = contract_reajustes.contract_id
      and m.role in ('admin','manager','finance')
  )
);

-- ticket_quotes
drop policy if exists ticket_quotes_all_join on ticket_quotes;
create policy ticket_quotes_all_join on ticket_quotes
for all using (
  exists (
    select 1 from tickets t
    join v_my_memberships m on m.tenant_id = t.tenant_id
    where t.id = ticket_quotes.ticket_id
  )
) with check (
  exists (
    select 1 from tickets t
    join v_my_memberships m on m.tenant_id = t.tenant_id
    where t.id = ticket_quotes.ticket_id
      and m.role in ('admin','manager','inspector')
  )
);

-- work_orders
drop policy if exists work_orders_all_join on work_orders;
create policy work_orders_all_join on work_orders
for all using (
  exists (
    select 1 from tickets t
    join v_my_memberships m on m.tenant_id = t.tenant_id
    where t.id = work_orders.ticket_id
  )
) with check (
  exists (
    select 1 from tickets t
    join v_my_memberships m on m.tenant_id = t.tenant_id
    where t.id = work_orders.ticket_id
      and m.role in ('admin','manager','inspector')
  )
);

-- inspection_items
drop policy if exists inspection_items_all_join on inspection_items;
create policy inspection_items_all_join on inspection_items
for all using (
  exists (
    select 1 from inspections i
    join v_my_memberships m on m.tenant_id = i.tenant_id
    where i.id = inspection_items.inspection_id
  )
) with check (
  exists (
    select 1 from inspections i
    join v_my_memberships m on m.tenant_id = i.tenant_id
    where i.id = inspection_items.inspection_id
      and m.role in ('admin','manager','inspector')
  )
);

/**
 * NOVA POLÍTICA: bank_lines (filha de bank_imports)
 */
drop policy if exists bank_lines_all_join on bank_lines;
create policy bank_lines_all_join on bank_lines
for all using (
  exists (
    select 1 from bank_imports bi
    join v_my_memberships m on m.tenant_id = bi.tenant_id
    where bi.id = bank_lines.bank_import_id
  )
) with check (
  exists (
    select 1 from bank_imports bi
    join v_my_memberships m on m.tenant_id = bi.tenant_id
    where bi.id = bank_lines.bank_import_id
      and m.role in ('admin','manager','finance')
  )
);


-- ======================
-- PORTAIS (owner/tenant): leitura pelo doc_id via JWT claim opcional
-- ======================
drop policy if exists contracts_portal on contracts;
create policy contracts_portal on contracts
for select using (
  exists (select 1 from v_my_memberships m where m.tenant_id = contracts.tenant_id)
  or exists (
    select 1 from contacts c
    where (c.id = contracts.lessor_contact_id or c.id = contracts.lessee_contact_id)
      and c.kind in ('owner','tenant')
      and c.doc_id = util_get_jwt_claim('contact_doc_id')
  )
);

drop policy if exists invoices_portal on invoices;
create policy invoices_portal on invoices
for select using (
  exists (select 1 from v_my_memberships m where m.tenant_id = invoices.tenant_id)
  or exists (
    select 1
    from contracts ct
    join contacts cx on (cx.id = ct.lessee_contact_id or cx.id = ct.lessor_contact_id)
    where ct.id = invoices.contract_id
      and cx.doc_id = util_get_jwt_claim('contact_doc_id')
  )
);

drop policy if exists tickets_portal on tickets;
create policy tickets_portal on tickets
for select using (
  exists (select 1 from v_my_memberships m where m.tenant_id = tickets.tenant_id)
  or exists (
    select 1 from contacts c
    where c.id = tickets.opened_by_contact_id
      and c.doc_id = util_get_jwt_claim('contact_doc_id')
  )
);

-- ======================
-- ÍNDICES ESSENCIAIS
-- ======================
create index if not exists idx_contacts_tenant on contacts(tenant_id);
create index if not exists idx_leads_tenant on leads(tenant_id);
create index if not exists idx_deals_tenant on deals(tenant_id, stage);
create index if not exists idx_invoices_tenant_due on invoices(tenant_id, due_date, status);
create index if not exists idx_contracts_tenant_status on contracts(tenant_id, status);
create index if not exists idx_tickets_tenant_status on tickets(tenant_id, status, priority);

-- ======================
-- SEEDS MÍNIMOS (opcional)
-- ======================
insert into tenants (id, name, slug)
select gen_random_uuid(), 'Tenant Padrão', 'default'
where not exists (select 1 from tenants where slug = 'default');

insert into cost_centers (tenant_id, code, name)
select t.id, 'ADM', 'Administrativo'
from tenants t
left join cost_centers c on c.tenant_id = t.id and c.code = 'ADM'
where c.id is null;

insert into chart_of_accounts (tenant_id, code, name, kind)
select t.id, '1.1.1', 'Receita de Aluguel', 'revenue'
from tenants t
left join chart_of_accounts a on a.tenant_id = t.id and a.code = '1.1.1'
where a.id is null;

insert into chart_of_accounts (tenant_id, code, name, kind)
select t.id, '3.1.1', 'Condomínio (Despesa Repasse)', 'expense'
from tenants t
left join chart_of_accounts a on a.tenant_id = t.id and a.code = '3.1.1'
where a.id is null;

-- Sintaxe para criar um bucket no schema 'storage' (Apenas para referência, faça pelo painel do Supabase)

INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('public_assets', 'public_assets', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('private_docs', 'private_docs', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- SUPABASE STORAGE RLS POLICIES
-- Cria políticas de acesso para os Buckets
-- Execute no Editor SQL do Supabase.
-- ===========================================

-- 1. BUCKET: public_assets (Mídia Pública)
-- Usado para fotos de imóveis, avatares, mídia que pode ser acessada sem autenticação.

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON storage.objects;

-- Permite LEITURA (SELECT) a todos, mesmo deslogados (public)
CREATE POLICY "Public assets read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public_assets');

-- Permite ESCRITA (INSERT, UPDATE) apenas a usuários AUTENTICADOS 
-- (Assumindo que apenas a equipe interna irá fazer uploads)
CREATE POLICY "Team users can upload to public assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public_assets');


-- 2. BUCKET: private_docs (Documentos Privados/Seguros)
-- Usado para contratos, documentos KYC, laudos, arquivos de importação.
-- Apenas usuários autenticados (da equipe) podem ler e escrever.

-- Permite LEITURA (SELECT) apenas a usuários AUTENTICADOS (Team)
CREATE POLICY "Private docs read for team"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'private_docs'
    -- Opcional: Adicione regras mais complexas para restringir
    -- Exemplo: AND storage.foldername(name) = auth.uid()
);

-- Permite ESCRITA (INSERT, UPDATE) apenas a usuários AUTENTICADOS (Team)
CREATE POLICY "Private docs write for team"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'private_docs'
);

-- ======================
-- FIM
-- ======================