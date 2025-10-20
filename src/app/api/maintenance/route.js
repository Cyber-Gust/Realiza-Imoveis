import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ROLES } from '@/types/roles';

// Rota para sumarizar o módulo de manutenção
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || ![ROLES.ADMIN, ROLES.MANAGER, ROLES.INSPECTOR].includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 403 });
  }

  // Apenas um exemplo de resposta, poderia ser mais elaborado.
  return NextResponse.json({
    message: "Bem-vindo ao módulo de Manutenção e Operações.",
    available_modules: ["inspections", "tickets", "vendors", "work-orders"]
  });
}
