import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { TABLES } from '@/types/schema';
import { ROLES } from '@/types/roles';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Rota para gerenciar os consentimentos de LGPD.
 * Apenas administradores e gerentes podem listar todos os consentimentos.
 */

// LISTAR CONSENTIMENTOS
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get('contact_id');

  try {
    let query = supabase.from('consents').select('*');

    // Filtra por um contato específico, se o ID for fornecido
    if (contactId) {
      query = query.eq('contact_id', contactId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar consentimentos'), { status: 500 });
  }
}

// CRIAR UM NOVO CONSENTIMENTO
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { contact_id, purpose, lawful_basis, granted = true } = body;

    // Validação básica
    if (!contact_id || !purpose || !lawful_basis) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('consents')
      .insert({
        tenant_id: session.user.tenantId, // Associa ao tenant do usuário logado
        contact_id,
        purpose,
        lawful_basis,
        granted,
        granted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar consentimento'), { status: 500 });
  }
}
