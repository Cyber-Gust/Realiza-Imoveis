import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR PAGAMENTOS
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('invoice_id');

  try {
    let query = supabase
      .from('payments')
      .select('*, invoice_id(id, amount_net)')
      .eq('tenant_id', session.user.tenantId);
    
    if (invoiceId) {
        query = query.eq('invoice_id', invoiceId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar pagamentos'), { status: 500 });
  }
}

// REGISTRAR NOVO PAGAMENTO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json(); // { invoice_id, amount, method, ... }
    const { data, error } = await supabase
      .from('payments')
      .insert({ ...body, tenant_id: session.user.tenantId })
      .select()
      .single();

    if (error) throw error;

    // TODO: Adicionar lógica para atualizar o status da fatura para 'paid'
    
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao registrar pagamento'), { status: 500 });
  }
}
