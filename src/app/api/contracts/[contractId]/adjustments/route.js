import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR REAJUSTES DE UM CONTRATO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  
  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    // Primeiro, verifica se o contrato pertence ao tenant do usuário
    const { data: contract } = await supabase
        .from('contracts')
        .select('id')
        .eq('id', contractId)
        .eq('tenant_id', session.user.tenantId)
        .single();

    if (!contract) {
        return NextResponse.json({ error: 'Contrato não encontrado ou acesso negado.' }, { status: 404 });
    }

    // Se o contrato for válido, busca os reajustes
    const { data, error } = await supabase
      .from('contract_reajustes')
      .select('*')
      .eq('contract_id', contractId);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar reajustes'), { status: 500 });
  }
}

// ADICIONAR UM NOVO REAJUSTE
export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('contract_reajustes')
      .insert({ ...body, contract_id: contractId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar reajuste'), { status: 500 });
  }
}
