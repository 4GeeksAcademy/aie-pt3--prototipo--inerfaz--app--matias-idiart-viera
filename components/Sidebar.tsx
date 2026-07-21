/**
 * @file components/Sidebar.tsx
 * @description Componente de panel lateral que gestiona las tres funciones principales del proyecto:
 * 1. Pestaña "History": Muestra el listado de conversaciones anteriores archivadas en localStorage. Permite cambiar de chat o eliminar entradas individuales.
 * 2. Pestaña "Usage": Renderiza la auditoría de consumo de tokens en tiempo real (Prompt, Completion, Total) con porcentajes respecto a límites máximos y la velocidad de inferencia (TPS).
 * 3. Pestaña "Models": Aloja la configuración del modelo de IA (selección de modelo Groq, temperatura de creatividad y límite de tokens por respuesta max_tokens).
 */

"use client";

import React, { useState } from "react";
import { SessionMetrics, ChatSession, AppSettings } from "@/types/chat";

interface SidebarProps {
  /** Métricas de consumo acumuladas de la sesión activa */
  metrics: SessionMetrics;
  /** Pila de sesiones archivadas en la memoria local del navegador */
  sessions: ChatSession[];
  /** ID de la sesión que se encuentra activa en pantalla */
  activeSessionId: string;
  /** Configuración global de la aplicación (modelo, temperatura, maxTokens) */
  settings: AppSettings;
  /** Callback para cargar una sesión seleccionada del historial */
  onSelectSession: (sessionId: string) => void;
  /** Callback para eliminar una sesión específica del historial */
  onDeleteSession: (sessionId: string) => void;
  /** Callback para vaciar por completo la pila de historial en localStorage */
  onClearAllHistory: () => void;
  /** Callback para actualizar una o más propiedades de la configuración */
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  metrics,
  sessions,
  activeSessionId,
  settings,
  onSelectSession,
  onDeleteSession,
  onClearAllHistory,
  onUpdateSettings,
}) => {
  // Estado local para controlar la pestaña activa ('history', 'usage' o 'models')
  const [activeTab, setActiveTab] = useState<"history" | "usage" | "models">("history");

  // Definición de límites máximos permitidos por el modelo (Llama-3-70b)
  const MAX_PROMPT_TOKENS = 8192;
  const MAX_COMPLETION_TOKENS = 1024;
  const MAX_TOTAL_TOKENS = 8192;

  // Cálculos porcentuales relativos para las barras de progreso
  const promptPercentNum = Math.min(100, (metrics.promptTokens / MAX_PROMPT_TOKENS) * 100);
  const completionPercentNum = Math.min(100, (metrics.completionTokens / MAX_COMPLETION_TOKENS) * 100);
  const totalPercentNum = Math.min(100, (metrics.totalTokens / MAX_TOTAL_TOKENS) * 100);

  const promptPercentStr = promptPercentNum.toFixed(1);
  const completionPercentStr = completionPercentNum.toFixed(1);
  const totalPercentStr = totalPercentNum.toFixed(1);

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant pt-6 pb-4 px-3 flex-shrink-0 z-40">
      {/* Encabezado del Panel Lateral */}
      <div className="mb-6 px-2">
        <h2 className="text-lg font-headline font-bold text-on-surface tracking-tight mb-1">
          {activeTab === "history"
            ? "Historial de Chats"
            : activeTab === "models"
            ? "Configuración de Modelo"
            : "Auditoría de Consumo"}
        </h2>
        <p className="text-xs text-on-surface-variant font-mono">
          {activeTab === "history"
            ? `${sessions.length} conversaciones guardadas`
            : activeTab === "models"
            ? "Parámetros de Inferencia IA"
            : "Real-time Performance"}
        </p>
      </div>

      {/* Pestañas de Navegación del Sidebar */}
      <nav className="space-y-1 mb-6">
        {/* Pestaña: Historial */}
        <button
          onClick={() => setActiveTab("history")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium ${
            activeTab === "history"
              ? "bg-secondary-container text-primary border-r-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-sm" data-icon="history">
              history
            </span>
            <span>History</span>
          </div>
          {sessions.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary font-mono font-bold">
              {sessions.length}
            </span>
          )}
        </button>

        {/* Pestaña: Models (Configuración de IA) */}
        <button
          onClick={() => setActiveTab("models")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium ${
            activeTab === "models"
              ? "bg-secondary-container text-primary border-r-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm" data-icon="smart_toy">
            smart_toy
          </span>
          Models
        </button>

        {/* Pestaña: Auditoría de Consumo / Métricas */}
        <button
          onClick={() => setActiveTab("usage")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium ${
            activeTab === "usage"
              ? "bg-secondary-container text-primary border-r-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-sm" data-icon="monitoring">
            monitoring
          </span>
          Usage
        </button>

        {/* Pestaña inactiva de demostración de maqueta */}
        <a
          className="flex items-center gap-3 px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-150 text-sm font-medium opacity-60 pointer-events-none"
          href="#"
        >
          <span className="material-symbols-outlined text-sm" data-icon="vpn_key">
            vpn_key
          </span>
          API Keys
        </a>
      </nav>

      {/* Área Principal de Contenido según la pestaña activa */}
      <div className="flex-1 overflow-y-auto mb-6 px-1 space-y-2 scrollbar-thin">
        {activeTab === "history" ? (
          /* VISTA PESTAÑA: HISTORIAL */
          sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-2">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2" data-icon="chat_bubble_outline">
                chat_bubble_outline
              </span>
              <p className="text-xs text-on-surface-variant font-medium">No hay chats guardados aún</p>
              <p className="text-[11px] text-on-surface-variant/60 mt-1">Inicia una conversación y presiona "New Chat" para archivarla.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const msgCount = session.messages ? session.messages.length : 0;

                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group relative flex flex-col p-2.5 rounded-lg cursor-pointer border transition-all duration-150 ${
                      isActive
                        ? "bg-surface-container-highest border-primary/50 text-on-surface"
                        : "bg-surface-container-lowest border-outline-variant/60 hover:bg-surface-container-high hover:border-outline text-on-surface-variant"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pr-6">
                      <span className="text-xs font-medium truncate leading-snug">
                        {session.title || "Nueva Conversación"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-on-surface-variant/70">
                      <span>{session.updatedAt || session.createdAt}</span>
                      <span className="bg-surface-container-highest px-1.5 py-0.5 rounded text-primary/80">
                        {msgCount} {msgCount === 1 ? "mensaje" : "mensajes"}
                      </span>
                    </div>

                    {/* Botón Borrar Sesión Individual */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="Eliminar del historial"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded"
                    >
                      <span className="material-symbols-outlined text-[16px]" data-icon="delete">
                        delete
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === "models" ? (
          /* VISTA PESTAÑA: MODELS (CONFIGURACIÓN DE PARÁMETROS DE IA) */
          <div className="space-y-5 px-1">
            {/* Control 1: Selector de Modelo Groq */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                Modelo de IA
              </label>
              <select
                value={settings.model}
                onChange={(e) => onUpdateSettings({ model: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg p-2 text-xs focus:border-primary focus:ring-0 font-mono"
              >
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Versatile)</option>
                <option value="llama-3.1-8b-instant">Llama 3.1 8B (Instant)</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B (32k Context)</option>
              </select>
            </div>

            {/* Control 2: Temperatura (Creatividad) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                  Creatividad (Temp)
                </label>
                <span className="text-xs font-mono font-bold text-primary">
                  {settings.temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/70">
                <span>0.0 Preciso</span>
                <span>1.0 Creativo</span>
              </div>
            </div>

            {/* Control 3: Tamaño Máximo de Respuesta (max_tokens) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                  Max Tokens
                </label>
                <span className="text-xs font-mono font-bold text-tertiary">
                  {settings.maxTokens}
                </span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={settings.maxTokens}
                onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value, 10) })}
                className="w-full accent-tertiary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/70">
                <span>256 Corto</span>
                <span>4096 Largo</span>
              </div>
            </div>

            {/* Tarjeta Informativa del Modelo Activo */}
            <div className="p-3 bg-surface-container-highest border border-outline-variant/60 rounded-lg space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <span className="material-symbols-outlined text-sm" data-icon="info">
                  info
                </span>
                <span>Detalles del Modelo</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {settings.model === "llama-3.3-70b-versatile"
                  ? "Modelo de 70 mil millones de parámetros optimizado para razonamiento complejo y programación."
                  : settings.model === "llama-3.1-8b-instant"
                  ? "Modelo ultra rápido de baja latencia idóneo para respuestas inmediatas."
                  : "Arquitectura Mixture-of-Experts con ventana extensa de contexto de 32k tokens."}
              </p>
            </div>
          </div>
        ) : (
          /* VISTA PESTAÑA: USAGE / AUDITORÍA DE CONSUMO */
          <div className="space-y-4">
            {/* Tarjeta 1: Prompt Tokens */}
            <div className="bg-surface-container-highest p-3 rounded-lg border border-outline-variant">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-on-surface-variant font-medium">Prompt Tokens</span>
                <div className="text-right font-mono">
                  <span className="text-sm text-inverse-surface font-bold">
                    {metrics.promptTokens.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60">
                    {" "}/ {MAX_PROMPT_TOKENS.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                <span className="text-on-surface-variant/70">Uso:</span>
                <span className="text-primary font-bold">{promptPercentStr}%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${promptPercentNum}%` }}
                ></div>
              </div>
            </div>

            {/* Tarjeta 2: Completion Tokens */}
            <div className="bg-surface-container-highest p-3 rounded-lg border border-outline-variant">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-on-surface-variant font-medium">Completion Tokens</span>
                <div className="text-right font-mono">
                  <span className="text-sm text-inverse-surface font-bold">
                    {metrics.completionTokens.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60">
                    {" "}/ {MAX_COMPLETION_TOKENS.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                <span className="text-on-surface-variant/70">Uso:</span>
                <span className="text-tertiary font-bold">{completionPercentStr}%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-tertiary h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentNum}%` }}
                ></div>
              </div>
            </div>

            {/* Tarjeta 3: Total Tokens */}
            <div className="bg-surface-container-highest p-3 rounded-lg border border-outline-variant">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-on-surface-variant font-medium">Total Tokens</span>
                <div className="text-right font-mono">
                  <span className="text-sm text-inverse-surface font-bold">
                    {metrics.totalTokens.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60">
                    {" "}/ {MAX_TOTAL_TOKENS.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                <span className="text-on-surface-variant/70">Uso:</span>
                <span className="text-primary-fixed-dim font-bold">{totalPercentStr}%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary-fixed-dim h-full rounded-full transition-all duration-300"
                  style={{ width: `${totalPercentNum}%` }}
                ></div>
              </div>
            </div>

            {/* Tarjeta 4: Velocidad de Inferencia (TPS - Tokens Per Second) */}
            <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container-lowest">
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-tertiary" data-icon="bolt">
                  bolt
                </span>
                TPS
              </span>
              <span className="text-lg font-mono text-tertiary font-bold">
                {metrics.tps > 0 ? metrics.tps.toFixed(1) : "--"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pie de Sidebar y Acción de Limpieza Total */}
      <div className="border-t border-outline-variant pt-3 mb-3 space-y-1">
        <a
          className="flex items-center gap-3 px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-150 text-xs font-medium"
          href="#"
        >
          <span className="material-symbols-outlined text-sm" data-icon="description">
            description
          </span>
          Docs
        </a>
        <a
          className="flex items-center gap-3 px-3 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-all duration-150 text-xs font-medium"
          href="#"
        >
          <span className="material-symbols-outlined text-sm text-tertiary" data-icon="check_circle">
            check_circle
          </span>
          Status
        </a>
      </div>

      {/* Botón de Borrado Completo del Historial */}
      <button
        onClick={onClearAllHistory}
        className="w-full py-2 px-3 border border-outline-variant hover:border-error hover:text-error text-on-surface-variant rounded font-medium text-xs transition-colors flex justify-center items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm" data-icon="delete">
          delete
        </span>
        Borrar Historial Completo
      </button>
    </aside>
  );
};
