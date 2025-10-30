// CONTROLLERS - Business logic that connects models and views
// This module contains all controller functions that handle user interactions

import { legacyAPI, moviesAPI, tmdbAPI, authAPI } from './model.js';
import * as views from './views.js';

// State management
let mis_peliculas = [];
let lastSearchQuery = '';
let lastSearchResults = [];

// Initial movies data
const mis_peliculas_iniciales = [
    {titulo: "Superlópez",   director: "Javier Ruiz Caldera", año: "2018", miniatura: "files/superlopez.png"},
    {titulo: "Jurassic Park", director: "Steven Spielberg", año: "1993", miniatura: "files/jurassicpark.png"},
    {titulo: "Interstellar",  director: "Christopher Nolan", año: "2014", miniatura: "files/interstellar.png"}
];

// INIT CONTROLLER - Initialize the application
export const initContr = async () => {
    // Check if user is logged in
    const user = authAPI.getCurrentUser();
    views.updateAuthUI(user);
    
    // If no movies in localStorage, initialize with default movies
    if (!localStorage.getItem('mis_peliculas')) {
        await legacyAPI.postAPI(mis_peliculas_iniciales);
    }
    
    indexContr();
};

// INDEX CONTROLLER - Show main list of movies
export const indexContr = async () => {
    try {
        mis_peliculas = await legacyAPI.getAPI();
        views.render(views.indexView(mis_peliculas));
    } catch (error) {
        console.error('Error loading movies:', error);
        alert('Error al cargar las películas');
    }
};

// SHOW CONTROLLER - Show movie details
export const showContr = (i) => {
    views.render(views.showView(mis_peliculas[i]));
};

// NEW CONTROLLER - Show create form
export const newContr = () => {
    views.render(views.newView());
};

// CREATE CONTROLLER - Create a new movie
export const createContr = async () => {
    const titulo = document.getElementById('titulo').value;
    const director = document.getElementById('director').value;
    const año = document.getElementById('año').value;
    const miniatura = document.getElementById('miniatura').value;
    
    mis_peliculas.push({titulo, director, año, miniatura});
    await legacyAPI.updateAPI(mis_peliculas);
    indexContr();
};

// EDIT CONTROLLER - Show edit form
export const editContr = (i) => {
    views.render(views.editView(i, mis_peliculas[i]));
};

// UPDATE CONTROLLER - Update an existing movie
export const updateContr = async (i) => {
    const titulo = document.getElementById('titulo').value;
    const director = document.getElementById('director').value;
    const año = document.getElementById('año').value;
    const miniatura = document.getElementById('miniatura').value;
    
    mis_peliculas[i] = {titulo, director, año, miniatura, ...mis_peliculas[i]};
    await legacyAPI.updateAPI(mis_peliculas);
    indexContr();
};

// DELETE CONTROLLER - Delete a movie
export const deleteContr = async (i) => {
    if (confirm('¿Estás seguro de que quieres borrar esta película?')) {
        mis_peliculas.splice(i, 1);
        await legacyAPI.updateAPI(mis_peliculas);
        indexContr();
    }
};

// RESET CONTROLLER - Reset to initial movies
export const resetContr = async () => {
    if (confirm('¿Estás seguro de que quieres resetear la lista a las películas iniciales?')) {
        await legacyAPI.postAPI(mis_peliculas_iniciales);
        mis_peliculas = mis_peliculas_iniciales;
        indexContr();
    }
};

// SEARCH VIEW CONTROLLER - Show search form
export const searchViewContr = () => {
    views.render(views.searchView());
};

// SEARCH CONTROLLER - Perform movie search
export const searchContr = async () => {
    const query = document.getElementById('search-query').value.trim();
    
    if (!query) {
        views.render(views.searchViewWithError('Por favor, introduce un título para buscar', query));
        return;
    }
    
    try {
        const data = await tmdbAPI.search(query);
        
        if (!data.results || data.results.length === 0) {
            // Try to get suggestions
            await searchWithSuggestionsContr(query);
        } else {
            lastSearchQuery = query;
            lastSearchResults = data.results;
            views.render(views.resultsView(data.results, query));
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        views.render(views.searchViewWithError('Error al buscar películas. Por favor, intenta de nuevo.', query));
    }
};

// SEARCH WITH SUGGESTIONS CONTROLLER
export const searchWithSuggestionsContr = async (query) => {
    try {
        const data = await tmdbAPI.getPopular();
        const suggestions = data.results.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        
        views.render(views.searchViewWithSuggestions(query, suggestions));
    } catch (error) {
        console.error('Error getting suggestions:', error);
        views.render(views.searchViewWithError('No se encontraron resultados para "' + query + '"', query));
    }
};

// ADD FROM API CONTROLLER - Add movie from TMDb search results
export const addFromAPIContr = async (ev) => {
    try {
        const movieData = JSON.parse(ev.target.dataset.movie.replace(/&apos;/g, "'"));
        
        // Check if movie already exists
        const exists = mis_peliculas.some(p => p.titulo === movieData.title);
        if (exists) {
            alert('Esta película ya está en tu colección');
            return;
        }
        
        // Get detailed movie information
        const detailedData = await tmdbAPI.getMovieDetails(movieData.id);
        
        // Extract director from credits
        let director = 'Desconocido';
        if (detailedData.credits && detailedData.credits.crew) {
            const directorObj = detailedData.credits.crew.find(person => person.job === 'Director');
            if (directorObj) {
                director = directorObj.name;
            }
        }
        
        // Extract genres
        let generos = [];
        if (detailedData.genres) {
            generos = detailedData.genres.map(g => g.name);
        }
        
        // Extract cast (top 5)
        let cast = [];
        if (detailedData.credits && detailedData.credits.cast) {
            cast = detailedData.credits.cast.slice(0, 5).map(actor => actor.name);
        }
        
        // Extract trailer
        let trailerKey = null;
        if (detailedData.videos && detailedData.videos.results) {
            const trailer = detailedData.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                trailerKey = trailer.key;
            }
        }
        
        // Extract reviews
        let reviews = [];
        if (detailedData.reviews && detailedData.reviews.results) {
            reviews = detailedData.reviews.results.slice(0, 3).map(review => ({
                author: review.author,
                content: review.content,
                rating: review.author_details.rating
            }));
        }
        
        const posterUrl = movieData.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : 'files/placeholder.png';
        
        const nuevaPelicula = {
            titulo: movieData.title,
            director: director,
            año: movieData.release_date ? movieData.release_date.split('-')[0] : '',
            miniatura: posterUrl,
            resumen: movieData.overview || '',
            rating: movieData.vote_average || null,
            generos: generos,
            cast: cast,
            runtime: detailedData.runtime || null,
            trailerKey: trailerKey,
            reviews: reviews,
            budget: detailedData.budget || null,
            revenue: detailedData.revenue || null,
            tagline: detailedData.tagline || null,
            popularity: detailedData.popularity || null,
            original_language: detailedData.original_language || null,
            vote_count: detailedData.vote_count || null
        };
        
        mis_peliculas.push(nuevaPelicula);
        await legacyAPI.updateAPI(mis_peliculas);
        
        alert('Película añadida correctamente');
        indexContr();
    } catch (error) {
        console.error('Error adding movie from API:', error);
        alert('Error al añadir la película. Por favor, intenta de nuevo.');
    }
};

// BACK TO SEARCH CONTROLLER
export const backToSearchContr = () => {
    if (lastSearchResults.length > 0) {
        views.render(views.resultsView(lastSearchResults, lastSearchQuery));
    } else {
        searchViewContr();
    }
};

// CONSULT FROM API CONTROLLER - Show detailed movie info from TMDb
export const consultFromAPIContr = async (ev) => {
    try {
        const movieId = ev.target.dataset.movieId;
        const movieData = await tmdbAPI.getMovieDetails(movieId);
        
        // Similar processing as addFromAPIContr
        let director = 'Desconocido';
        if (movieData.credits && movieData.credits.crew) {
            const directorObj = movieData.credits.crew.find(person => person.job === 'Director');
            if (directorObj) {
                director = directorObj.name;
            }
        }
        
        let generos = [];
        if (movieData.genres) {
            generos = movieData.genres.map(g => g.name);
        }
        
        let cast = [];
        if (movieData.credits && movieData.credits.cast) {
            cast = movieData.credits.cast.slice(0, 5).map(actor => actor.name);
        }
        
        let trailerKey = null;
        if (movieData.videos && movieData.videos.results) {
            const trailer = movieData.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                trailerKey = trailer.key;
            }
        }
        
        let reviews = [];
        if (movieData.reviews && movieData.reviews.results) {
            reviews = movieData.reviews.results.slice(0, 3).map(review => ({
                author: review.author,
                content: review.content,
                rating: review.author_details.rating
            }));
        }
        
        const posterUrl = movieData.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : 'files/placeholder.png';
        
        const peliculaConsulta = {
            titulo: movieData.title,
            director: director,
            año: movieData.release_date ? movieData.release_date.split('-')[0] : '',
            miniatura: posterUrl,
            resumen: movieData.overview || '',
            rating: movieData.vote_average || null,
            generos: generos,
            cast: cast,
            runtime: movieData.runtime || null,
            trailerKey: trailerKey,
            reviews: reviews,
            budget: movieData.budget || null,
            revenue: movieData.revenue || null,
            tagline: movieData.tagline || null,
            popularity: movieData.popularity || null,
            original_language: movieData.original_language || null,
            vote_count: movieData.vote_count || null
        };
        
        // Show the detailed view
        views.render(views.showView(peliculaConsulta));
    } catch (error) {
        console.error('Error consulting movie:', error);
        alert('Error al consultar la película. Por favor, intenta de nuevo.');
        searchViewContr();
    }
};

// SUGGESTION CLICK CONTROLLER
export const suggestionClickContr = (ev) => {
    const query = ev.currentTarget.dataset.suggestionQuery;
    if (query) {
        // Update search input and trigger search
        setTimeout(() => {
            const searchInput = document.getElementById('search-query');
            if (searchInput) {
                searchInput.value = query;
                searchContr();
            }
        }, 100);
    }
};

// AUTH CONTROLLERS

// Show login/register form
export const showAuthContr = (isLogin = true) => {
    views.render(views.authView(isLogin));
};

// Handle auth form submission
export const authSubmitContr = async (ev) => {
    ev.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isLogin = !document.getElementById('username');
    
    try {
        if (isLogin) {
            const result = await authAPI.login(email, password);
            views.updateAuthUI(result.user);
            alert('Inicio de sesión exitoso');
            indexContr();
        } else {
            const username = document.getElementById('username').value;
            await authAPI.register(username, email, password);
            alert('Registro exitoso. Por favor, inicia sesión.');
            showAuthContr(true);
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert(error.message || 'Error en la autenticación');
    }
};

// Toggle between login and register
export const authToggleContr = (ev) => {
    const isLogin = ev.target.dataset.isLogin === 'true';
    showAuthContr(!isLogin);
};

// Logout
export const logoutContr = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        authAPI.logout();
        views.updateAuthUI(null);
        indexContr();
    }
};

// ============================================================================
// PERSONAL DATA CONTROLLERS (Rating and Notes)
// ============================================================================

// Show personal data form
export const managePersonalContr = (i) => {
    views.render(views.personalDataView(mis_peliculas[i]));
};

// Save personal rating and notes
export const savePersonalContr = async () => {
    try {
        const movieId = event.target.dataset.movieId;
        const personalRating = parseFloat(document.getElementById('personal-rating').value) || null;
        const personalNotes = document.getElementById('personal-notes').value || '';
        
        if (!movieId) {
            // Fallback to localStorage update
            // Find movie in array and update
            const index = mis_peliculas.findIndex(p => p._id === movieId);
            if (index >= 0) {
                mis_peliculas[index].personalRating = personalRating;
                mis_peliculas[index].personalNotes = personalNotes;
                await legacyAPI.updateAPI(mis_peliculas);
            }
        }
        
        alert('Datos personales guardados correctamente');
        indexContr();
    } catch (error) {
        console.error('Error saving personal data:', error);
        alert('Error al guardar los datos personales');
    }
};

// ============================================================================
// LISTS CONTROLLERS
// ============================================================================

let userLists = [];

// Show lists management view
export const manageListsContr = async () => {
    try {
        // Try to get lists from API if user is logged in
        if (authAPI.isLoggedIn()) {
            // When backend is fully integrated, this will work
            // For now, show empty state
            userLists = [];
        }
        
        views.render(views.listsManagementView(userLists));
    } catch (error) {
        console.error('Error loading lists:', error);
        views.render(views.listsManagementView([]));
    }
};

// Create new list
export const createListContr = async () => {
    try {
        const name = document.getElementById('new-list-name').value.trim();
        const description = document.getElementById('new-list-description').value.trim();
        
        if (!name) {
            alert('Por favor, introduce un nombre para la lista');
            return;
        }
        
        // Create list (will work when backend is integrated)
        // For now, just show message
        alert('Funcionalidad de listas disponible cuando inicies sesión con el backend');
        
    } catch (error) {
        console.error('Error creating list:', error);
        alert('Error al crear la lista');
    }
};

// View specific list
export const viewListContr = async (listId) => {
    try {
        // Find list in userLists
        const lista = userLists.find(l => l._id === listId);
        
        if (!lista) {
            alert('Lista no encontrada');
            return;
        }
        
        views.render(views.listView(lista));
    } catch (error) {
        console.error('Error viewing list:', error);
        alert('Error al cargar la lista');
    }
};

// Delete list
export const deleteListContr = async (listId) => {
    try {
        if (!confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
            return;
        }
        
        // Delete list (will work when backend is integrated)
        alert('Funcionalidad de listas disponible cuando inicies sesión con el backend');
        
    } catch (error) {
        console.error('Error deleting list:', error);
        alert('Error al eliminar la lista');
    }
};
