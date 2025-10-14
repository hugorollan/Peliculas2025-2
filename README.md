# 🎬 Películas 2025 - Gestor de Películas Favoritas

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![TMDb API](https://img.shields.io/badge/TMDb-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

Una aplicación web moderna y elegante para gestionar tu colección personal de películas favoritas, con integración completa de la API de The Movie Database (TMDb).

## ✨ Características Principales

- 🔍 **Búsqueda de Películas**: Busca películas directamente desde TMDb con resultados en tiempo real
- ➕ **Gestión Completa**: Añade, edita, visualiza y elimina películas de tu colección
- 💾 **Persistencia Local**: Almacenamiento automático en localStorage del navegador
- 🎨 **Diseño Moderno**: Interfaz inspirada en TMDb con animaciones y transiciones fluidas
- 📱 **Responsive**: Diseño adaptable a dispositivos móviles, tablets y escritorio
- ⭐ **Información Detallada**: Visualiza puntuaciones, géneros, reparto y sinopsis de películas
- 🎬 **Visualización de Trailers**: Trailers de YouTube embebidos directamente en la aplicación
- ⏱️ **Duración de Películas**: Muestra la duración en formato horas y minutos
- 📝 **Reseñas de Usuarios**: Lee opiniones de otros usuarios desde TMDb
- 💰 **Datos Financieros**: Presupuesto y recaudación de taquilla de cada película
- 🖼️ **Imágenes de Calidad**: Posters de alta resolución desde TMDb con fallback a placeholders
- ♿ **Accesible**: Código semántico y buenas prácticas de accesibilidad

## 🚀 Demo en Vivo

![Películas 2025 - Vista Principal](https://via.placeholder.com/800x450/032541/FFFFFF?text=Peliculas+2025)

*Interfaz principal mostrando la colección de películas*

## 📋 Tabla de Contenidos

- [Instalación](#-instalación)
- [Uso](#-uso)
- [Funcionalidades](#-funcionalidades-detalladas)
- [Tecnologías](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API de TMDb](#-integración-con-tmdb-api)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autor](#-autor)

## 💻 Instalación

### Requisitos Previos

- Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para búsqueda de películas en TMDb)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/hugorollan/Peliculas2025-2.git
   cd Peliculas2025-2
   ```

2. **Abrir la aplicación**
   - Abre el archivo `index.html` directamente en tu navegador
   - O usa un servidor local:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     ```
   - Accede a `http://localhost:8000`

3. **¡Listo para usar!**
   No se requiere instalación de dependencias ni configuración adicional.

## 🎯 Uso

### Vista Principal

Al abrir la aplicación, verás tu colección de películas con las siguientes opciones:

- **Ver**: Muestra información detallada de la película (director, año, puntuación, géneros, reparto)
- **Editar**: Modifica los datos de una película existente
- **Borrar**: Elimina una película de tu colección

### Añadir Películas Manualmente

1. Haz clic en el botón **"Añadir película"** en la barra de navegación
2. Rellena el formulario con:
   - Título de la película
   - Director
   - Año de estreno
   - URL de la miniatura (imagen del póster)
3. Haz clic en **"Crear"**

### Buscar Películas en TMDb

1. Haz clic en el botón **"Buscar película"** en la barra de navegación
2. Escribe el título de la película que deseas buscar
3. Presiona **Enter** o haz clic en **"Buscar"**
4. Explora los resultados y haz clic en **"Añadir"** en la película deseada
5. La película se añadirá automáticamente a tu colección con toda su información

### Resetear Lista

El botón **"Resetear lista"** restaura la colección a las 3 películas iniciales predeterminadas.

## 🛠️ Funcionalidades Detalladas

### Gestión de Películas (CRUD)

- **Create (Crear)**: Añade películas manualmente o desde TMDb
- **Read (Leer)**: Visualiza toda tu colección en formato de tarjetas
- **Update (Actualizar)**: Edita cualquier información de tus películas
- **Delete (Eliminar)**: Borra películas que ya no quieres en tu colección

### Búsqueda Inteligente

La integración con TMDb API permite:
- Búsqueda en tiempo real de millones de películas
- Resultados en español (idioma configurable)
- Detección automática de duplicados
- Información completa: título, año, puntuación, póster, géneros, sinopsis y reparto
- **Trailers embebidos de YouTube**
- **Duración de la película**
- **Reseñas de usuarios con calificaciones**
- **Presupuesto y recaudación de taquilla**
- **Tagline/eslogan de la película**

### Persistencia de Datos

- Los datos se guardan automáticamente en **localStorage**
- No se pierde información al cerrar el navegador
- Funciona completamente offline (excepto búsqueda de películas)

### Interfaz de Usuario

- **Diseño inspirado en TMDb**: Colores y estética profesional
- **Animaciones suaves**: Transiciones al pasar el ratón, fadeIn, slideUp
- **Modales elegantes**: Para formularios y detalles de películas
- **Tarjetas interactivas**: Con efectos hover y sombras dinámicas
- **Responsive Design**: Se adapta a cualquier tamaño de pantalla

## 🔧 Tecnologías Utilizadas

### Frontend

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura semántica de la aplicación |
| **CSS3** | Estilos modernos con variables CSS, flexbox, grid y animaciones |
| **JavaScript ES6+** | Lógica de aplicación con async/await, fetch API, arrow functions |

### APIs Externas

| API | Propósito |
|-----|-----------|
| **TMDb API** | Búsqueda de películas, información detallada, imágenes |
| **localStorage** | Persistencia de datos del lado del cliente |

### Patrón de Arquitectura

- **MVC (Model-View-Controller)**: Separación clara de responsabilidades
  - **Modelo**: Gestión de datos (`mis_peliculas`, API calls)
  - **Vista**: Funciones de renderizado (`indexView`, `showView`, `editView`, etc.)
  - **Controlador**: Lógica de negocio y eventos (`indexContr`, `searchContr`, etc.)

## 📁 Estructura del Proyecto

```
Peliculas2025-2/
│
├── index.html              # Página principal de la aplicación
├── script.js               # Lógica JavaScript (MVC)
├── styles.css              # Estilos adicionales (modo oscuro)
├── README.md               # Este archivo
├── IMPLEMENTATION.md       # Documentación técnica de implementación
├── SUMMARY.md              # Resumen de características
├── TEST_VERIFICATION.html  # Página de verificación de tests
│
├── files/                  # Recursos estáticos
│   ├── placeholder.png     # Imagen por defecto
│   ├── superlopez.png      # Poster de película
│   ├── jurassicpark.png    # Poster de película
│   └── interstellar.png    # Poster de película
│
└── tests/                  # Tests automatizados
    ├── checks.js           # Tests de funcionalidad
    └── testutils.js        # Utilidades de testing
```

## 🎬 Integración con TMDb API

### Configuración

La aplicación utiliza un Bearer Token para autenticación con TMDb:

```javascript
const TMDB_API_KEY = 'tu_token_aqui';
```

### Endpoints Utilizados

1. **Búsqueda de Películas**
   ```
   GET https://api.themoviedb.org/3/search/movie
   Parámetros: query, language=es-ES
   ```

2. **Detalles Extendidos de Película**
   ```
   GET https://api.themoviedb.org/3/movie/{id}
   Parámetros: language=es-ES, append_to_response=credits,videos,reviews
   ```
   
   Este endpoint proporciona:
   - `runtime`: Duración de la película
   - `budget`: Presupuesto
   - `revenue`: Recaudación
   - `tagline`: Eslogan/tagline
   - `credits`: Director y reparto
   - `videos`: Trailers y videos
   - `reviews`: Reseñas de usuarios

3. **Imágenes**
   ```
   https://image.tmdb.org/t/p/w500/{poster_path}
   https://image.tmdb.org/t/p/w185/{profile_path}
   ```

### Manejo de Errores

- ✅ Validación de búsquedas vacías
- ✅ Manejo de errores de red con mensajes amigables
- ✅ Detección automática de películas duplicadas
- ✅ Fallback a imágenes placeholder si no hay póster
- ✅ Logging en consola para debugging

## 🎨 Características de Diseño

### Paleta de Colores (Inspirada en TMDb)

```css
--tmdb-dark-blue: #032541    /* Azul oscuro principal */
--tmdb-light-blue: #01b4e4   /* Azul claro para botones */
--tmdb-light-green: #90cea1  /* Verde claro para acentos */
--tmdb-yellow: #ffc107       /* Amarillo para destacados */
--tmdb-bg: #f7fafd           /* Fondo claro */
```

### Animaciones

- **fadeIn**: Aparición gradual de elementos
- **slideUp**: Deslizamiento hacia arriba de modales
- **hover effects**: Elevación de tarjetas y cambios de color
- **loading states**: Feedback visual durante operaciones asíncronas

## 🧪 Testing

La aplicación incluye tests automatizados en el directorio `tests/`:

```bash
# Los tests verifican:
- Creación de películas
- Edición de películas
- Eliminación de películas
- Navegación entre vistas
- Persistencia en localStorage
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Guía de Estilo

- Usa JavaScript ES6+ moderno
- Sigue el patrón MVC existente
- Añade comentarios para código complejo
- Mantén la consistencia con el estilo actual
- Prueba tu código antes de hacer commit

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👨‍💻 Autor

**Hugo Rollán**

- GitHub: [@hugorollan](https://github.com/hugorollan)
- Proyecto: [Peliculas2025-2](https://github.com/hugorollan/Peliculas2025-2)

---

## 📚 Documentación Adicional

- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Documentación técnica detallada de la implementación
- [SUMMARY.md](SUMMARY.md) - Resumen ejecutivo del proyecto
- [NUEVAS_FUNCIONALIDADES.md](NUEVAS_FUNCIONALIDADES.md) - Detalles de las nuevas funcionalidades TMDb
- [TEST_VERIFICATION.html](TEST_VERIFICATION.html) - Página de verificación de funcionalidades

## 🙏 Agradecimientos

- **The Movie Database (TMDb)** por proporcionar una API gratuita y completa
- **Google Fonts** por la fuente Roboto
- La comunidad de desarrollo web por las mejores prácticas y patrones

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por Hugo Rollán | © 2025

</div>