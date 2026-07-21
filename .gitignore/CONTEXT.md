# Contexto del Proyecto: Prototipo de Chat Transparente

## El Problema
Un cliente B2B necesita explorar la viabilidad de integrar interfaces de IA en su operativa interna. Antes de escalar hacia un SaaS complejo o una infraestructura definitiva, requieren un prototipo funcional.

## El Objetivo de Negocio
Demostrar control total sobre la "caja negra" de la IA. El valor de este desarrollo no es solo que el modelo responda, sino ofrecer una visibilidad absoluta del consumo de recursos. 

Este prototipo servirá como el "cuerpo" (frontend) que se conecta temporalmente a un "cerebro" externo (Groq) para auditar:
*   Velocidad de respuesta.
*   Coste operativo (consumo de tokens por sesión).
*   Estabilidad de la sesión del usuario.

## Enfoque de Desarrollo
Es una prueba de concepto técnica. El diseño visual es secundario; la prioridad absoluta es la precisión de la extracción de métricas (objeto `usage`), la resiliencia ante errores de red y la gestión limpia del estado en el cliente sin depender de librerías de terceros que oculten la lógica subyacente.