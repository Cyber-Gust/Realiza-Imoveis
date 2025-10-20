import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR NEGÓCIOS (DEALS)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get('stage');

  try {
    let query = supabase
      .from('deals')
      .select('*, lead_id(id, name), property_id(id, title), owner_user_id(id, full_name)')
      .eq('tenant_id', session.user.tenantId);
      
    if (stage) {
      query = query.eq('stage', stage);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar negócios'), { status: 500 });
  }
}

// CRIAR NOVO NEGÓCIO
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('deals')
      .insert({ 
        ...body, 
        tenant_id: session.user.tenantId,
        owner_user_id: session.user.id // Dono do negócio é quem cria
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao criar negócio'), { status: 500 });
  }
}
