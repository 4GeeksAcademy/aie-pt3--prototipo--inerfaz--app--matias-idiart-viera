/**
 * @file types/chat.ts
 * @description Definición de tipos de datos e interfaces de TypeScript para la aplicación Obsidian AI.
 * Garantiza un tipado estricto para los mensajes, respuestas de la API de Groq, métricas de consumo y sesiones de historial.
 */

/**
 * Rol del participante en la conversación según el estándar de OpenAI / Groq API.
 * - 'user': Mensajes enviados por el usuario final.
 * - 'assistant': Respuestas generadas por el modelo de Inteligencia Artificial.
 * - 'system': Instrucciones de sistema o configuración inicial del prompt.
 */
export type Role = "user" | "assistant" | "system";

/**
 * Representa un único mensaje dentro de la interfaz de chat.
 */
export interface ChatMessage {
  /** Identificador único del mensaje (ej: 'msg-user-1718900000000') */
  id: string;
  /** Rol del emisor del mensaje */
  role: Role;
  /** Texto legible del contenido del mensaje */
  content: string;
  /** Hora formateada en que se envió/recibió el mensaje (ej: '21:30') */
  timestamp?: string;
  /** Latencia en milisegundos que tomó la API en responder este mensaje específico */
  latencyMs?: number;
}

/**
 * Estructura de métricas de consumo de tokens devuelta en la propiedad `usage` de la API de Groq.
 */
export interface GroqUsage {
  /** Tokens consumidos por el prompt/mensaje del usuario */
  prompt_tokens: number;
  /** Tokens generados por la IA en la respuesta */
  completion_tokens: number;
  /** Suma total de tokens consumidos en la petición (prompt + completion) */
  total_tokens: number;
  /** Tiempo en segundos invertido en procesar el prompt (opcional) */
  prompt_time?: number;
  /** Tiempo en segundos invertido en generar la completitud (opcional) */
  completion_time?: number;
  /** Tiempo total en segundos consumido en el servidor de la API (opcional) */
  total_time?: number;
}

/**
 * Opción de respuesta generada por el modelo dentro del array `choices`.
 */
export interface GroqChoice {
  /** Índice de la opción dentro de la lista de respuestas */
  index: number;
  /** Objeto del mensaje resultante generado por el modelo */
  message: {
    role: Role;
    content: string;
  };
  /** Razón por la cual finalizó la generación ('stop', 'length', etc.) */
  finish_reason: string;
}

/**
 * Estructura completa de la respuesta JSON entregada por el endpoint de chat de Groq.
 */
export interface GroqApiResponse {
  /** Identificador de la respuesta entregado por Groq */
  id: string;
  /** Tipo de objeto devuelto ('chat.completion') */
  object: string;
  /** Timestamp de creación en Unix Epoch */
  created: number;
  /** Nombre exacto del modelo utilizado para procesar la petición (ej: 'llama-3.3-70b-versatile') */
  model: string;
  /** Array con las opciones de respuestas generadas por el modelo */
  choices: GroqChoice[];
  /** Métricas de consumo de tokens de la llamada */
  usage?: GroqUsage;
}

/**
 * Métricas de consumo acumuladas durante la sesión activa para el dashboard de auditoría.
 */
export interface SessionMetrics {
  /** Total acumulado de tokens de prompt consumidos en la sesión */
  promptTokens: number;
  /** Total acumulado de tokens de respuesta (completion) generados en la sesión */
  completionTokens: number;
  /** Total acumulado combinado de tokens de la sesión */
  totalTokens: number;
  /** Velocidad de inferencia medida en Tokens Por Segundo (TPS) */
  tps: number;
  /** Nombre del modelo activo en uso */
  model: string;
  /** Latencia en milisegundos de la última llamada realizada */
  lastLatencyMs: number;
}

/**
 * Representa una sesión de chat archivada en la pila de historial (`localStorage`).
 */
export interface ChatSession {
  /** Identificador único de la sesión (ej: 'session-1718900000000') */
  id: string;
  /** Título de la conversación derivado automáticamente del primer mensaje */
  title: string;
  /** Fecha y hora en que se creó la sesión */
  createdAt: string;
  /** Fecha y hora de la última actualización de la conversación */
  updatedAt: string;
  /** Lista completa de mensajes pertenecientes a esta conversación */
  messages: ChatMessage[];
  /** Estado acumulado de las métricas de consumo de esta sesión */
  metrics: SessionMetrics;
}

/**
 * Configuración global de la aplicación (preferencias de usuario y parámetros de IA).
 */
export interface AppSettings {
  /** Tema de color visual de la interfaz ('dark' para modo oscuro, 'light' para modo claro) */
  theme: "dark" | "light";
  /** Nombre del modelo de IA de Groq seleccionado */
  model: string;
  /** Parámetro de creatividad del modelo (entre 0.0 y 1.0) */
  temperature: number;
  /** Límite máximo de tokens de respuesta a generar en cada completitud */
  maxTokens: number;
}

