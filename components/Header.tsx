/**
 * @file components/Header.tsx
 * @description Componente de presentación para la barra superior (TopAppBar) de la aplicación.
 * Muestra el logotipo de Obsidian AI, el nombre del modelo de IA activo (Llama 3), el botón Settings para abrir configuración y el botón "New Chat".
 */

"use client";

import React from "react";

interface HeaderProps {
  /** Nombre del modelo de IA activo para mostrar en la insignia superior */
  modelName: string;
  /** Función callback que se ejecuta al presionar el botón "New Chat" */
  onNewChat?: () => void;
  /** Función callback que abre el modal de Configuración / Settings */
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ modelName, onNewChat, onOpenSettings }) => {
  return (
    <header className="bg-background dark:bg-background fixed top-0 w-full border-b border-outline-variant flex justify-between items-center px-4 h-14 w-full z-50">
      {/* Título de la marca y Badge del modelo activo */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-headline font-black tracking-tighter text-on-surface">
          Obsidian AI
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-highest border border-outline-variant text-primary ml-2">
          {modelName}
        </span>
      </div>

      {/* Botones de acción del encabezado */}
      <div className="flex items-center gap-4">
        {/* Botón: Abrir modal de Configuración (Settings) */}
        <button
          onClick={onOpenSettings}
          className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform p-2 rounded-md hover:bg-surface-container"
          title="Configuración"
        >
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
        </button>

        {/* Botón secundario: Terminal */}
        <button
          className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 transition-transform p-2 rounded-md hover:bg-surface-container"
          title="Terminal"
        >
          <span className="material-symbols-outlined" data-icon="terminal">
            terminal
          </span>
        </button>

        {/* Botón principal: Iniciar nueva conversación (Archiva la conversación actual en el historial) */}
        <button
          onClick={onNewChat}
          className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold py-1.5 px-4 rounded transition-colors text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm" data-icon="add">
            add
          </span>
          New Chat
        </button>
      </div>
    </header>
  );
};
