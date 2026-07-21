/**
 * @file app/page.tsx
 * @description Página principal y orquestador de la aplicación Obsidian AI (Next.js App Router).
 * 
 * Arquitectura de Integración:
 * 1. Consume el hook `useChatSession()` para obtener todo el estado reactivo (`messages`, `metrics`, `sessions`, `settings`, `isLoading`, `error`).
 * 2. Distribuye los estados y callbacks hacia los componentes de presentación puros (`Header`, `Sidebar`, `ChatContainer`, `ChatInput`, `ErrorBanner`, `SettingsModal`).
 * 3. Mantiene una clara separación entre la lógica de negocio y la capa de vista.
 */

"use client";

import React, { useState } from "react";
import { useChatSession } from "@/hooks/useChatSession";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ErrorBanner } from "@/components/ErrorBanner";
import { SettingsModal } from "@/components/SettingsModal";

export default function Home() {
  // Estado local para visibilidad del Modal de Configuración
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Extracción del estado de negocio y funciones de acción desde el hook personalizado
  const {
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
    clearError,
  } = useChatSession();

  // Pantalla de carga mientras se hidrata el estado desde localStorage del cliente
  if (!isHydrated) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center text-on-surface-variant font-mono text-sm">
        Cargando Obsidian AI...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-on-surface">
      {/* 1. Encabezado superior con badge del modelo, botón Settings y botón New Chat */}
      <Header
        modelName={settings.model}
        onNewChat={startNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 pt-14 h-full overflow-hidden">
        {/* 2. Panel lateral con pestañas de Historial de Chats, Auditoría de Consumo y Configuración de Modelos */}
        <Sidebar
          metrics={metrics}
          sessions={sessions}
          activeSessionId={activeSessionId}
          settings={settings}
          onSelectSession={loadSession}
          onDeleteSession={deleteSession}
          onClearAllHistory={clearAllHistory}
          onUpdateSettings={updateSettings}
        />

        {/* 3. Área principal de interacción de Chat */}
        <main className="flex-1 flex flex-col bg-background relative h-full">
          {/* Banner emergente para notificar errores de red o HTTP */}
          {error && <ErrorBanner message={error} onDismiss={clearError} />}

          {/* Área de mensajes con scroll automático e indicador "pensando..." */}
          <ChatContainer messages={messages} isLoading={isLoading} />

          {/* Campo de entrada de texto con envío por Enter */}
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </main>
      </div>

      {/* 4. Modal de Configuración (Settings): Selector de Tema Claro/Oscuro, Modelo, Temp y Tokens */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
}
