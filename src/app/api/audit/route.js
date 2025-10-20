import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { TABLES } from '@/types/schema';
import { ROLES } from '@/types/roles';
// Para obter a sessão no backend (API Route)
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Rota para buscar os logs de auditoria.
 * Apenas usuários com perfil 'admin' ou 'manager' podem acessar.
 * Suporta paginação e filtros via query params.
 * @param {Request} req - O objeto da requisição.
 */
export async function GET(req) {
  const session = await getServerSession(authOptions);

  // 1. Validação de Segurança: Verifica se o usuário tem permissão
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);

  // 2. Parâmetros de Paginação e Filtro
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '25', 10);
  const offset = (page - 1) * limit;

  const tableName = searchParams.get('table_name');
  const actorId = searchParams.get('actor');
  const recordId = searchParams.get('record_id');

  try {
    let query = supabase
      .from(TABLES.AUDIT_LOG)
      .select('*', { count: 'exact' }) // 'exact' para obter o total de registros
      .order('at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 3. Aplica filtros dinamicamente
    if (tableName) {
      query = query.eq('table_name', tableName);
    }
    if (actorId) {
      query = query.eq('actor', actorId);
    }
    if (recordId) {
        query = query.eq('record_id', recordId);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // 4. Retorna a resposta com dados e metadados de paginação
    return NextResponse.json({
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar logs de auditoria'), { status: 500 });
  }
}
