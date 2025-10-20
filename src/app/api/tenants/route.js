import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR TENANTS (ADMIN GERAL)
export async function GET(req) {
    const session = await getServerSession(authOptions);
    // Idealmente, esta rota deveria ser para super-admins.
    // Por enquanto, vamos restringir a admins de qualquer tenant.
    if (!session || session.user.role !== ROLES.ADMIN) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    try {
        const { data, error } = await supabase.from('tenants').select('*');
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar tenants'), { status: 500 });
    }
}

// CRIAR NOVO TENANT (ADMIN GERAL)
export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== ROLES.ADMIN) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('tenants')
            .insert(body)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao criar tenant'), { status: 500 });
    }
}
