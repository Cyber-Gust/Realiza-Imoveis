import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UMA PROPOSTA
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { proposalId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, deal_id(*), property_id(*), lead_id(*)')
      .eq('id', proposalId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Proposta não encontrada.' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar proposta'), { status: 500 });
  }
}

// ATUALIZAR UMA PROPOSTA
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { proposalId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('proposals')
      .update(body)
      .eq('id', proposalId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar proposta'), { status: 500 });
  }
}

// DELETAR UMA PROPOSTA
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { proposalId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId)
      .eq('tenant_id', session.user.tenantId);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao deletar proposta'), { status: 500 });
  }
}
