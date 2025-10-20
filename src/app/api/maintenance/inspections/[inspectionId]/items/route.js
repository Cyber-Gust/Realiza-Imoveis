import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR ITENS DE UMA VISTORIA
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
  
  const { inspectionId } = params;
  const supabase = getSupabaseAdmin();

  try {
    // Primeiro, verifica se o usuário tem acesso à vistoria pai
    const { data: inspectionData, error: inspectionError } = await supabase
      .from('inspections')
      .select('id')
      .eq('id', inspectionId)
      .eq('tenant_id', session.user.tenantId)
      .single();

    if (inspectionError || !inspectionData) {
        return NextResponse.json({ error: 'Vistoria não encontrada ou acesso negado.' }, { status: 404 });
    }

    // Se tiver acesso, busca os itens
    const { data, error } = await supabase
      .from('inspection_items')
      .select('*')
      .eq('inspection_id', inspectionId);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar itens da vistoria'), { status: 500 });
  }
}

// ADICIONAR UM ITEM A UMA VISTORIA
export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.INSPECTOR].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }
  
  const { inspectionId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('inspection_items')
      .insert({ ...body, inspection_id: inspectionId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao adicionar item à vistoria'), { status: 500 });
  }
}
