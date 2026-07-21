/**
 * @file components/ChatMessage.tsx
 * @description Componente de presentación encargado de renderizar una sola burbuja de mensaje dentro del historial de chat.
 * 
 * Características:
 * 1. Diferenciación visual clara:
 *    - Usuario: Alineado a la derecha, fondo violeta primario, avatar con icono 'person'.
 *    - Asistente IA: Alineado a la izquierda, fondo oscuro de superficie, avatar con icono 'memory' y badge de latencia en milisegundos.
 * 2. Procesamiento de bloques de código Markdown (```lenguaje ... ```):
 *    - Renderiza cajas preformateadas con sintaxis monoespaciada.
 *    - Añade una barra superior con la etiqueta del lenguaje de programación y un botón funcional de "Copy" al portapapeles.
 */

"use client";

import React, { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  /** Objeto de mensaje individual con contenido, rol, timestamp y latencia */
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Estado local para notificar visualmente cuando el código ha sido copiado exitosamente
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Determina si el mensaje fue enviado por el usuario humano
  const isUser = message.role === "user";

  /**
   * Copia el fragmento de código especificado al portapapeles usando la API nativa navigator.clipboard.
   */
  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    // Vuelve el botón al estado original tras 2 segundos
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  /**
   * Parsea el texto del mensaje y detecta bloques de código delimitados por triple comilla invertida (```).
   * Devuelve un array de elementos React mezclando texto formateado y bloques de código interactivos.
   */
  const renderFormattedContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockCount = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Fragmento de texto normal previo al bloque de código
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
            {content.substring(lastIndex, match.index)}
          </div>
        );
      }

      const lang = match[1] || "text";
      const code = match[2].trim();
      const currentBlock = blockCount++;

      // Renderizado del bloque de código interactivo con botón de copiar
      parts.push(
        <div key={`code-${currentBlock}`} className="bg-surface-container-lowest my-3 rounded-lg overflow-hidden border border-outline-variant">
          <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant bg-surface-dim">
            <span className="text-xs font-mono text-on-surface-variant">{lang}</span>
            <button
              onClick={() => handleCopyCode(code, currentBlock)}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs" data-icon="content_copy">
                {copiedIndex === currentBlock ? "check" : "content_copy"}
              </span>
              {copiedIndex === currentBlock ? "Copiado!" : "Copy"}
            </button>
          </div>
          <pre className="m-0 border-0 rounded-none overflow-x-auto p-4">
            <code className="text-sm font-mono text-on-surface">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Fragmento de texto restante tras el último bloque de código
    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
          {content.substring(lastIndex)}
        </div>
      );
    }

    return parts.length > 0 ? parts : <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  };

  // --- VISTA DEL MENSAJE DE USUARIO ---
  if (isUser) {
    return (
      <div className="flex gap-4 max-w-4xl mx-auto w-full flex-row-reverse">
        {/* Avatar de Usuario */}
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-surface-container-highest border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-inverse-surface text-sm" data-icon="person">
            person
          </span>
        </div>
        {/* Burbuja de Mensaje del Usuario */}
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <div className="text-xs font-medium text-on-surface-variant mb-1 font-mono">You</div>
          <div className="bg-primary rounded-lg p-4 text-on-primary text-sm leading-relaxed shadow-sm inline-block max-w-[85%] text-left">
            {renderFormattedContent(message.content)}
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DEL MENSAJE DEL ASISTENTE DE IA ---
  return (
    <div className="flex gap-4 max-w-4xl mx-auto w-full">
      {/* Avatar de la IA */}
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-surface-container border border-outline-variant flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-sm" data-icon="memory">
          memory
        </span>
      </div>
      {/* Burbuja de Mensaje del Asistente */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-on-surface-variant mb-1 font-mono flex items-center gap-2">
          <span>Obsidian AI</span>
          {/* Muestra la latencia en milisegundos si está disponible */}
          {message.latencyMs !== undefined && (
            <span className="text-tertiary">{message.latencyMs}ms</span>
          )}
        </div>
        <div className="bg-surface-container rounded-lg p-4 border border-outline-variant text-on-surface text-sm leading-relaxed shadow-sm overflow-hidden">
          {renderFormattedContent(message.content)}
        </div>
      </div>
    </div>
  );
};
