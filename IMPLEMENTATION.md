# TMDb API Integration - Implementation Summary

## Completed Features

### 1. TMDb API Key Configuration
- Added `TMDB_API_KEY` constant at the top of `script.js`
- Using the Bearer token provided in the requirements

### 2. Search View (`searchView()`)
- Created a modal dialog with search input field
- Input field accepts movie title search
- "Buscar" button to execute search
- "Volver" button to return to main view
- Support for Enter key to trigger search

### 3. Search Controller (`searchContr()`)
- Validates search query is not empty
- Makes GET request to TMDb API endpoint: `https://api.themoviedb.org/3/search/movie`
- Includes proper headers (accept: application/json, Authorization: Bearer token)
- Uses Spanish language parameter (`language=es-ES`)
- Handles errors gracefully with user feedback
- Displays results using `resultsView()`

### 4. Results View (`resultsView(resultados)`)
- Displays search results in a grid layout
- Shows movie poster (or placeholder if not available)
- Shows movie title
- Shows release year
- Includes "Añadir" button for each movie
- Shows "No se encontraron películas" message when no results
- "Volver al inicio" button to return to main view

### 5. Add from API Controller (`addFromAPIContr(pelicula)`)
- Extracts movie data from button's data attribute
- Checks for duplicate movies by title
- Creates movie object with:
  - `titulo`: Movie title from TMDb
  - `director`: Set to "TMDb" (default, as search API doesn't include director)
  - `miniatura`: Full poster URL from TMDb or placeholder
- Adds movie to `mis_peliculas` array
- Updates localStorage
- Shows confirmation alert
- Returns to main view

### 6. Navigation Button
- Added "Buscar película" button to navigation bar
- Button triggers `searchViewContr()` via `.search-view` class

### 7. Router Updates
- Added `.search-view` event → `searchViewContr()`
- Added `.search` event → `searchContr()`
- Added `.add-from-api` event → `addFromAPIContr(ev)`
- Added keypress event listener for Enter key in search field

## API Integration Details

### Endpoint Used
```
GET https://api.themoviedb.org/3/search/movie?query={query}&language=es-ES
```

### Request Headers
```javascript
{
  accept: 'application/json',
  Authorization: 'Bearer {TMDB_API_KEY}'
}
```

### Response Handling
- Parses JSON response
- Extracts `results` array
- Maps movie data:
  - `poster_path` → Full image URL (https://image.tmdb.org/t/p/w500{path})
  - `title` → Movie title
  - `release_date` → Extracted year

## User Flow

1. User clicks "Buscar película" button
2. Search modal appears with input field
3. User enters movie title and clicks "Buscar" (or presses Enter)
4. API request is made to TMDb
5. Results are displayed in grid format
6. User clicks "Añadir" on desired movie
7. Movie is checked for duplicates
8. Movie is added to localStorage
9. Confirmation alert is shown
10. User returns to main view with new movie visible

## Error Handling

- Empty search query validation
- Network error handling with user-friendly alerts
- Duplicate movie detection
- Fallback to placeholder images when posters not available
- Console error logging for debugging

## Notes

- The implementation follows the MVC pattern established in the codebase
- All new functions follow the existing naming conventions
- The UI uses the same modal design pattern as existing features
- Movies added from TMDb have "TMDb" as director (limitation of search API)
- To get actual director information, would need additional API call to movie details endpoint
