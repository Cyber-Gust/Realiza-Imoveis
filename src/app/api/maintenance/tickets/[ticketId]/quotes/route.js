import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR ORÇAMENTOS DE UM CHAMADO
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    
    const { ticketId } = params;
    const supabase = getSupabaseAdmin();

    try {
        const { data, error } = await supabase
            .from('ticket_quotes')
            .select('*, vendor_id(id, contact_id(full_name))')
            .eq('ticket_id', ticketId);

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao buscar orçamentos'), { status: 500 });
    }
}

// ADICIONAR ORÇAMENTO A UM CHAMADO
export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.INSPECTOR].includes(session.user.role)) {
        return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
    }

    const { ticketId } = params;
    const supabase = getSupabaseAdmin();

    try {
        const body = await req.json();
        const { data, error } = await supabase
            .from('ticket_quotes')
            .insert({ ...body, ticket_id: ticketId })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json(handleError(err, 'Falha ao adicionar orçamento'), { status: 500 });
    }
}
