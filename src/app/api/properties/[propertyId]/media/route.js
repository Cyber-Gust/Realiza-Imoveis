import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR MÍDIAS DE UM IMÓVEL
export async function GET(req, { params }) {
    const { propertyId } = params;
    const supabase = getSupabaseAdmin();
    try {
        const { data, error } = await supabase
            .from('property_media')
            .select('*')
            .eq('property_id', propertyId)
            .order('position');
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar mídias'), { status: 500 });
    }
}

// ADICIONAR NOVA MÍDIA
export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }
    const { propertyId } = params;
    const supabase = getSupabaseAdmin();
    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('property_media')
            .insert({ ...body, property_id: propertyId })
            .select()
            .single();
        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao adicionar mídia'), { status: 500 });
    }
}
