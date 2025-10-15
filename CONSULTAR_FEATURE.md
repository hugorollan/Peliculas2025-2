# Nueva Funcionalidad: Botón "Consultar" en Búsqueda de Películas

## 📋 Descripción

Se ha implementado una nueva funcionalidad que permite al usuario **consultar los detalles de una película** desde los resultados de búsqueda de TMDb antes de decidir si añadirla a su colección.

## ✨ Cambios Implementados

### 1. **Botón "Consultar" en Resultados de Búsqueda**

Cada película en los resultados de búsqueda ahora muestra DOS botones:
- 🔍 **Consultar**: Para ver todos los detalles de la película
- ➕ **Añadir**: Para añadir directamente sin consultar (funcionalidad anterior)

```javascript
// En resultsView() - líneas 387-390
<div class="actions">
    <button class="preview-from-api" data-movie='${JSON.stringify(pelicula).replace(/'/g, "&apos;")}'><i class="fas fa-eye"></i> Consultar</button>
    <button class="add-from-api" data-movie='${JSON.stringify(pelicula).replace(/'/g, "&apos;")}'><i class="fas fa-plus"></i> Añadir</button>
</div>
```

### 2. **Nueva Función `previewFromAPIContr()`**

Esta función se encarga de:
1. Extraer los datos de la película desde el botón
2. Mostrar un indicador de carga
3. Hacer una petición a TMDb API para obtener información completa:
   - Detalles básicos (título, año, póster, resumen)
   - Director y reparto (hasta 8 actores)
   - Duración (runtime)
   - Presupuesto y recaudación
   - Tagline (lema)
   - Trailer de YouTube
   - Reseñas de usuarios (hasta 3)
   - Rating, géneros, idioma original, popularidad
4. Mostrar la vista completa usando `showView()` con toda la información
5. Añadir botones de acción al final:
   - **"Añadir a mi colección"**: Para añadir la película después de verla
   - **"Volver a búsqueda"**: Para regresar a los resultados
   - **"Ir al inicio"**: Para volver al índice principal

### 3. **Vista de Previsualización Mejorada**

Cuando el usuario hace clic en "Consultar", se muestra:
- Póster de la película
- Rating con círculo de progreso visual
- Título y tagline
- Director y año
- Resumen completo
- Duración
- Presupuesto y recaudación (con cálculo de beneficio)
- Idioma original y popularidad
- Trailer embebido de YouTube
- Reparto con fotos
- Reseñas de usuarios
- **Tres botones de acción en la parte inferior**

### 4. **Router Actualizado**

Se añadieron dos nuevos event listeners:

```javascript
// Líneas 914-915
else if (matchEvent(ev, '.preview-from-api'))   previewFromAPIContr  (ev);
else if (matchEvent(ev, '.add-from-api-preview')) addFromAPIContr   (ev);
```

## 🎯 Flujo de Usuario

### Flujo Anterior:
1. Usuario busca película → 2. Ve resultados → 3. Hace clic en "Añadir" → 4. Película añadida

### Flujo Nuevo (Recomendado):
1. Usuario busca película
2. Ve resultados con póster, título, año y rating
3. Hace clic en **"Consultar"** 👁️
4. Ve todos los detalles de la película (reparto, trailer, reseñas, etc.)
5. Si le gusta, hace clic en **"Añadir a mi colección"** ➕
6. Película añadida a su lista

### Flujo Alternativo (Rápido):
1. Usuario busca película
2. Ve resultados
3. Si ya conoce la película, hace clic directamente en **"Añadir"** ➕
4. Película añadida a su lista

## 🔧 Detalles Técnicos

### Funciones Modificadas:
- **`resultsView(resultados)`**: Añadido botón "Consultar" junto al botón "Añadir"

### Funciones Nuevas:
- **`previewFromAPIContr(ev)`**: Controlador para previsualizar películas desde API

### Event Handlers Nuevos:
- **`.preview-from-api`**: Trigger para previsualización
- **`.add-from-api-preview`**: Trigger para añadir desde la vista de previsualización

## 📊 Beneficios

1. **Mejor experiencia de usuario**: Los usuarios pueden ver toda la información antes de añadir
2. **Decisión informada**: Trailer, reseñas y reparto ayudan a decidir
3. **Flexibilidad**: Mantiene la opción de añadir rápidamente si el usuario ya conoce la película
4. **Información completa**: Muestra presupuesto, recaudación, duración y más datos de TMDb

## 🎨 Interfaz Visual

### Resultados de Búsqueda:
```
┌────────────────────────┐
│   [Póster]             │
│   Título               │
│   ⭐ 8.5  📅 2023     │
│                        │
│  [👁️ Consultar]       │
│  [➕ Añadir]           │
└────────────────────────┘
```

### Vista de Consulta:
```
┌─────────────────────────────────────┐
│  [Póster Grande]                    │
│  ⭕ 85% Rating                      │
│  Título de la Película              │
│  "Tagline inspirador..."            │
│  Director: Christopher Nolan        │
│  Año: 2023                          │
│  Resumen completo...                │
│  ⏱️ Duración: 2h 30min              │
│  💰 Presupuesto: $200M              │
│  💵 Recaudación: $1,000M            │
│  🎬 [Trailer de YouTube]            │
│  👥 Reparto: [Fotos + Nombres]      │
│  📝 Reseñas de usuarios...          │
│                                     │
│  [➕ Añadir a mi colección]         │
│  [🔍 Volver a búsqueda]             │
│  [⬅️ Ir al inicio]                  │
└─────────────────────────────────────┘
```

## ✅ Archivos Modificados

- **script.js**: 
  - Añadido botón "Consultar" en `resultsView()` (línea 388)
  - Creada función `previewFromAPIContr()` (líneas ~520-708)
  - Actualizado router con dos nuevos event handlers (líneas 914-915)

Total de líneas añadidas: ~190 líneas
Total de líneas modificadas: 5 líneas
