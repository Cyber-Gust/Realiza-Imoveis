import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { ROLES } from '@/types/roles';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Rota raiz de Compliance.
 * Fornece um resumo das métricas de conformidade (LGPD).
 * Acesso restrito a administradores e gerentes.
 */
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 1. Contar requisições de titulares de dados em aberto
    const { count: openRequestsCount, error: requestsError } = await supabase
      .from('data_subject_requests')
      .select('*', { count: 'exact', head: true }) // 'head: true' otimiza a contagem
      .eq('status', 'open');

    if (requestsError) throw requestsError;

    // 2. Contar total de consentimentos registrados
    const { count: consentsCount, error: consentsError } = await supabase
      .from('consents')
      .select('*', { count: 'exact', head: true });

    if (consentsError) throw consentsError;

    // 3. Monta o payload do dashboard de compliance
    const complianceSummary = {
      open_data_subject_requests: openRequestsCount,
      total_consents: consentsCount,
      last_checked: new Date().toISOString(),
    };

    return NextResponse.json(complianceSummary);

  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao obter resumo de compliance'), { status: 500 });
  }
}
