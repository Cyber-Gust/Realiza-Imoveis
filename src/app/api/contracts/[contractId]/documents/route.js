import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// LISTAR DOCUMENTOS DE UM CONTRATO
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });

  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('contract_id', contractId)
      .eq('tenant_id', session.user.tenantId);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar documentos'), { status: 500 });
  }
}

// ADICIONAR UM NOVO DOCUMENTO (METADADOS)
export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  const { contractId } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json(); // Ex: { doc_type: 'RG', storage_path: 'path/to/doc.pdf' }
    const { data, error } = await supabase
      .from('documents')
      .insert({ 
          ...body, 
          contract_id: contractId, 
          tenant_id: session.user.tenantId 
        })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao adicionar documento'), { status: 500 });
  }
}
