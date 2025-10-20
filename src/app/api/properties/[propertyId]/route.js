import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UM IMÓVEL
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  const supabase = getSupabaseAdmin();
  const { propertyId } = params;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, owner_contact_id(*)')
      .eq('id', propertyId)
      .single();

    // RLS garante o acesso. Se for público e não estiver ativo, não encontrará.
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });

    // Se o usuário não estiver logado, mas o imóvel não estiver ativo, negar.
    if (!session && data.status !== 'active') {
         return NextResponse.json({ error: 'Imóvel não disponível.' }, { status: 403 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar imóvel'), { status: 500 });
  }
}

// ATUALIZAR UM IMÓVEL
export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const { propertyId } = params;
    const supabase = getSupabaseAdmin();

    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('properties')
            .update({ ...body, updated_at: new Date() })
            .eq('id', propertyId)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao atualizar imóvel'), { status: 500 });
    }
}
