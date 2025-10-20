import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR IMÓVEIS (PÚBLICO E PRIVADO)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);

  try {
    let query = supabase.from('properties').select(`
      id, tenant_id, code, title, description, listing_type, status,
      price, condo_fee, iptu, address, area_m2, bedrooms, bathrooms, parking_spots,
      pet_friendly, furnished, features, owner_contact_id(full_name, phone)
    `);

    // Lógica para o site público: apenas imóveis 'active'
    if (!session) {
      query = query.eq('status', 'active');
    }
    // Lógica para o painel interno: respeita a RLS do Supabase
    else {
        // A RLS já garante que o usuário só verá imóveis do seu tenant
    }

    // Adiciona filtros da URL
    searchParams.forEach((value, key) => {
        if(key !== 'page' && key !== 'limit') {
           query = query.eq(key, value);
        }
    });

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar imóveis'), { status: 500 });
  }
}

// CRIAR NOVO IMÓVEL
export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('properties')
            .insert({ ...body, tenant_id: session.user.tenantId, created_by: session.user.id })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao criar imóvel'), { status: 500 });
    }
}
