/**
 * @file components/ChatContainer.tsx
 * @description Contenedor principal del área de chat con desplazamiento vertical automático.
 * 
 * Funcionalidades:
 * 1. Mapea el array de mensajes activos y los entrega al componente `ChatMessage`.
 * 2. Mantiene el auto-scroll en la parte inferior al recibir nuevas respuestas o activar el estado de carga.
 * 3. Renderiza la tarjeta de bienvenida de la terminal cuando la sesión está lista.
 * 4. Renderiza el indicador de carga animado ("Obsidian AI is thinking...") mientras la promesa de red está pendiente.
 */

"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatContainerProps {
  /** Array de mensajes que conforman la conversación activa */
  messages: ChatMessageType[];
  /** Bandera booleana que indica si hay una petición asíncrona en curso */
  isLoading: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  // Referencia al div contenedor para controlar el scroll del DOM
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Efecto de desplazamiento automático: Hace scroll al fondo del contenedor cada vez que
   * la lista de mensajes se actualiza o el estado de carga cambia.
   */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
      id="chat-container"
    >
      {/* Mensaje de Bienvenida del Sistema / Estado Terminal */}
      <div className="flex flex-col items-center justify-center h-32 mb-8 opacity-60">
        <span className="material-symbols-outlined text-4xl mb-2 text-primary" data-icon="hub">
          hub
        </span>
        <h3 className="text-lg font-headline font-semibold text-on-surface tracking-tight">
          Obsidian Terminal Ready
        </h3>
        <p className="text-sm text-on-surface-variant font-mono">
          Connected to Llama-3-70b-Instruct via Groq
        </p>
      </div>

      {/* Lista de Mensajes Renderizados */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Indicador de Estado de Carga ("Obsidian AI is thinking...") */}
      {isLoading && (
        <div className="flex gap-4 max-w-4xl mx-auto w-full pb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-surface-container border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm animate-pulse" data-icon="memory">
              memory
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-on-surface-variant mb-1 font-mono">
              Obsidian AI is thinking...
            </div>
            <div className="bg-surface-container rounded-lg p-4 border border-outline-variant shadow-sm inline-block">
              {/* Puntos animados con CSS typing-indicator */}
              <div className="typing-indicator flex items-center h-4">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Espaciador inferior para evitar que la barra flotante tape el último mensaje */}
      <div className="h-28"></div>
    </div>
  );
};
