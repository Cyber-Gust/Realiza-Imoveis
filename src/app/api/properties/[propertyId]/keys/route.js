import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR CHAVES E STATUS
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

    const { propertyId } = params;
    const supabase = getSupabaseAdmin();
    
    try {
        const { data, error } = await supabase
            .from('property_keys')
            .select('*, holder_contact_id(full_name), checkout_by(profiles(full_name))')
            .eq('property_id', propertyId);
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar chaves'), { status: 500 });
    }
}
