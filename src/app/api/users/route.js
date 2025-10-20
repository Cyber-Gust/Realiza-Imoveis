import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR TODOS OS USUÁRIOS (somente admin do tenant)
export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    try {
        // Busca usuários associados ao mesmo tenant do admin logado
        const { data, error } = await supabase
            .from('user_tenants')
            .select('role, is_active, user:user_id(id, email), profile:user_id(full_name, phone)')
            .eq('tenant_id', session.user.tenantId);

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar usuários'), { status: 500 });
    }
}
