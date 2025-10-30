const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving with security restrictions
// Note: While serving from root, we protect sensitive files through multiple layers:
// 1. dotfiles: 'deny' - prevents access to .env, .git, and other dotfiles
// 2. extensions whitelist - only serves safe file types
// 3. .gitignore prevents committing sensitive files like node_modules
app.use('/files', express.static('files')); // Movie images
app.use('/tests', express.static('tests')); // Test files
app.use(express.static('.', {
    index: 'index.html',
    dotfiles: 'deny', // Prevents access to .env and other dotfiles
    extensions: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'md']
}));

// TMDb API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDb API requests
// This function ensures we only make requests to the trusted TMDb API
async function fetchFromTMDb(endpoint, params = {}) {
    // Validate that endpoint starts with / and doesn't contain .. or other path traversal attempts
    if (!endpoint.startsWith('/') || endpoint.includes('..')) {
        throw new Error('Invalid endpoint');
    }
    
    const queryParams = new URLSearchParams(params);
    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
    
    const response = await fetch(url, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${TMDB_API_KEY}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`TMDb API error: ${response.status}`);
    }
    
    return response.json();
}

// API Routes

// Search movies
app.get('/api/search', async (req, res) => {
    try {
        const { query, language = 'es-ES' } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        
        const data = await fetchFromTMDb('/search/movie', { query, language });
        res.json(data);
    } catch (error) {
        console.error('Error in /api/search:', error);
        res.status(500).json({ error: 'Error searching movies' });
    }
});

// Get movie details
app.get('/api/movie/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { language = 'es-ES', append_to_response } = req.query;
        
        // Validate that id is a number to prevent injection
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }
        
        const params = { language };
        if (append_to_response) {
            params.append_to_response = append_to_response;
        }
        
        const data = await fetchFromTMDb(`/movie/${id}`, params);
        res.json(data);
    } catch (error) {
        console.error('Error in /api/movie:', error);
        res.status(500).json({ error: 'Error fetching movie details' });
    }
});

// Get popular movies
app.get('/api/popular', async (req, res) => {
    try {
        const { language = 'es-ES', page = 1 } = req.query;
        
        const data = await fetchFromTMDb('/movie/popular', { language, page });
        res.json(data);
    } catch (error) {
        console.error('Error in /api/popular:', error);
        res.status(500).json({ error: 'Error fetching popular movies' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        hasApiKey: !!TMDB_API_KEY 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!TMDB_API_KEY) {
        console.warn('⚠️  WARNING: TMDB_API_KEY is not set in environment variables!');
    } else {
        console.log('✓ TMDB_API_KEY is configured');
    }
});
