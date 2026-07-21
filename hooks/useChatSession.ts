/**
 * @file hooks/useChatSession.ts
 * @description Hook personalizado de React que encapsula TODA la lógica de negocio y gestión de estado del cliente.
 * 
 * Responsabilidades:
 * 1. Mantiene los estados reactivos: `messages`, `metrics`, `sessions` (historial), `settings` (tema, modelo, temp, tokens), `isLoading` y `error`.
 * 2. Carga e hidrata el estado inicial desde `localStorage` al montar el componente (`useEffect`).
 * 3. Sincroniza la conversación, métricas acumuladas y configuración en `localStorage` en tiempo real.
 * 4. Aplica el tema de color visual (Modo Oscuro / Modo Claro) en el elemento raíz `<html>` del DOM.
 * 5. Gestiona la pila de Historial: permite archivar chats al dar a "New Chat", cargar chats pasados o eliminarlos.
 * 6. Orquesta la llamada asíncrona hacia `sendGroqChatRequest` con parámetros dinámicos de modelo, temperatura y tokens.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessage, SessionMetrics, ChatSession, AppSettings } from "@/types/chat";
import { sendGroqChatRequest } from "@/services/groqApi";

// Claves de Web Storage API (localStorage)
const LOCAL_STORAGE_SESSIONS_KEY = "obsidian_ai_chat_sessions";
const LOCAL_STORAGE_ACTIVE_ID_KEY = "obsidian_ai_chat_active_id";
const LOCAL_STORAGE_SETTINGS_KEY = "obsidian_ai_chat_settings";

// Métricas iniciales por defecto al iniciar una sesión nueva
const INITIAL_METRICS: SessionMetrics = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  tps: 0,
  model: "llama-3.3-70b-versatile",
  lastLatencyMs: 0,
};

// Configuración global por defecto de la aplicación
const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  maxTokens: 1024,
};

export function useChatSession() {
  // Pila de sesiones de historial archivadas en localStorage
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  // ID de la sesión que se está mostrando actualmente en pantalla
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  // Array de mensajes de la conversación activa
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Acumulado de métricas de tokens y velocidad (TPS) de la sesión activa
  const [metrics, setMetrics] = useState<SessionMetrics>(INITIAL_METRICS);
  // Estado para la configuración global (Tema, Modelo, Temperatura, Max Tokens)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  // Estado de carga para deshabilitar controles y mostrar el indicador "pensando..."
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para capturar y renderizar errores de red o de la API
  const [error, setError] = useState<string | null>(null);
  // Bandera para evitar problemas de hidratación entre SSR de Next.js y localStorage del cliente
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  /**
   * EFECTO INICIAL (Monte): Carga las sesiones y la configuración desde localStorage al iniciar.
   * Cumple con la regla de usar useEffect exclusivamente para hidratación de sesión.
   */
  useEffect(() => {
    try {
      // 1. Cargar historial de sesiones
      const savedSessionsRaw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      const savedActiveId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_ID_KEY);

      let parsedSessions: ChatSession[] = [];
      if (savedSessionsRaw) {
        parsedSessions = JSON.parse(savedSessionsRaw);
        if (Array.isArray(parsedSessions)) {
          setSessions(parsedSessions);
        }
      }

      let currentId = savedActiveId;
      if (!currentId) {
        currentId = `session-${Date.now()}`;
      }

      setActiveSessionId(currentId);

      const activeSession = parsedSessions.find((s) => s.id === currentId);
      if (activeSession) {
        setMessages(activeSession.messages || []);
        setMetrics(activeSession.metrics || INITIAL_METRICS);
      }

      // 2. Cargar configuración de usuario (Tema, Modelo, Temperatura, Max Tokens)
      const savedSettingsRaw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettingsRaw) {
        const parsedSettings: AppSettings = JSON.parse(savedSettingsRaw);
        setSettings(parsedSettings);

        // Aplicar clase de tema en el DOM root <html>
        if (parsedSettings.theme === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        }
      }
    } catch (e) {
      console.error("Error al cargar datos desde localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  /**
   * Función auxiliar para persistir la lista actualizada de sesiones en localStorage.
   */
  const saveSessionsToStorage = (updatedSessions: ChatSession[], activeId: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(updatedSessions));
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, activeId);
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  };

  /**
   * Sincroniza en tiempo real los mensajes y métricas de la sesión activa dentro del array global de historial.
   */
  const syncActiveSession = useCallback(
    (newMessages: ChatMessage[], newMetrics: SessionMetrics) => {
      if (!activeSessionId) return;

      const firstUserMsg = newMessages.find((m) => m.role === "user");
      const generatedTitle = firstUserMsg
        ? firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? "..." : "")
        : "Nueva Conversación";

      const now = new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setSessions((prevSessions) => {
        const index = prevSessions.findIndex((s) => s.id === activeSessionId);
        let updated: ChatSession[];

        if (index >= 0) {
          updated = [...prevSessions];
          updated[index] = {
            ...updated[index],
            title: prevSessions[index].title === "Nueva Conversación" ? generatedTitle : prevSessions[index].title,
            updatedAt: now,
            messages: newMessages,
            metrics: newMetrics,
          };
        } else {
          const newSession: ChatSession = {
            id: activeSessionId,
            title: generatedTitle,
            createdAt: now,
            updatedAt: now,
            messages: newMessages,
            metrics: newMetrics,
          };
          updated = [newSession, ...prevSessions];
        }

        saveSessionsToStorage(updated, activeSessionId);
        return updated;
      });
    },
    [activeSessionId]
  );

  /**
   * Actualiza la configuración global (Tema, Modelo, Temperatura, Max Tokens) y la persiste en localStorage.
   */
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
        
        // Aplicar el cambio de tema en la clase del elemento root <html>
        if (updated.theme === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        }
      } catch (e) {
        console.error("Error al guardar configuración:", e);
      }
      return updated;
    });
  }, []);

  /**
   * Alterna dinámicamente entre el modo oscuro ('dark') y el modo claro ('light').
   */
  const toggleTheme = useCallback(() => {
    updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  }, [settings.theme, updateSettings]);

  /**
   * Envía un nuevo mensaje del usuario a la API de Groq usando los parámetros de modelo, temperatura y tokens activos.
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      syncActiveSession(updatedMessages, metrics);

      try {
        // Petición asíncrona hacia Groq pasando modelo, temperatura y max_tokens dinámicos
        const { data, latencyMs } = await sendGroqChatRequest(
          updatedMessages,
          settings.model,
          settings.temperature,
          settings.maxTokens
        );

        const assistantContent =
          data.choices[0]?.message?.content || "No se obtuvo respuesta del modelo.";

        const assistantMessage: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          latencyMs,
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        let finalMetrics = metrics;
        if (data.usage) {
          const usage = data.usage;
          const completionTimeSec = usage.completion_time || latencyMs / 1000;
          const currentTps =
            completionTimeSec > 0
              ? Math.round((usage.completion_tokens / completionTimeSec) * 10) / 10
              : 0;

          finalMetrics = {
            promptTokens: metrics.promptTokens + (usage.prompt_tokens || 0),
            completionTokens: metrics.completionTokens + (usage.completion_tokens || 0),
            totalTokens: metrics.totalTokens + (usage.total_tokens || 0),
            tps: currentTps || metrics.tps,
            model: data.model || settings.model,
            lastLatencyMs: latencyMs,
          };

          setMetrics(finalMetrics);
        }

        syncActiveSession(finalMessages, finalMetrics);
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error
            ? err.message
            : "Ocurrió un error desconocido al contactar a la IA.";
        setError(errMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, metrics, settings, syncActiveSession]
  );

  /**
   * Inicia un nuevo chat. Preserva la conversación previa en el historial y limpia la vista activa.
   */
  const startNewChat = useCallback(() => {
    const newSessionId = `session-${Date.now()}`;
    setActiveSessionId(newSessionId);
    setMessages([]);
    setMetrics({ ...INITIAL_METRICS, model: settings.model });
    setError(null);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, newSessionId);
  }, [settings.model]);

  /**
   * Carga una conversación histórica seleccionada desde la barra lateral.
   */
  const loadSession = useCallback(
    (sessionId: string) => {
      const target = sessions.find((s) => s.id === sessionId);
      if (target) {
        setActiveSessionId(sessionId);
        setMessages(target.messages || []);
        setMetrics(target.metrics || { ...INITIAL_METRICS, model: settings.model });
        setError(null);
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, sessionId);
      }
    },
    [sessions, settings.model]
  );

  /**
   * Elimina una conversación específica del historial guardado.
   */
  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        let nextActiveId = activeSessionId;

        if (sessionId === activeSessionId) {
          if (updated.length > 0) {
            nextActiveId = updated[0].id;
            setMessages(updated[0].messages);
            setMetrics(updated[0].metrics);
          } else {
            nextActiveId = `session-${Date.now()}`;
            setMessages([]);
            setMetrics({ ...INITIAL_METRICS, model: settings.model });
          }
          setActiveSessionId(nextActiveId);
        }

        saveSessionsToStorage(updated, nextActiveId);
        return updated;
      });
    },
    [activeSessionId, settings.model]
  );

  /**
   * Borra todo el historial acumulado y resetea la sesión.
   */
  const clearAllHistory = useCallback(() => {
    const newId = `session-${Date.now()}`;
    setSessions([]);
    setActiveSessionId(newId);
    setMessages([]);
    setMetrics({ ...INITIAL_METRICS, model: settings.model });
    setError(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSIONS_KEY);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_ID_KEY, newId);
    } catch (e) {
      console.error("Error al borrar localStorage:", e);
    }
  }, [settings.model]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sessions,
    activeSessionId,
    messages,
    metrics,
    settings,
    isLoading,
    error,
    isHydrated,
    sendMessage,
    startNewChat,
    loadSession,
    deleteSession,
    clearAllHistory,
    updateSettings,
    toggleTheme,
    clearError,
  };
}
