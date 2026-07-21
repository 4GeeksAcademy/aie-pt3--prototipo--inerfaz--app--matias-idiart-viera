/**
 * @file components/SettingsModal.tsx
 * @description Componente modal interactivo de Configuración de Apariencia e Interfaz (Settings).
 * 
 * Funcionalidades:
 * 1. Selector de Tema Visual: Alterna dinámicamente entre el Modo Oscuro ('dark') y el Modo Claro ('light').
 * 2. Notificación Informativa: Indica al usuario que los parámetros del modelo de IA (modelo, temperatura y max_tokens)
 *    se encuentran alojados en la pestaña "Models" de la barra lateral.
 */

"use client";

import React from "react";
import { AppSettings } from "@/types/chat";

interface SettingsModalProps {
  /** Indica si el modal se encuentra abierto */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Estado de configuración global de la aplicación */
  settings: AppSettings;
  /** Callback para actualizar una o más propiedades de la configuración */
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Tarjeta flotante del Modal */}
      <div className="bg-surface-container dark:bg-surface-container border border-outline-variant rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" data-icon="settings">
              settings
            </span>
            <h3 className="text-lg font-headline font-bold text-on-surface">
              Configuración de Apariencia
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-xl" data-icon="close">
              close
            </span>
          </button>
        </div>

        {/* Cuerpo de Opciones de Configuración */}
        <div className="p-6 space-y-6">
          {/* SECCIÓN: Tema Visual (Claro / Oscuro) */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
              Tema Visual de la Interfaz
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: "dark" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  settings.theme === "dark"
                    ? "bg-primary/20 border-primary text-primary font-bold shadow-sm"
                    : "bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-lg" data-icon="dark_mode">
                  dark_mode
                </span>
                Modo Oscuro
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: "light" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  settings.theme === "light"
                    ? "bg-primary/20 border-primary text-primary font-bold shadow-sm"
                    : "bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-lg" data-icon="light_mode">
                  light_mode
                </span>
                Modo Claro
              </button>
            </div>
          </div>

          {/* Tarjeta Informativa indicando la nueva ubicación de los modelos */}
          <div className="p-3.5 bg-surface-container-highest border border-outline-variant/60 rounded-lg space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-tertiary font-bold">
              <span className="material-symbols-outlined text-sm" data-icon="smart_toy">
                smart_toy
              </span>
              <span>Configuración de Modelos de IA</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-[11px]">
              La selección del modelo Groq, el nivel de creatividad (temperatura) y el tamaño máximo de respuesta ahora se gestionan directamente desde la pestaña <strong className="text-on-surface">Models</strong> en la barra lateral.
            </p>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-highest flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold py-2 px-6 rounded-lg transition-colors text-sm"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
