import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR BAIRROS (PÚBLICO)
export async function GET(req) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  try {
    let query = supabase
      .from('neighborhoods')
      .select('name, city, state');

    if (city) {
      query = query.eq('city', city);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar bairros'), { status: 500 });
  }
}

// CADASTRAR NOVO BAIRRO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('neighborhoods')
      .insert({ ...body, tenant_id: session.user.tenantId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao cadastrar bairro'), { status: 500 });
  }
}
