# 🎬 Películas 2025 - Full-Stack Movie Manager

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TMDb API](https://img.shields.io/badge/TMDb-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)

Una aplicación web full-stack moderna y segura para gestionar tu colección personal de películas, con autenticación de usuarios, base de datos MongoDB, y características avanzadas como calificaciones personales y listas múltiples.

## 🆕 **Nueva Versión Full-Stack**

Esta aplicación ha sido completamente transformada de una simple app de página única a una aplicación full-stack robusta con:

- 🔐 **Autenticación JWT** - Sistema seguro de registro e inicio de sesión
- 💾 **MongoDB** - Persistencia de datos en base de datos
- 👥 **Multi-usuario** - Cada usuario tiene su propia colección
- ⭐ **Calificaciones Personales** - Añade tus propias calificaciones 1-10
- 📝 **Notas Personales** - Escribe notas sobre cada película
- 📋 **Listas Múltiples** - Organiza películas en listas personalizadas
- 🛡️ **Seguridad** - Prevención XSS, hashing de contraseñas, rutas protegidas

## ✨ Características Principales

### Gestión de Usuarios
- 🔐 **Registro y Login**: Sistema completo de autenticación con JWT
- 🔒 **Contraseñas Seguras**: Hashing con bcrypt (10 rounds)
- 👤 **Perfiles de Usuario**: Cada usuario tiene su espacio privado
- 🚪 **Cierre de Sesión**: Gestión segura de sesiones

### Gestión de Películas
- 🔍 **Búsqueda TMDb**: Busca millones de películas desde The Movie Database
- ➕ **CRUD Completo**: Crea, lee, actualiza y elimina películas
- 📊 **Información Rica**: Géneros, cast, trailers, reviews, presupuesto, recaudación
- 🖼️ **Posters HD**: Imágenes de alta calidad con fallbacks

### Personalización Avanzada
- ⭐ **Tu Calificación**: Añade tus propias calificaciones (1-10) independientes de TMDb
- 📝 **Tus Notas**: Escribe notas personales sobre cada película
- 💖 **Indicadores Visuales**: Iconos especiales para datos personales (corazón para ratings, nota para notas)
- 🎨 **Diferenciación Clara**: Datos personales vs. datos de TMDb claramente distinguidos

### Listas Personalizadas
- 📋 **Múltiples Listas**: Crea todas las listas que quieras
- 🏷️ **Organización**: "Favoritas", "Por Ver", "Vistas", etc.
- 🔄 **Gestión Flexible**: Añade películas a múltiples listas
- 👁️ **Vista de Listas**: Navega y visualiza el contenido de cada lista

### Tecnología y Arquitectura
- 🏗️ **Arquitectura MVC**: Código modular y mantenible con ES6 modules
- 🛡️ **Seguridad**: Prevención XSS, validación de datos, JWT, bcrypt
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ⚡ **Rendimiento**: Manipulación eficiente del DOM con templates
- 🎨 **UI Moderna**: Interfaz inspirada en TMDb con animaciones fluidas

## 📋 Tabla de Contenidos

- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [API Documentation](#-api-documentation)
- [Seguridad](#-seguridad)
- [Tecnologías](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribuir](#-contribuir)

## 💻 Instalación

### Requisitos Previos

- **Node.js** (v14 o superior)
- **MongoDB** (local o MongoDB Atlas)
- **TMDb API Key** (gratuita en https://www.themoviedb.org/settings/api)
- Navegador web moderno

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/hugorollan/Quinto-Proyecto-Mejorando-nuestro-Netflix.git
   cd Quinto-Proyecto-Mejorando-nuestro-Netflix
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus valores:
   ```env
   TMDB_API_KEY=tu_clave_de_tmdb
   MONGODB_URI=mongodb://localhost:27017/peliculas2025
   JWT_SECRET=tu_clave_secreta_aleatoria
   JWT_EXPIRES_IN=7d
   PORT=3000
   ```

4. **Iniciar MongoDB** (si usas MongoDB local)
   ```bash
   mongod
   ```

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuración

### Obtener TMDb API Key

1. Regístrate en https://www.themoviedb.org/
2. Ve a Configuración → API
3. Solicita una API Key (gratis)
4. Copia el "Bearer Token" (no la API Key v3)
5. Pégalo en `.env` como `TMDB_API_KEY`

### Configurar MongoDB

**Opción 1: MongoDB Local**
```env
MONGODB_URI=mongodb://localhost:27017/peliculas2025
```

**Opción 2: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/peliculas2025
```

### Generar JWT Secret Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado a `JWT_SECRET` en `.env`

## 🎯 Uso

### Primera Vez

1. **Registrarse**
   - Haz clic en "Iniciar sesión" en la navegación
   - Selecciona "¿No tienes cuenta? Regístrate"
   - Completa el formulario (usuario, email, contraseña)
   
2. **Iniciar Sesión**
   - Usa tu email y contraseña
   - Recibirás un token JWT válido por 7 días

### Gestionar Películas

**Añadir desde TMDb:**
1. Clic en "Buscar película"
2. Escribe el título
3. Explora resultados
4. Clic en "Añadir" en la película deseada

**Añadir Manualmente:**
1. Clic en "Añadir película"
2. Completa el formulario (título, director, año, miniatura)
3. Clic en "Crear"

**Ver Detalles:**
- Clic en "ver" en cualquier película
- Se muestran todos los detalles (cast, trailer, reviews, etc.)

**Editar:**
- Clic en "editar"
- Modifica los campos deseados
- Clic en "Actualizar"

**Eliminar:**
- Clic en "borrar"
- Confirma la eliminación

### Datos Personales

**Añadir Tu Calificación y Notas:**
1. Clic en el botón "💖 personal" en cualquier película
2. Introduce tu calificación (0-10)
3. Escribe tus notas
4. Clic en "Guardar"

**Ver Datos Personales:**
- Películas con calificación personal muestran un corazón 💖
- Películas con notas muestran un ícono de nota 📝
- Tu calificación aparece en lugar de la de TMDb

### Gestionar Listas

**Crear Lista:**
1. Clic en "Mis Listas"
2. Escribe nombre y descripción (opcional)
3. Clic en "Crear Lista"

**Ver Lista:**
- Clic en "Ver" en cualquier lista
- Se muestran todas las películas de esa lista

**Añadir Película a Lista:**
- (Funcionalidad disponible al estar logueado con backend activo)

**Eliminar Lista:**
- Clic en "Eliminar" en cualquier lista
- Confirma la eliminación

## 🏗️ Arquitectura

### Patrón MVC con ES6 Modules

```
Frontend (Client)
├── js/main.js        # Punto de entrada, event routing
├── js/model.js       # Capa de datos, API calls
├── js/views.js       # Renderizado DOM, templates
└── js/controllers.js # Lógica de negocio

Backend (Server)
├── server.js         # Express server, routes
├── models/           # Mongoose schemas
│   ├── User.js       # Usuario (auth)
│   ├── Pelicula.js   # Película
│   └── Lista.js      # Lista
└── middleware/
    └── auth.js       # JWT validation
```

### Flujo de Datos

```
Usuario → Vista → Controlador → Modelo → API/DB
                                            ↓
Usuario ← Vista ← Controlador ← Modelo ← Respuesta
```

### Seguridad

1. **Frontend**: Todas las vistas usan `textContent` y templates (no innerHTML)
2. **Backend**: Validación de entrada, JWT, bcrypt, rutas protegidas
3. **Base de Datos**: Mongoose schemas, validación, índices
4. **Red**: CORS configurado, HTTPS recomendado en producción

## 📚 API Documentation

Para documentación completa de la API, ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Endpoints Principales

**Autenticación:**
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

**Películas (Protegido - Requiere JWT):**
- `GET /api/peliculas` - Obtener todas las películas del usuario
- `POST /api/peliculas` - Crear película
- `PUT /api/peliculas/:id` - Actualizar película
- `DELETE /api/peliculas/:id` - Eliminar película
- `PATCH /api/peliculas/:id/personal` - Actualizar datos personales

**Listas (Protegido - Requiere JWT):**
- `GET /api/listas` - Obtener todas las listas del usuario
- `POST /api/listas` - Crear lista
- `DELETE /api/listas/:id` - Eliminar lista
- `POST /api/listas/:id/peliculas` - Añadir película a lista
- `DELETE /api/listas/:id/peliculas/:movieId` - Quitar película de lista

**TMDb Proxy (Público):**
- `GET /api/search?query=...` - Buscar películas
- `GET /api/movie/:id` - Detalles de película

## 🛡️ Seguridad

Ver [SECURITY.md](./SECURITY.md) para análisis completo de seguridad.

### Medidas Implementadas

✅ **Autenticación y Autorización**
- JWT tokens con expiración configurable
- Bcrypt hashing de contraseñas (10 rounds)
- Rutas protegidas requieren token válido
- Aislamiento de datos por usuario

✅ **Prevención XSS**
- Manipulación segura del DOM (templates + textContent)
- No innerHTML con datos de usuario
- Atributos HTML escapados automáticamente

✅ **Validación de Entrada**
- Validación en schemas de Mongoose
- Validación de email, longitud de contraseña
- Sanitización de datos

✅ **Protección de Datos**
- Contraseñas hasheadas antes de almacenar
- JWT secrets configurables vía env
- .env excluido de git
- Dotfiles protegidos de acceso web

⚠️ **Pendiente para Producción**
- Rate limiting (límite de peticiones)
- HTTPS (usar reverse proxy)
- Security headers (helmet middleware)

## 🔧 Tecnologías Utilizadas

### Frontend
| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura y templates |
| **CSS3** | Estilos modernos, animaciones, responsive |
| **JavaScript ES6+** | Lógica, modules, async/await |
| **Fetch API** | Comunicación con backend |

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Node.js** | 14+ | Runtime JavaScript |
| **Express** | 5.x | Framework web |
| **MongoDB** | 4.x+ | Base de datos NoSQL |
| **Mongoose** | 8.x | ODM para MongoDB |
| **JWT** | 9.x | Autenticación basada en tokens |
| **Bcrypt** | 2.x | Hashing de contraseñas |
| **dotenv** | 17.x | Variables de entorno |
| **CORS** | 2.x | Control de acceso cross-origin |

### APIs Externas
- **TMDb API** - The Movie Database para datos de películas

## 📁 Estructura del Proyecto

```
Quinto-Proyecto-Mejorando-nuestro-Netflix/
│
├── index.html                # Página principal con templates
├── styles.css                # Estilos CSS
│
├── js/                       # Módulos ES6 del frontend
│   ├── main.js               # Punto de entrada, event routing
│   ├── model.js              # Capa de datos y API calls
│   ├── views.js              # Renderizado de vistas
│   └── controllers.js        # Lógica de negocio
│
├── server.js                 # Servidor Express + rutas API
│
├── models/                   # Modelos Mongoose
│   ├── User.js               # Esquema de usuario
│   ├── Pelicula.js           # Esquema de película
│   └── Lista.js              # Esquema de lista
│
├── middleware/               # Middleware de Express
│   └── auth.js               # Validación JWT
│
├── files/                    # Recursos estáticos
│   ├── placeholder.png       # Imagen por defecto
│   ├── superlopez.png        # Posters de ejemplo
│   ├── jurassicpark.png
│   └── interstellar.png
│
├── tests/                    # Tests (legacy)
│
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Archivos ignorados por git
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
├── API_DOCUMENTATION.md      # Documentación completa de API
├── SECURITY.md               # Análisis de seguridad
└── DEPLOYMENT.md             # Guía de despliegue
```

## 🧪 Testing

### Tests Automáticos

```bash
npm test
```

### Tests Manuales

1. **Registro y Login**
   - Registrar nuevo usuario
   - Intentar registro con email existente (debe fallar)
   - Login con credenciales correctas
   - Login con credenciales incorrectas (debe fallar)

2. **CRUD de Películas**
   - Crear película manualmente
   - Editar película
   - Eliminar película
   - Añadir desde TMDb

3. **Datos Personales**
   - Añadir calificación personal
   - Añadir notas
   - Verificar indicadores visuales

4. **Listas**
   - Crear lista nueva
   - Ver contenido de lista
   - Eliminar lista

### Tests de API con cURL

Ver ejemplos en [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#testing-with-curl)

## 🚀 Despliegue

### Desarrollo

```bash
npm start
```

### Producción

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa de despliegue.

**Checklist rápido:**
1. Configurar MongoDB Atlas
2. Configurar variables de entorno de producción
3. Añadir rate limiting
4. Configurar HTTPS
5. Añadir security headers (helmet)
6. Configurar CORS para dominio específico
7. Desplegar en Heroku/Render/Railway/DigitalOcean

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa ES6+ moderno
- Sigue el patrón MVC existente
- Usa safe DOM manipulation (no innerHTML con datos de usuario)
- Añade comentarios para código complejo
- Valida seguridad de nuevos endpoints
- Actualiza tests si es necesario

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

**Hugo Rollán**

- GitHub: [@hugorollan](https://github.com/hugorollan)
- Proyecto: [Quinto-Proyecto-Mejorando-nuestro-Netflix](https://github.com/hugorollan/Quinto-Proyecto-Mejorando-nuestro-Netflix)

## 🙏 Agradecimientos

- **The Movie Database (TMDb)** por su API completa y gratuita
- **MongoDB** por su excelente base de datos NoSQL
- **Express.js** por el framework web simple y potente
- La comunidad de desarrollo web por las mejores prácticas

## 📚 Documentación Adicional

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Referencia completa de la API
- [SECURITY.md](./SECURITY.md) - Análisis de seguridad y mejores prácticas
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue en producción
- [DOM_REFACTORING_GUIDE.md](./DOM_REFACTORING_GUIDE.md) - Guía de refactorización DOM

## 🆚 Versión Anterior vs Nueva

| Característica | Versión Anterior | Nueva Versión |
|----------------|------------------|---------------|
| Almacenamiento | localStorage | MongoDB |
| Usuarios | Single-user | Multi-usuario |
| Autenticación | No | JWT + bcrypt |
| Backend | Proxy simple | API REST completa |
| Arquitectura | Monolítico | MVC modular |
| Seguridad | Básica | XSS prevention, auth, validation |
| Personalización | No | Ratings + notas personales |
| Listas | Una sola | Múltiples listas |
| Escalabilidad | Limitada | Alta |

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por Hugo Rollán | © 2025

</div>
