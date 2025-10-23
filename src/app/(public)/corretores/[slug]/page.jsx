// app/(public)/corretores/[slug]/page.jsx
import CorretorProfile from '@/components/Corretor/CorretorProfile';
import { promises as fs } from 'fs'; 
import path from 'path';

/**
 * Função para carregar TODOS os dados dos corretores e filtrar pelo slug.
 */
async function getCorretorData(slug) {
    
    // Caminho para o JSON único de corretores
    const filePath = path.join(process.cwd(), 'public', 'corretores.json');
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8'); 
        const allCorretores = JSON.parse(fileContent);
        
        // CORREÇÃO: Filtra o objeto pelo slug da URL
        const corretor = allCorretores[slug]; 

        return corretor || null; // Retorna o corretor encontrado ou null
        
    } catch (error) {
        console.error("Erro ao carregar lista de corretores ou filtrar:", error);
        return null; 
    }
}

// Next.js Server Component
export default async function CorretorPage({ params }) {
    
    // O slug da URL (ex: 'gustavo-brum') é passado em params.slug
    const corretorData = await getCorretorData(params.slug);

    if (!corretorData) {
        return (
            <main className="min-h-screen pt-24 flex items-center justify-center">
                <p className="text-xl text-red-500">Corretor "{params.slug}" não encontrado.</p>
            </main>
        );
    }

    return (
        // pt-24 (96px) para dar espaço ao Header fixo
        <main className="min-h-screen bg-white pt-0"> 
            <CorretorProfile data={corretorData} accentColor="text-accent" />
        </main>
    );
}

// Opcional: Gerar todas as rotas de corretor estaticamente (melhor performance)
export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), 'public', 'corretores.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const allCorretores = JSON.parse(fileContent);
    
    // Mapeia as chaves do objeto (os slugs) para o formato esperado pelo Next.js
    return Object.keys(allCorretores).map((slug) => ({
        slug: slug,
    }));
}