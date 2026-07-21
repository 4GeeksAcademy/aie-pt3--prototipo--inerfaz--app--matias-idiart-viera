/**
 * @file app/layout.tsx
 * @description Layout raíz de Next.js (App Router).
 * Define la estructura HTML base, la carga global de hojas de estilo (Tailwind CSS),
 * la inclusión de fuentes tipográficas externas (Geist) e iconos (Material Symbols Outlined),
 * y los metadatos SEO de la aplicación.
 */

import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadatos globales SEO para el documento HTML
 */
export const metadata: Metadata = {
  title: "Obsidian AI - Chat Interface",
  description: "Interfaz de chat transparente con auditoría de consumo de tokens en tiempo real e integración con Groq Llama 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* Fuente de tipografía Geist desde Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Hojas de estilos para iconos de Google Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface h-screen w-screen overflow-hidden flex flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
