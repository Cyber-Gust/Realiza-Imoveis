import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR LEADS
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source');

  try {
    let query = supabase
      .from('leads')
      .select('*, contact_id(id, full_name), assigned_to(id, full_name)')
      .eq('tenant_id', session.user.tenantId);
      
    if (source) {
      query = query.eq('source', source);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar leads'), { status: 500 });
  }
}

// CRIAR NOVO LEAD
export async function POST(req) {
  // Leads podem ser criados publicamente (ex: formulário do site), então não há verificação de sessão aqui.
  // A segurança será aplicada via RLS no Supabase, permitindo inserções anônimas se configurado.
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin(); // Usamos admin para inserir, RLS cuidará do acesso
    
    // É esperado que o `tenant_id` venha no corpo da requisição de um formulário público
    if (!body.tenant_id) {
        return NextResponse.json({ error: 'tenant_id é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar lead'), { status: 500 });
  }
}
