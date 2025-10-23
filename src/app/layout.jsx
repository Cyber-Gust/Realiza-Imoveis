// app/layout.jsx

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import './globals.css'

// ... (imports)

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`bg-primary-backgroundClaro`}
      >
        <Header />
        
        {/*
          CORREÇÃO: Aumentamos o padding para garantir que o Header (que é mais alto no desktop)
          não cubra o conteúdo. 
          pt-[140px] para desktop/tablet, pt-[80px] para mobile.
        */}
        <main className="flex-grow pt-[80px] md:pt-[140px] bg-primary-backgroundClaro">
            {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}