// MODEL - Data management layer
// This module handles all data operations including API calls to backend

// API configuration
const API_BASE_URL = '/api';

// Helper function to get JWT token from storage
const getToken = () => {
    return localStorage.getItem('jwt_token');
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Handle authentication errors
    if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        throw new Error('Authentication required');
    }
    
    return response;
};

// Authentication API functions
export const authAPI = {
    // Register a new user
    async register(username, email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        return response.json();
    },
    
    // Login user
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        const data = await response.json();
        
        // Store token and user info
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    },
    
    // Logout user
    logout() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
    },
    
    // Check if user is logged in
    isLoggedIn() {
        return !!getToken();
    },
    
    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

// Movies API functions
export const moviesAPI = {
    // Get all movies for current user
    async getAll() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/peliculas`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching movies:', error);
            // Fallback to localStorage if backend is not available
            return this.getAllFromLocalStorage();
        }
    },
    
    // Create a new movie
    async create(movieData) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/peliculas`, {
                method: 'POST',
                body: JSON.stringify(movieData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create movie');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error creating movie:', error);
            throw error;
        }
    },
    
    // Update an existing movie
    async update(id, movieData) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/peliculas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(movieData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update movie');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error updating movie:', error);
            throw error;
        }
    },
    
    // Delete a movie
    async delete(id) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/peliculas/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
        }
    },
    
    // Fallback methods for localStorage (backward compatibility)
    getAllFromLocalStorage() {
        const pelis = localStorage.getItem('mis_peliculas');
        if (!pelis) return [];
        try {
            return JSON.parse(pelis);
        } catch {
            return [];
        }
    },
    
    saveToLocalStorage(peliculas) {
        localStorage.setItem('mis_peliculas', JSON.stringify(peliculas));
    }
};

// TMDb API functions (for searching movies)
export const tmdbAPI = {
    // Search movies
    async search(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&language=es-ES`);
            
            if (!response.ok) {
                throw new Error('Failed to search movies');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    },
    
    // Get movie details
    async getMovieDetails(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/movie/${id}?language=es-ES&append_to_response=credits,videos,reviews`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    },
    
    // Get popular movies
    async getPopular() {
        try {
            const response = await fetch(`${API_BASE_URL}/popular?language=es-ES`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch popular movies');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    }
};

// Lists API functions (for managing multiple lists)
export const listsAPI = {
    // Get all lists for current user
    async getAll() {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/listas`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch lists');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching lists:', error);
            throw error;
        }
    },
    
    // Create a new list
    async create(name, description = '') {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/listas`, {
                method: 'POST',
                body: JSON.stringify({ name, description })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create list');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error creating list:', error);
            throw error;
        }
    },
    
    // Delete a list
    async delete(id) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/listas/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete list');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error deleting list:', error);
            throw error;
        }
    },
    
    // Add movie to list
    async addMovie(listId, movieId) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/listas/${listId}/peliculas`, {
                method: 'POST',
                body: JSON.stringify({ movieId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add movie to list');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error adding movie to list:', error);
            throw error;
        }
    },
    
    // Remove movie from list
    async removeMovie(listId, movieId) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/listas/${listId}/peliculas/${movieId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to remove movie from list');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error removing movie from list:', error);
            throw error;
        }
    }
};

// Legacy API functions for backward compatibility during migration
export const legacyAPI = {
    async getAPI() {
        return moviesAPI.getAllFromLocalStorage();
    },
    
    async postAPI(peliculas) {
        moviesAPI.saveToLocalStorage(peliculas);
        return true;
    },
    
    async updateAPI(peliculas) {
        moviesAPI.saveToLocalStorage(peliculas);
        return true;
    }
};
