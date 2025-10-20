import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER DADOS DE UM USUÁRIO
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

    const { userId } = params;
    const supabase = getSupabaseAdmin();

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, user_tenants(tenant_id, role, is_active)')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar dados do usuário'), { status: 500 });
    }
}

// ATUALIZAR DADOS DE UM USUÁRIO (PERFIL OU PERMISSÃO)
export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    const { userId } = params;

    // Um usuário pode editar o próprio perfil.
    // Um admin/manager pode editar outros usuários do mesmo tenant.
    if (!session || (session.user.id !== userId && ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role))) {
         return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }
    
    const supabase = getSupabaseAdmin();
    try {
        const { profileData, tenantRoleData } = await req.json();

        // Atualiza perfil
        if(profileData) {
            const { error: profileError } = await supabase.from('profiles').update(profileData).eq('id', userId);
            if (profileError) throw profileError;
        }

        // Atualiza role no tenant (só para admins)
        if(tenantRoleData && [ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
             const { error: roleError } = await supabase
                .from('user_tenants')
                .update(tenantRoleData)
                .eq('user_id', userId)
                .eq('tenant_id', session.user.tenantId);
             if (roleError) throw roleError;
        }

        return NextResponse.json({ message: 'Usuário atualizado com sucesso.' });
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao atualizar usuário'), { status: 500 });
    }
}
