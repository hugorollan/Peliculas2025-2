# API Documentation - Películas 2025

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Validation:**
- Username: 3-30 characters
- Email: Valid email format
- Password: Minimum 6 characters

---

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Token Expiration:** 7 days (configurable via `JWT_EXPIRES_IN` env variable)

---

## Movies Endpoints (Protected)

All movie endpoints require authentication.

### Get All Movies
**GET** `/api/peliculas`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "año": "2010",
    "miniatura": "https://image.tmdb.org/t/p/w500/abc123.jpg",
    "rating": 8.8,
    "generos": ["Acción", "Ciencia ficción", "Suspense"],
    "personalRating": 9.5,
    "personalNotes": "Amazing movie, watched it 3 times!",
    "lists": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Favorites"
      }
    ],
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T15:45:00.000Z"
  }
]
```

---

### Get Single Movie
**GET** `/api/peliculas/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):** Same as movie object above

**Response (404):**
```json
{
  "error": "Movie not found"
}
```

---

### Create Movie
**POST** `/api/peliculas`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "titulo": "Interstellar",
  "director": "Christopher Nolan",
  "año": "2014",
  "miniatura": "https://example.com/poster.jpg",
  "resumen": "A team of explorers travel through a wormhole...",
  "rating": 8.6,
  "generos": ["Aventura", "Drama", "Ciencia ficción"],
  "cast": ["Matthew McConaughey", "Anne Hathaway"],
  "runtime": 169,
  "trailerKey": "zSWdZVtXT7E"
}
```

**Required Fields:** `titulo`

**Response (201):** Created movie object

---

### Update Movie
**PUT** `/api/peliculas/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Same as create (partial updates allowed)

**Response (200):** Updated movie object

---

### Delete Movie
**DELETE** `/api/peliculas/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Movie deleted successfully"
}
```

Note: Movie is also removed from all lists automatically.

---

### Update Personal Data
**PATCH** `/api/peliculas/:id/personal`

Update personal rating and notes for a movie.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "personalRating": 9.5,
  "personalNotes": "One of my all-time favorites! The soundtrack is incredible."
}
```

**Response (200):** Updated movie object with personal data

---

## Lists Endpoints (Protected)

### Get All Lists
**GET** `/api/listas`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f191e810c19729de860ea",
    "name": "Favorites",
    "description": "My all-time favorite movies",
    "movies": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "titulo": "Inception",
        "miniatura": "https://example.com/poster.jpg",
        "rating": 8.8,
        "año": "2010"
      }
    ],
    "createdAt": "2025-01-10T12:00:00.000Z",
    "updatedAt": "2025-01-20T15:30:00.000Z"
  }
]
```

---

### Create List
**POST** `/api/listas`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "To Watch",
  "description": "Movies I want to watch soon"
}
```

**Required Fields:** `name`

**Response (201):** Created list object

---

### Delete List
**DELETE** `/api/listas/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "List deleted successfully"
}
```

Note: List references are removed from movies automatically.

---

### Add Movie to List
**POST** `/api/listas/:id/peliculas`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439011"
}
```

**Response (200):** Updated list object with movies populated

---

### Remove Movie from List
**DELETE** `/api/listas/:id/peliculas/:movieId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):** Updated list object

---

## TMDb Proxy Endpoints (Public)

These endpoints proxy requests to The Movie Database API. No authentication required.

### Search Movies
**GET** `/api/search`

**Query Parameters:**
- `query` (required): Search term
- `language` (optional): Language code (default: es-ES)

**Example:**
```
GET /api/search?query=inception&language=es-ES
```

**Response:** TMDb search results

---

### Get Movie Details
**GET** `/api/movie/:id`

**Query Parameters:**
- `language` (optional): Language code (default: es-ES)
- `append_to_response` (optional): Additional data (e.g., "credits,videos,reviews")

**Example:**
```
GET /api/movie/27205?append_to_response=credits,videos,reviews
```

**Response:** TMDb movie details

---

### Get Popular Movies
**GET** `/api/popular`

**Query Parameters:**
- `language` (optional): Language code (default: es-ES)
- `page` (optional): Page number (default: 1)

**Response:** TMDb popular movies list

---

## Health Check

### Server Health
**GET** `/api/health`

**Response (200):**
```json
{
  "status": "ok",
  "hasApiKey": true,
  "database": "connected"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```
or
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

---

## Rate Limiting

⚠️ **Note:** Rate limiting is not currently implemented. Before production deployment, add rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## CORS

CORS is enabled for all origins. In production, configure CORS to allow only your frontend domain:

```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com'
}));
```

---

## Environment Variables

Required environment variables:

```env
# TMDb API Configuration
TMDB_API_KEY=your_tmdb_bearer_token

# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/peliculas2025

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

---

## Authentication Flow

1. User registers with `/api/auth/register`
2. User logs in with `/api/auth/login` and receives JWT token
3. Frontend stores token (localStorage/sessionStorage)
4. All subsequent requests include token in Authorization header
5. Backend validates token and extracts userId
6. Operations are performed in context of authenticated user

---

## Data Isolation

- Each user can only access their own movies and lists
- userId is extracted from JWT token, not request body
- Database queries automatically filter by userId
- Prevents unauthorized access to other users' data

---

## Testing with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Use Token
```bash
# Get movies (replace TOKEN with your JWT)
curl http://localhost:3000/api/peliculas \
  -H "Authorization: Bearer TOKEN"

# Create movie
curl -X POST http://localhost:3000/api/peliculas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test Movie","director":"Test Director","año":"2025"}'
```
