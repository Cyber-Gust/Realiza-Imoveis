import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UM TEMPLATE ESPECÍFICO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { templateId } = params;
  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .eq('id', templateId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 });
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar template'), { status: 500 });
  }
}

// ATUALIZAR UM TEMPLATE
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { templateId } = params;
  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('contract_templates')
      .update(body)
      .eq('id', templateId)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar template'), { status: 500 });
  }
}

// DELETAR UM TEMPLATE
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || !ROLES.ADMIN.includes(session.user.role)) { // Apenas admin
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }
  
    const { templateId } = params;
    const supabase = getSupabaseAdmin();
    try {
      const { error } = await supabase
        .from('contract_templates')
        .delete()
        .eq('id', templateId)
        .eq('tenant_id', session.user.tenantId);
  
      if (error) throw error;
      return new NextResponse(null, { status: 204 });
    } catch (err) {
      return NextResponse.json(handleError(err, 'Falha ao deletar template'), { status: 500 });
    }
}
