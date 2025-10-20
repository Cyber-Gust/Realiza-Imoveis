import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR CONTAS DE INTEGRAÇÃO
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from('integration_accounts')
      .select('id, tenant_id, provider, created_at') // Nunca retorne 'credentials'
      .eq('tenant_id', session.user.tenantId);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar contas de integração'), { status: 500 });
  }
}

// CRIAR/CONECTAR NOVA CONTA DE INTEGRAÇÃO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !ROLES.ADMIN.includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json(); // { provider, credentials }
    const { data, error } = await supabase
      .from('integration_accounts')
      .insert({ ...body, tenant_id: session.user.tenantId })
      .select('id, provider, created_at')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar conta de integração'), { status: 500 });
  }
}
