// app/(public)/corretores/page.jsx
import CorretorList from '@/components/Corretor/CorretorList';
import PageTitleBar from '@/components/Layout/PageTitleBar';
import { promises as fs } from 'fs'; 
import path from 'path';

/**
 * Função para carregar TODOS os dados dos corretores do JSON central.
 */
async function getAllCorretores() {
    
    // Caminho para o JSON único de corretores
    const filePath = path.join(process.cwd(), 'public', 'corretores.json');
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8'); 
        const allCorretoresObject = JSON.parse(fileContent);
        
        // CONVERTE o objeto de corretores (chave: slug) em um ARRAY para ser mapeado pela lista
        return Object.values(allCorretoresObject); 
        
    } catch (error) {
        console.error("Erro ao carregar lista de corretores:", error);
        return []; 
    }
}

export default async function CorretoresPage() {
    // Carrega o array de corretores
    const corretores = await getAllCorretores();
    const corretorCount = corretores.length;
    
    // Título conforme a solicitação: "Nossos Especialistas"
    const pageTitle = "Nossos Especialistas em Imóveis"; 
    
    return (
        // Espaçamento CORRIGIDO: pt-20 para mobile, lg:pt-24 para desktop
        <main className="min-h-screen bg-white pt-5 lg:pt-0"> 
            
            {/* 1. PageTitleBar - Adicionado para servir como título da página */}
            <PageTitleBar 
                title={pageTitle}
                count={corretorCount}
                backLink="/"
                accentColor="text-accent"
            />
            
            {/* 2. CorretorList - Componente que só renderiza o grid */}
            <CorretorList 
                corretores={corretores} 
                // Título removido do CorretorList, pois o PageTitleBar já o fornece
            />
        </main>
    );
}