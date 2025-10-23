# -*- coding: utf-8 -*-
import os

# ==========================================
# CONFIGURAÇÃO BASE
# ==========================================

BASE_DIR = "app/api"

# Estrutura modular baseada no manifest validado
modules = {
    "auth": ["[...nextauth]"],
    "users": ["[userId]"],
    "tenants": ["[tenantId]/users"],
    "compliance/lgpd": ["consents", "requests"],
    "audit": [],
    "properties": ["[propertyId]", "[propertyId]/media", "[propertyId]/prices", "[propertyId]/keys", "[propertyId]/compliance"],
    "neighborhoods": [],
    "crm/leads": ["[leadId]"],
    "crm/deals": ["[dealId]"],
    "crm/activities": ["[activityId]"],
    "crm/proposals": ["[proposalId]"],
    "crm/appointments": ["[appointmentId]"],
    "crm/contacts": ["[contactId]"],
    "contracts": ["[contractId]", "[contractId]/adjustments", "[contractId]/documents", "templates", "templates/[templateId]"],
    "financials/invoices": ["[invoiceId]"],
    "financials": ["payments", "payouts", "commissions", "dunning-rules", "settings/cost-centers", "settings/chart-of-accounts"],
    "maintenance/tickets": ["[ticketId]", "[ticketId]/quotes"],
    "maintenance/work-orders": ["[orderId]"],
    "maintenance/inspections": ["[inspectionId]", "[inspectionId]/items"],
    "maintenance": ["vendors"],
    "marketing/posts": ["[slug]"],
    "integrations": ["webhooks", "accounts"]
}

# Template base do arquivo route.js
ROUTE_TEMPLATE = """import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Exemplo genérico de rota (GET/POST)
export async function GET(req) {
  try {
    const { data, error } = await supabase.from('<TABLE>').select('*');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('<TABLE>').insert(body);
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
"""

# ==========================================
# FUNÇÃO DE GERAÇÃO
# ==========================================
def create_file(path, content=""):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def create_route_files():
    for module, subs in modules.items():
        base_path = os.path.join(BASE_DIR, module.replace(".", "/"))
        # rota principal
        create_file(os.path.join(base_path, "route.js"), ROUTE_TEMPLATE)
        # subrotas
        for sub in subs:
            sub_path = os.path.join(BASE_DIR, module, sub, "route.js")
            create_file(sub_path, ROUTE_TEMPLATE)
    print("✅ Estrutura /app/api/ criada com sucesso.")

def create_lib_and_types():
    os.makedirs("lib", exist_ok=True)
    os.makedirs("types", exist_ok=True)

    # lib/supabase.js
    create_file("lib/supabase.js", """import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
""")

    # lib/utils.js
    create_file("lib/utils.js", """export function handleError(error) {
  console.error('Supabase Error:', error);
  throw new Error(error.message);
}
""")

    # lib/auth.js
    create_file("lib/auth.js", """import { supabase } from './supabase';

export async function getUser(session) {
  const { data, error } = await supabase.auth.getUser(session);
  if (error) throw error;
  return data.user;
}
""")

    # types/roles.js
    create_file("types/roles.js", """export const ROLES = ['admin', 'manager', 'agent', 'finance', 'inspector', 'owner', 'tenant', 'viewer'];
""")

    # types/enums.js
    create_file("types/enums.js", """export const LISTING_STATUS = ['draft', 'active', 'paused', 'rented', 'sold', 'archived'];
export const DEAL_STAGE = ['new','qualified','visit','proposal','docs','contract','won','lost'];
""")

    # types/schema.js
    create_file("types/schema.js", """export const TABLES = {
  users: 'users',
  tenants: 'tenants',
  properties: 'properties',
  leads: 'leads',
  deals: 'deals',
  contracts: 'contracts',
  invoices: 'invoices',
  payments: 'payments',
  tickets: 'tickets'
};
""")

    print("✅ Pastas /lib e /types criadas com sucesso.")

# ==========================================
# EXECUÇÃO
# ==========================================
if __name__ == "__main__":
    create_route_files()
    create_lib_and_types()
    print("🎯 Estrutura completa pronta para integração com Supabase + Next.js!")
