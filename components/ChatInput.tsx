/**
 * @file components/ChatInput.tsx
 * @description Componente de presentación para el área de entrada de texto del usuario.
 * 
 * Funcionalidades:
 * 1. Campo de texto multi-línea con auto-ajuste de altura dinámico (hasta 200px máximo).
 * 2. Soporte de atajos de teclado:
 *    - Presionar `Enter`: Envía el mensaje inmediatamente.
 *    - Presionar `Shift + Enter`: Inserta un salto de línea sin enviar.
 * 3. Deshabilitación de controles durante peticiones de red activas (`isLoading === true`).
 * 4. Botón flotante de envío con cambio de estado de cursor y opacidad.
 */

"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  /** Callback para notificar al orquestador padre que el usuario envió un mensaje */
  onSendMessage: (message: string) => void;
  /** Estado de carga activo para bloquear el campo y botón de envío */
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  // Estado local para almacenar el texto que escribe el usuario
  const [input, setInput] = useState<string>("");
  // Referencia al elemento textarea del DOM para calcular la altura dinámica
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Maneja el cambio de texto y ajusta dinámicamente la altura del textarea.
   */
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  /**
   * Maneja los eventos de teclado para permitir Enter (envío) o Shift+Enter (salto de línea).
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * Ejecuta la acción de envío del mensaje si no está vacío ni cargando.
   */
  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
    // Resetea la altura del campo tras el envío
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-transparent pt-4 pb-6 px-4 md:px-8 z-20">
      <div className="max-w-4xl mx-auto relative group">
        {/* Resplandor de enfoque visual (Glow effect) */}
        <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
        
        {/* Contenedor del campo de texto */}
        <div className="relative bg-surface-container rounded-xl border border-outline-variant focus-within:border-primary shadow-lg overflow-hidden flex flex-col">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Message Obsidian AI... (Press Shift+Enter for new line)"
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface resize-none p-4 min-h-[60px] max-h-[200px] text-sm placeholder:text-on-surface-variant/50 disabled:opacity-50"
          />
          
          {/* Barra de herramientas inferior del campo */}
          <div className="flex justify-between items-center px-3 pb-3 pt-1">
            <div className="flex items-center gap-1">
              {/* Botón secundario: Adjuntar archivo (Maqueta) */}
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container-highest"
                title="Attach file"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="attach_file">
                  attach_file
                </span>
              </button>

              {/* Botón secundario: Buscar en la web (Maqueta) */}
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-md hover:bg-surface-container-highest"
                title="Search web"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="travel_explore">
                  travel_explore
                </span>
              </button>
            </div>

            {/* Botón Principal: Enviar Mensaje */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-fixed-dim text-on-primary p-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" data-icon="send">
                send
              </span>
            </button>
          </div>
        </div>

        {/* Descargo de responsabilidad del modelo en el pie */}
        <div className="text-center mt-2">
          <span className="text-[10px] text-on-surface-variant font-mono">
            Obsidian AI may produce inaccurate information about people, places, or facts.
          </span>
        </div>
      </div>
    </div>
  );
};
