// components/Property/Detail/ImageGallery.jsx
'use client';

import React from 'react';

const ImageGallery = ({ midias }) => {
    // Mínimo: mostra as imagens lado a lado, com a primeira maior
    const firstImage = midias[0]?.url || 'https://via.placeholder.com/800x600?text=Foto+Principal';
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">Fotos ({midias.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="col-span-2 md:col-span-2 relative aspect-video cursor-pointer rounded-lg overflow-hidden">
                    <img src={firstImage} alt="Foto Principal" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">1 / {midias.length}</span>
                </div>
                {midias.slice(1, 4).map((m, index) => (
                     <img key={index} src={m.url} alt={m.legenda} className="w-full h-full object-cover aspect-video rounded-lg cursor-pointer" />
                ))}
                {/* Botão de Fotos (apenas visual) */}
                <button className="col-span-2 md:col-span-4 mt-2 bg-gray-100 text-gray-700 font-medium py-2 rounded-lg">Ver todas as {midias.length} fotos</button>
            </div>
        </div>
    );
};

export default ImageGallery;