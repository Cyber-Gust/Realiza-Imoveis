// app/(public)/lancamentos-na-planta/page.jsx
import PropertyList from '@/components/Property/PropertyList';
import PageTitleBar from '@/components/Layout/PageTitleBar';
// Importação correta para Server Components (fs/promises)
import { promises as fs } from 'fs'; 
import path from 'path';

/**
 * Função para carregar dados do JSON de Lançamentos na Planta.
 * Simula uma chamada de API, mas lê o arquivo local.
 */
async function getPlantaProperties() {
    
    // Define o caminho para o arquivo planta.json
    const filePath = path.join(process.cwd(), 'public', 'planta.json');
    
    try {
        // Usa fs.readFile (promessa) com await para ler o conteúdo do arquivo
        const fileContent = await fs.readFile(filePath, 'utf8'); 
        return JSON.parse(fileContent);
    } catch (error) {
        // Retorna um array vazio em caso de erro (ex: arquivo não encontrado)
        console.error("Erro ao ler public/planta.json:", error);
        return [];
    }
}


export default async function LancamentosNaPlantaPage() {
    const properties = await getPlantaProperties();
    const propertyCount = properties.length;

    // Título específico para esta página
    const pageTitle = "Lançamentos na Planta"; 

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