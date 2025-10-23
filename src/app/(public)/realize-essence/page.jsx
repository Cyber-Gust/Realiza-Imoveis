// app/(public)/realize-essence/page.jsx
import PropertyList from '@/components/Property/PropertyList';
import PageTitleBar from '@/components/Layout/PageTitleBar';
// Importação correta para Server Components (fs/promises)
import { promises as fs } from 'fs'; 
import path from 'path';

/**
 * Função para carregar dados do JSON de Alto Padrão.
 */
async function getPremiumProperties() {
    
    // Define o caminho para o arquivo altopadrao.json
    // IMPORTANTE: Se o nome do arquivo for "altopadrao.json", use esse nome
    const filePath = path.join(process.cwd(), 'public', 'altopadrao.json');
    
    try {
        // Usa fs.readFile (promessa) com await para ler o conteúdo do arquivo
        const fileContent = await fs.readFile(filePath, 'utf8'); 
        return JSON.parse(fileContent);
    } catch (error) {
        // Retorna um array vazio em caso de erro
        console.error("Erro ao ler public/altopadrao.json:", error);
        return [];
    }
}


export default async function RealizeEssencePage() {
    const properties = await getPremiumProperties();
    const propertyCount = properties.length;

    // Título específico para a linha premium
    const pageTitle = "Realize Essence: Alto Padrão"; 

    return (
        // Reutilizando as classes de espaçamento: pt-20 (mobile) e lg:pt-24 (desktop)
             <main className="min-h-screen bg-white pt-5 lg:pt-24">

            {/* 1. PageTitleBar */}
            <PageTitleBar
                title={pageTitle}
                count={propertyCount}
                backLink="/" 
                accentColor="text-accent" // Mantém a cor de destaque
            />

            {/* 2. PropertyList (o conteúdo da página) */}
            <div> 
                <PropertyList 
                    properties={properties} 
                    // Título interno opcional para a lista
                    title="" 
                />
            </div>
            
        </main>
    );
}