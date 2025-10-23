// src/app/(public)/imoveis/[slug]/page.jsx

import { promises as fs } from 'fs'; 
import path from 'path';
import 'server-only'; // Garantir que o código Node.js (fs, path) só rode no servidor

// Importar todos os componentes que você criou
import PageTitleBar from '@/components/Layout/PageTitleBar';
import CorretorMiniCard from '@/components/Corretor/CorretorMiniCard';
import ContactForm from '@/components/Layout/Sidebar/ContactForm';
import DetailHeader from '@/components/Property/Detail/DetailHeader';
import ImageGallery from '@/components/Property/Detail/ImageGallery';
import FeaturesBar from '@/components/Property/Detail/FeaturesBar';
import DescriptionTabs from '@/components/Property/Detail/DescriptionTabs';
import ValueTable from '@/components/Property/Detail/ValueTable';


// --- FUNÇÕES DE CARREGAMENTO DE DADOS (SERVER-SIDE) ---

/**
 * Busca os dados do corretor pelo ID no JSON geral de corretores.
 */
async function getCorretorById(id) {
    const corretorFilePath = path.join(process.cwd(), 'public', 'corretores.json');
    try {
        const fileContent = await fs.readFile(corretorFilePath, 'utf8');
        const allCorretores = JSON.parse(fileContent);
        
        // Converte o Object para Array para buscar o corretor pelo ID
        return Object.values(allCorretores).find(c => c.id === id) || null;
    } catch (e) {
        console.error("ERRO: Não foi possível carregar o corretor por ID.", e);
        return null;
    }
}

/**
 * Busca o imóvel específico no array geral de imóveis usando o SLUG.
 */
async function getImovelData(slug) {
    // Caminho para o JSON ARRAY geral
    const filePath = path.join(process.cwd(), 'public', 'imoveis-geral.json'); 
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const allImoveisArray = JSON.parse(fileContent); // JSON é um array
        
        // Busca o imóvel cujo slug corresponde ao params.slug
        const imovel = allImoveisArray.find(item => item.slug === slug);
        
        return imovel || null;
    } catch (e) {
        console.error("ERRO: Não foi possível carregar e buscar imóvel por slug.", e);
        return null;
    }
}


// --- COMPONENTE DA PÁGINA (SERVER COMPONENT) ---

export default async function ImovelDetailPage({ params }) {
    
    // 1. Carrega o imóvel
    const imovel = await getImovelData(params.slug); 
    
    if (!imovel) {
        return (
             <main className="min-h-screen pt-24 text-center py-16">
                <p className="text-xl text-red-600">Imóvel "{params.slug}" não encontrado.</p>
             </main>
        );
    }

    // 2. Carrega o corretor responsável
    const corretor = await getCorretorById(imovel.corretorId);

    return (
        <main className="min-h-screen bg-gray-50 pt-24"> 
            
            {/* PageTitleBar com código e botão de voltar */}
            <PageTitleBar 
                title={`Detalhes imóvel cód. ${imovel.id}`}
                backLink="/imoveis" 
                count={0}
                accentColor="text-gray-700" 
            />
            
            {/* Layout de Duas Colunas */}
            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row md:space-x-8">

                {/* 1. Coluna Principal (Conteúdo, 2/3 da tela) */}
                <div className="w-full md:w-2/3 space-y-8">
                    
                    <DetailHeader imovel={imovel} accentColor="text-accent" />
                    <ImageGallery midias={imovel.midias} />
                    <FeaturesBar caracteristicas={imovel.caracteristicas} accentColor="text-accent" />
                    <DescriptionTabs detalhes={imovel.detalhes} />
                    <ValueTable valores={imovel.valores} />
                </div>

                {/* 2. Coluna Lateral (Sidebar, 1/3 da tela) */}
                <aside className="w-full md:w-1/3 space-y-8 mt-10 md:mt-0">
                    {/* sticky top ajustado para evitar conflito com o Header e PageTitleBar */}
                    <div className="sticky top-[112px]"> 
                         <ContactForm accentColor="bg-accent" />
                         {corretor && <CorretorMiniCard corretor={corretor} accentColor="text-accent" />}
                    </div>
                </aside>
            </div>
            
        </main>
    );
}

// Opcional: Para pré-renderizar rotas estaticamente no build (Recomendado)
export async function generateStaticParams() {
    const filePath = path.join(process.cwd(), 'public', 'imoveis-geral.json');
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const allImoveisArray = JSON.parse(fileContent);

        // Mapeia o array para o formato { slug: '...' }
        return allImoveisArray.map((imovel) => ({
            slug: imovel.slug,
        }));
    } catch (e) {
        console.warn("Aviso: generateStaticParams falhou ao ler o JSON. Rotas dinâmicas serão usadas.");
        return [];
    }
}