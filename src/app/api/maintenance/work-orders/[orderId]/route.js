import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UMA ORDEM DE SERVIÇO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { orderId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*, ticket_id(*, property_id(*)), vendor_id(*, contact_id(*))')
      .eq('id', orderId)
      .single();

    // A RLS garante que o usuário só possa ver ordens do seu tenant
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Ordem de serviço não encontrada.' }, { status: 404 });
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar ordem de serviço'), { status: 500 });
  }
}

// ATUALIZAR UMA ORDEM DE SERVIÇO
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.INSPECTOR].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { orderId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('work_orders')
      .update(body)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar ordem de serviço'), { status: 500 });
  }
}

// DELETAR UMA ORDEM DE SERVIÇO
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { orderId } = params;
  const supabase = getSupabaseAdmin();
  
  try {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    return NextResponse.json({ message: 'Ordem de serviço deletada com sucesso.' });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao deletar ordem de serviço'), { status: 500 });
  }
}
