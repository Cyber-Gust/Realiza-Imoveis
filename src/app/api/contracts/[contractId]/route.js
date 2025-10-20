import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UM CONTRATO ESPECÍFICO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, property_id(*), lessee_contact_id(*), lessor_contact_id(*)')
      .eq('id', contractId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Contrato não encontrado.' }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar contrato'), { status: 500 });
  }
}

// ATUALIZAR UM CONTRATO
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('contracts')
      .update(body)
      .eq('id', contractId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar contrato'), { status: 500 });
  }
}

// DELETAR UM CONTRATO
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }
  
    const { contractId } = params;
    const supabase = getSupabaseAdmin();
  
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId)
        .eq('tenant_id', session.user.tenantId);
  
      if (error) throw error;
      return new NextResponse(null, { status: 204 }); // No Content
    } catch (err) {
      return NextResponse.json(handleError(err, 'Falha ao deletar contrato'), { status: 500 });
    }
}
