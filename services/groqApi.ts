/**
 * @file services/groqApi.ts
 * @description Servicio de capa de infraestructura para realizar peticiones HTTP hacia la API de Groq.
 * Cumple estrictamente con las reglas de copilot-instructions.md:
 * 1. Uso exclusivo de `fetch` nativo del navegador (Cero SDKs de terceros como openai, groq-sdk o axios).
 * 2. Gestión de credenciales mediante la variable de entorno NEXT_PUBLIC_GROQ_API_KEY.
 * 3. Configuración de cabeceras obligatorias Authorization (Bearer token) y Content-Type.
 * 4. Arquitectura Stateless: envía el historial completo de la conversación en cada petición para preservar contexto.
 * 5. Extracción de métricas de rendimiento y consumo (objeto usage y latencia de red).
 */

import { ChatMessage, GroqApiResponse } from "@/types/chat";

// Endpoint oficial compatible con OpenAI de la API de Groq
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Modelo por defecto configurado para la inferencia rápida de Llama 3
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Envía la conversación completa a la API de Groq y retorna la respuesta procesada junto con el tiempo de latencia.
 * 
 * @param messages Array con el historial de mensajes de la sesión activa
 * @param model Nombre del modelo a invocar (por defecto llama-3.3-70b-versatile)
 * @param temperature Nivel de creatividad (0.0 a 1.0, por defecto 0.7)
 * @param maxTokens Límite máximo de tokens a generar en la completitud (por defecto 1024)
 * @returns Promesa con el objeto GroqApiResponse y la latencia calculada en ms
 * @throws Error explicativo en caso de falta de clave de API o respuestas HTTP no-2xx
 */
export async function sendGroqChatRequest(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL,
  temperature: number = 0.7,
  maxTokens: number = 1024
): Promise<{ data: GroqApiResponse; latencyMs: number }> {
  // 1. Obtención de la clave de API desde las variables de entorno de Next.js
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Clave de API no configurada. Por favor define NEXT_PUBLIC_GROQ_API_KEY en tu archivo .env.local"
    );
  }

  // 2. Construcción del payload Stateless: Mapeamos solo los campos necesarios (role y content)
  // para evitar enviar metadatos locales (como IDs o timestamps) al servidor de Groq.
  const payload = {
    model: model,
    messages: messages.map(({ role, content }) => ({ role, content })),
    temperature: temperature,
    max_tokens: maxTokens,
  };

  // Medición de latencia de red usando la API nativa de performance del navegador
  const startTime = performance.now();

  // 3. Ejecución de la petición HTTP usando exclusivamente fetch nativo
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const endTime = performance.now();
  const latencyMs = Math.round(endTime - startTime);

  // 4. Manejo de Errores HTTP: Capturamos cualquier estado diferente a 2xx
  if (!response.ok) {
    let errorMessage = `Error de API (HTTP ${response.status}): ${response.statusText}`;
    try {
      // Intentamos parsear el JSON de error devuelto por la API para extraer el mensaje detallado
      const errorJson = await response.json();
      if (errorJson?.error?.message) {
        errorMessage = `Error Groq (${response.status}): ${errorJson.error.message}`;
      }
    } catch {
      // Si la respuesta no es un JSON válido, conservamos el mensaje de error por defecto
    }
    throw new Error(errorMessage);
  }

  // 5. Parseo de la respuesta JSON exitosa
  const data: GroqApiResponse = await response.json();
  return { data, latencyMs };
}
