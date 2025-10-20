import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UMA FATURA
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { invoiceId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, contract_id(*), property_id(*), contact_id(*), cost_center_id(*), account_id(*)')
      .eq('id', invoiceId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Fatura não encontrada.' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar fatura'), { status: 500 });
  }
}

// ATUALIZAR UMA FATURA
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { invoiceId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('invoices')
      .update(body)
      .eq('id', invoiceId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar fatura'), { status: 500 });
  }
}

// DELETAR/CANCELAR UMA FATURA
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { invoiceId } = params;
  const supabase = getSupabaseAdmin();
  
  try {
    // Em vez de deletar, o ideal é cancelar a fatura
    const { data, error } = await supabase
      .from('invoices')
      .update({ status: 'canceled' })
      .eq('id', invoiceId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao cancelar fatura'), { status: 500 });
  }
}
