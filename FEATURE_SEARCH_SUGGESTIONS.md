# Mejoras en la Búsqueda de Películas

## Nueva Funcionalidad: "Quizás te refieres a..."

### Descripción
Cuando una búsqueda no arroja resultados exactos, el sistema ahora:
1. **Mantiene al usuario en la página de búsqueda** en lugar de redirigir al inicio
2. **Muestra sugerencias alternativas** con el mensaje "Quizás te refieres a:"
3. **Preserva la consulta original** para facilitar la corrección

### Comportamiento

#### Caso 1: Búsqueda sin resultados con sugerencias
Si el usuario busca una película que no existe, el sistema:
1. Intenta buscar películas usando palabras individuales de la consulta
2. Muestra hasta 5 sugerencias relevantes
3. Cada sugerencia incluye:
   - Miniatura de la película
   - Título y año de estreno
   - Opción de click para buscar esa película

#### Caso 2: Búsqueda sin resultados ni sugerencias relevantes
Si no se encuentran sugerencias relevantes:
1. Muestra películas populares como alternativas
2. El usuario puede corregir su búsqueda directamente

#### Caso 3: Error de red
Si hay un error al conectar con la API:
1. Muestra un mensaje de error claro
2. Preserva la consulta para reintentar
3. No redirige al usuario fuera de la búsqueda

### Interfaz de Usuario

#### Mensaje de "No se encontraron resultados"
```
╔══════════════════════════════════════════════════════╗
║  Buscar Película en TMDb                             ║
║                                                      ║
║  ⓘ No se encontraron resultados para "ejemplo"      ║
║  [input: ejemplo                               ]     ║
║                                                      ║
║  💡 Quizás te refieres a:                           ║
║  ┌────────────────────────────────────────┐         ║
║  │ [img] The Matrix (1999)                │         ║
║  │       Click para buscar esta película  │         ║
║  └────────────────────────────────────────┘         ║
║  ...                                                 ║
║                                                      ║
║  [Buscar] [Cancelar]                                ║
╚══════════════════════════════════════════════════════╝
```

#### Mensaje de Error
```
╔══════════════════════════════════════════════════════╗
║  Buscar Película en TMDb                             ║
║                                                      ║
║  ⚠ Error al buscar películas. Por favor, intenta   ║
║     de nuevo.                                        ║
║  [input: ejemplo                               ]     ║
║                                                      ║
║  [Buscar] [Cancelar]                                ║
╚══════════════════════════════════════════════════════╝
```

### Ventajas

1. **Mejor experiencia de usuario**: No se pierde el contexto de la búsqueda
2. **Corrección fácil**: La consulta se mantiene para editar rápidamente
3. **Descubrimiento de contenido**: Las sugerencias ayudan a encontrar películas similares
4. **Feedback claro**: Mensajes visuales claros sobre el estado de la búsqueda

### Implementación Técnica

Las nuevas funciones agregadas:

- `searchViewWithError(errorMessage, previousQuery)`: Vista con mensaje de error
- `searchViewWithSuggestions(query, suggestions)`: Vista con sugerencias
- `searchWithSuggestionsContr(query)`: Lógica para obtener sugerencias
- `suggestionClickContr(ev)`: Manejador de clicks en sugerencias

### Flujo de Búsqueda Actualizado

```
Usuario ingresa búsqueda
         ↓
    searchContr()
         ↓
   ¿Hay resultados?
    ↙        ↘
  SÍ          NO
   ↓           ↓
Mostrar    searchWithSuggestionsContr()
resultados      ↓
            Buscar sugerencias
                 ↓
            ¿Hay sugerencias?
             ↙        ↘
           SÍ          NO
            ↓           ↓
         Mostrar    Mostrar
       sugerencias  populares
            ↓           ↓
      searchViewWithSuggestions()
```
