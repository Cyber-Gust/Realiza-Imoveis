import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { TABLES } from '@/types/schema';
import { ROLES } from '@/types/roles';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Rota para gerenciar as requisições de titulares de dados (LGPD).
 * Ex: Solicitação de exportação ou exclusão de dados.
 */

// LISTAR REQUISIÇÕES
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let query = supabase.from('data_subject_requests').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar requisições'), { status: 500 });
  }
}

// CRIAR UMA NOVA REQUISIÇÃO
export async function POST(req) {
  const session = await getServerSession(authOptions);

  // A criação pode ser feita por um usuário autenticado em nome de um contato
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { contact_id, kind, meta } = body;

    // Validação
    if (!contact_id || !kind) {
      return NextResponse.json({ error: 'Campos "contact_id" e "kind" são obrigatórios.' }, { status: 400 });
    }
    if (!['export', 'erasure', 'rectification'].includes(kind)) {
        return NextResponse.json({ error: 'O tipo (kind) da requisição é inválido.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('data_subject_requests')
      .insert({
        tenant_id: session.user.tenantId,
        contact_id,
        kind,
        status: 'open', // Toda nova requisição começa como 'aberta'
        requested_at: new Date().toISOString(),
        meta,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar requisição'), { status: 500 });
  }
}
