# Especificación Técnica: Interfaz de Chat con API de Groq

## 1. Arquitectura Base
*   **Framework:** React / Next.js
*   **Modelo de IA:** Llama 3 (vía API de Groq)
*   **Gestión de Estado:** `useState` (UI y datos temporales), `useEffect` (ciclo de vida).
*   **Persistencia:** `localStorage` (sincronización de historial en el cliente).

## 2. Requisitos de Integración (API)
*   **Prohibido el uso de SDKs:** La comunicación con Groq debe realizarse estrictamente mediante la API `fetch` nativa.
*   **Autenticación:** Cabecera `Authorization: Bearer <NEXT_PUBLIC_GROQ_API_KEY>`.
*   **Payload:** Cada petición debe enviar el historial completo de la conversación (arquitectura stateless en el servidor).
*   **Asincronía:** Uso obligatorio de `async/await` con manejo de errores (captura de códigos HTTP no 2xx).

## 3. Requisitos de Interfaz (UI/UX)
*   **Chat:** Campo de texto, botón de envío y área de mensajes (diferenciando visualmente usuario vs. IA).
*   **Estado de Carga:** Indicador visual ("pensando...") durante la resolución de la promesa.
*   **Panel de Métricas (Dashboard):**
    *   Tokens de prompt (acumulado de la sesión).
    *   Tokens de completado (acumulado de la sesión).
    *   Tokens totales consumidos.
    *   Métrica extra: Nombre del modelo, tiempo de respuesta o tokens/segundo.
*   **Controles de Sesión:** Botón para borrar el historial en memoria y limpiar `localStorage`.