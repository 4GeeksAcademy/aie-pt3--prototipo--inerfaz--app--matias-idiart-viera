/**
 * @file components/ErrorBanner.tsx
 * @description Componente de presentación para notificaciones de error.
 * Muestra alertas legibles ante fallos de conexión a la red o errores HTTP no-2xx devueltos por la API de Groq,
 * evitando que la aplicación falle silenciosamente según las reglas de copilot-instructions.md.
 */

"use client";

import React from "react";

interface ErrorBannerProps {
  /** Texto comprensible del mensaje de error a mostrar al usuario */
  message: string;
  /** Callback para descartar o cerrar la alerta */
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg flex items-center justify-between mx-4 md:mx-8 my-3 shadow-md">
      {/* Icono de error y mensaje descriptivo */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-error" data-icon="error">
          error
        </span>
        <span className="text-sm font-medium">{message}</span>
      </div>

      {/* Botón de cierre para descartar la alerta */}
      <button
        onClick={onDismiss}
        className="text-on-error-container hover:text-on-surface transition-colors p-1 rounded-md"
        title="Descartar error"
      >
        <span className="material-symbols-outlined text-sm" data-icon="close">
          close
        </span>
      </button>
    </div>
  );
};
