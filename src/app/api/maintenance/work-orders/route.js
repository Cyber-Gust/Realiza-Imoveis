import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR ORDENS DE SERVIÇO
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get('ticket_id');

  try {
    // A segurança é garantida pela RLS da tabela 'tickets' na junção
    let query = supabase
      .from('work_orders')
      .select('*, ticket_id(id, title, tenant_id), vendor_id(id, contact_id(full_name))')
      .eq('ticket_id.tenant_id', session.user.tenantId);

    if (ticketId) {
        query = query.eq('ticket_id', ticketId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar ordens de serviço'), { status: 500 });
  }
}

// CRIAR NOVA ORDEM DE SERVIÇO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.INSPECTOR].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json(); // { ticket_id, vendor_id, scheduled_at, ... }
    const { data, error } = await supabase
      .from('work_orders')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar ordem de serviço'), { status: 500 });
  }
}
