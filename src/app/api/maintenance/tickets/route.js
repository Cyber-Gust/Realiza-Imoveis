import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR CHAMADOS (TICKETS)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let query = supabase
      .from('tickets')
      .select('*, property_id(id, title), opened_by_contact_id(id, full_name)')
      .eq('tenant_id', session.user.tenantId);

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar chamados'), { status: 500 });
  }
}

// ABRIR NOVO CHAMADO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  // Permitir que inquilinos (via portal) ou a equipe interna abram chamados
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('tickets')
      .insert({ ...body, tenant_id: session.user.tenantId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao abrir chamado'), { status: 500 });
  }
}
