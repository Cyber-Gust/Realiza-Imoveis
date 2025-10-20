import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UM NEGÓCIO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { dealId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*, lead_id(*), property_id(*), owner_user_id(id, full_name)')
      .eq('id', dealId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Negócio não encontrado.' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar negócio'), { status: 500 });
  }
}

// ATUALIZAR UM NEGÓCIO
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { dealId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('deals')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', dealId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar negócio'), { status: 500 });
  }
}

// DELETAR UM NEGÓCIO
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { dealId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId)
      .eq('tenant_id', session.user.tenantId);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao deletar negócio'), { status: 500 });
  }
}
