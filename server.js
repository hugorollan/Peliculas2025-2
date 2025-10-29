const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the current directory

// TMDb API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDb API requests
async function fetchFromTMDb(endpoint, params = {}) {
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
