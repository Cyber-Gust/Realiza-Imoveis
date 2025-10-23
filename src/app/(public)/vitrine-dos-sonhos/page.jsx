// app/(public)/vitrine-dos-sonhos/page.jsx
import PropertyList from '@/components/Property/PropertyList';
import PageTitleBar from '@/components/Layout/PageTitleBar';

// CORREÇÃO CRÍTICA: Mudar a importação de 'fs' para usar 'fs/promises'
import { promises as fs } from 'fs';
import path from 'path'; // Manter o path

// Função de carregamento de dados (AGORA USANDO FS PROMISES E ASYNC/AWAIT)
async function getVitrineProperties() {
    
    // Caminho para o seu JSON (ajuste se estiver em outra pasta)
    const filePath = path.join(process.cwd(), 'public', 'vitrinedossonhos.json');
    
    try {
        // CORREÇÃO: Usar fs.readFile (promessa) com await
        const fileContent = await fs.readFile(filePath, 'utf8'); 
        return JSON.parse(fileContent);
    } catch (error) {
        // O erro é comum se o arquivo não existe ou o ambiente não consegue lê-lo
        console.error("Erro ao ler vitrinedossonhos.json:", error);
        return [];
    }
}


export default async function VitrineDosSonhosPage() {
    const properties = await getVitrineProperties();
    const propertyCount = properties.length;

    const pageTitle = "Imóveis dos Sonhos";

    return (
        // Espaçamento corrigido para Mobile e Desktop
        <main className="min-h-screen bg-white pt-5 lg:pt-24"> 

            <PageTitleBar
                title={pageTitle}
                count={propertyCount}
                backLink="/"
                accentColor="text-accent"
            />

            <div>
                <PropertyList 
                    properties={properties} 
                    title="" 
                />
            </div>

        </main>
    );
}