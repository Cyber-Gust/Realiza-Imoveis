import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UMA ATIVIDADE
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { activityId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Atividade não encontrada.' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar atividade'), { status: 500 });
  }
}

// ATUALIZAR UMA ATIVIDADE
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { activityId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('activities')
      .update(body)
      .eq('id', activityId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar atividade'), { status: 500 });
  }
}

// DELETAR UMA ATIVIDADE
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { activityId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId)
      .eq('tenant_id', session.user.tenantId);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao deletar atividade'), { status: 500 });
  }
}
