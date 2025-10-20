import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR USUÁRIOS DE UM TENANT
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    const { tenantId } = params;

    if (!session || (session.user.tenantId !== tenantId && session.user.role !== ROLES.ADMIN)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }
     if (![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
        return NextResponse.json({ error: 'Permissão insuficiente.' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    try {
        const { data, error } = await supabase
            .from('user_tenants')
            .select('role, is_active, profiles:user_id(id, full_name, email, phone)')
            .eq('tenant_id', tenantId);
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar usuários do tenant'), { status: 500 });
    }
}
