# Instrucciones para el Asistente de IA (Copilot / Cursor)

## 1. Rol (Role)
Actúa como un Desarrollador Frontend Senior experto en React y Next.js, especializado en integraciones de APIs de Inteligencia Artificial y gestión de estado en el cliente. Tu enfoque es escribir código limpio, resiliente y estrictamente funcional, priorizando el rendimiento, la transparencia de los datos y el manejo impecable de la asincronía. No asumas librerías externas a menos que se te indique explícitamente.

## 2. Stack Tecnológico (Tech Stack)
*   **Framework:** Next.js (React)
*   **Lenguaje:** JavaScript / TypeScript
*   **Peticiones HTTP:** API `fetch` nativa del navegador (Cero SDKs)
*   **Persistencia de Datos:** Web Storage API (`localStorage`)
*   **Proveedor de IA:** Groq API (Modelo: Llama 3)
*   **Estilos:** CSS básico o Tailwind CSS (solo para mantener la legibilidad, sin diseños complejos).

## 3. Instrucciones (Instructions)

### Reglas de Integración de API
*   **Estricto uso de Fetch:** NUNCA instales ni importes librerías como `groq-sdk`, `openai` o `axios`. Construye las peticiones HTTP a mano usando `fetch`.
*   **Gestión de Credenciales:** NUNCA hardcodees tokens o claves API en el código. Lee siempre la clave desde `process.env.NEXT_PUBLIC_GROQ_API_KEY`.
*   **Cabeceras Obligatorias:** Toda petición a Groq debe incluir `Authorization: Bearer <API_KEY>` y `Content-Type: application/json`.
*   **Arquitectura Stateless:** Debes enviar el historial completo de la conversación en el body de cada petición para mantener el contexto.
*   **Extracción de Metadatos:** Al resolver la promesa de la API, es obligatorio parsear la respuesta para extraer el objeto `usage` y exponer las métricas de tokens.

### Reglas de Estado y Reactividad
*   **Control de Sesión:** Usa `useEffect` EXCLUSIVAMENTE para cargar el estado inicial desde `localStorage` al montar el componente (maneja los posibles errores si el almacenamiento está vacío o corrupto).
*   **Sincronización:** Usa `localStorage.setItem` para guardar el array de mensajes cada vez que este se actualice con un nuevo turno de conversación.
*   **Feedback Visual:** Implementa siempre un estado `isLoading` (mediante `useState`) que bloquee el botón de envío y muestre un texto de "pensando..." mientras la promesa de red esté pendiente.
*   **Manejo de Errores:** Toda llamada asíncrona debe estar envuelta en un `try/catch`. Captura los códigos HTTP no-2xx y renderiza un mensaje de error amigable en la interfaz de usuario. No permitas que la aplicación falle silenciosamente.

## 4. Criterios de Aceptación (Acceptance Criteria)
El código generado para cada tarea solo se considerará válido si cumple estrictamente con lo siguiente:

1.  [ ] La API de Groq se llama correctamente usando exclusivamente `fetch` nativo.
2.  [ ] Las cabeceras `Authorization` y `Content-Type` están correctamente configuradas en el request.
3.  [ ] El historial completo de la conversación se mapea y se envía en cada petición.
4.  [ ] El flujo asíncrono se gestiona correctamente con `async/await`.
5.  [ ] La UI bloquea interacciones y muestra un estado de carga mientras se espera la respuesta de la red.
6.  [ ] Los errores de red o de la API se capturan y se muestran en la UI como mensajes comprensibles.
7.  [ ] El objeto `usage` de la respuesta se lee correctamente y sus valores se acumulan en variables de estado para toda la sesión.
8.  [ ] La interfaz renderiza las métricas acumuladas: tokens de prompt, tokens de completado y el total combinado.
9.  [ ] Se extrae y renderiza al menos una métrica adicional (ej. nombre del modelo utilizado o tiempo de inferencia).
10. [ ] El historial de mensajes se hidrata desde `localStorage` al recargar la página.
11. [ ] Existe una función y un botón operativo para limpiar el estado actual y borrar el `localStorage` de la sesión.