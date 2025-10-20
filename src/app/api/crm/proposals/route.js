import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR PROPOSTAS
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get('deal_id');
  const status = searchParams.get('status');

  try {
    let query = supabase
      .from('proposals')
      .select('*, deal_id(id, title), property_id(id, title), lead_id(id, name)')
      .eq('tenant_id', session.user.tenantId);
      
    if (dealId) query = query.eq('deal_id', dealId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar propostas'), { status: 500 });
  }
}

// CRIAR NOVA PROPOSTA
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('proposals')
      .insert({ ...body, tenant_id: session.user.tenantId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar proposta'), { status: 500 });
  }
}
