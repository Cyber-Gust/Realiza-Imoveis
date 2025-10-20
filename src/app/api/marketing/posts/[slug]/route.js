import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { handleError } from '@/lib/utils';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// OBTER UM POST PELO SLUG
export async function GET(req, { params }) {
  const { slug } = params;
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('marketing_posts')
      .select('*') // Retorna o corpo completo do post
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao buscar post'), { status: 500 });
  }
}

// ATUALIZAR UM POST
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }
  
  const { slug } = params;
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('marketing_posts')
      .update(body)
      .eq('slug', slug)
      .eq('tenant_id', session.user.tenantId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(handleError(err, 'Falha ao atualizar post'), { status: 500 });
  }
}
