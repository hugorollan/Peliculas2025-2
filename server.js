const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Pelicula = require('./models/Pelicula');
const Lista = require('./models/Lista');

// Import middleware
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/peliculas2025';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✓ Connected to MongoDB');
})
.catch((error) => {
    console.error('✗ MongoDB connection error:', error.message);
    console.log('⚠️  Running in fallback mode (localStorage only)');
});

// Static file serving with security restrictions
app.use('/files', express.static('files'));
app.use('/tests', express.static('tests'));
app.use(express.static('.', {
    index: 'index.html',
    dotfiles: 'deny',
    extensions: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'md']
}));

// TMDb API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDb API requests
async function fetchFromTMDb(endpoint, params = {}) {
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

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Error creating user' });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// ============================================================================
// MOVIES (PELICULAS) ROUTES - Protected
// ============================================================================

// Get all movies for current user
app.get('/api/peliculas', auth, async (req, res) => {
    try {
        const peliculas = await Pelicula.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .populate('lists', 'name');
        
        res.json(peliculas);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// Get a single movie by ID
app.get('/api/peliculas/:id', auth, async (req, res) => {
    try {
        const pelicula = await Pelicula.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        }).populate('lists', 'name');
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json(pelicula);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ error: 'Error fetching movie' });
    }
});

// Create new movie
app.post('/api/peliculas', auth, async (req, res) => {
    try {
        const peliculaData = {
            ...req.body,
            userId: req.userId
        };
        
        const pelicula = new Pelicula(peliculaData);
        await pelicula.save();
        
        res.status(201).json(pelicula);
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ error: error.message || 'Error creating movie' });
    }
});

// Update movie
app.put('/api/peliculas/:id', auth, async (req, res) => {
    try {
        const pelicula = await Pelicula.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json(pelicula);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: error.message || 'Error updating movie' });
    }
});

// Delete movie
app.delete('/api/peliculas/:id', auth, async (req, res) => {
    try {
        const pelicula = await Pelicula.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        // Remove movie from all lists
        await Lista.updateMany(
            { userId: req.userId },
            { $pull: { movies: req.params.id } }
        );
        
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Error deleting movie' });
    }
});

// Update personal rating and notes
app.patch('/api/peliculas/:id/personal', auth, async (req, res) => {
    try {
        const { personalRating, personalNotes } = req.body;
        
        const updateData = {};
        if (personalRating !== undefined) updateData.personalRating = personalRating;
        if (personalNotes !== undefined) updateData.personalNotes = personalNotes;
        updateData.updatedAt = Date.now();
        
        const pelicula = await Pelicula.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!pelicula) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json(pelicula);
    } catch (error) {
        console.error('Error updating personal data:', error);
        res.status(500).json({ error: 'Error updating personal data' });
    }
});

// ============================================================================
// LISTS (LISTAS) ROUTES - Protected
// ============================================================================

// Get all lists for current user
app.get('/api/listas', auth, async (req, res) => {
    try {
        const listas = await Lista.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .populate('movies', 'titulo miniatura rating año');
        
        res.json(listas);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ error: 'Error fetching lists' });
    }
});

// Create new list
app.post('/api/listas', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'List name is required' });
        }
        
        const lista = new Lista({
            userId: req.userId,
            name,
            description: description || ''
        });
        
        await lista.save();
        res.status(201).json(lista);
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ error: error.message || 'Error creating list' });
    }
});

// Delete list
app.delete('/api/listas/:id', auth, async (req, res) => {
    try {
        const lista = await Lista.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!lista) {
            return res.status(404).json({ error: 'List not found' });
        }
        
        // Remove list reference from all movies
        await Pelicula.updateMany(
            { userId: req.userId },
            { $pull: { lists: req.params.id } }
        );
        
        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ error: 'Error deleting list' });
    }
});

// Add movie to list
app.post('/api/listas/:id/peliculas', auth, async (req, res) => {
    try {
        const { movieId } = req.body;
        
        if (!movieId) {
            return res.status(400).json({ error: 'Movie ID is required' });
        }
        
        // Verify movie belongs to user
        const movie = await Pelicula.findOne({ _id: movieId, userId: req.userId });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        // Add movie to list
        const lista = await Lista.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $addToSet: { movies: movieId }, updatedAt: Date.now() },
            { new: true }
        ).populate('movies', 'titulo miniatura rating año');
        
        if (!lista) {
            return res.status(404).json({ error: 'List not found' });
        }
        
        // Add list to movie
        await Pelicula.findByIdAndUpdate(
            movieId,
            { $addToSet: { lists: req.params.id } }
        );
        
        res.json(lista);
    } catch (error) {
        console.error('Error adding movie to list:', error);
        res.status(500).json({ error: 'Error adding movie to list' });
    }
});

// Remove movie from list
app.delete('/api/listas/:id/peliculas/:movieId', auth, async (req, res) => {
    try {
        const lista = await Lista.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $pull: { movies: req.params.movieId }, updatedAt: Date.now() },
            { new: true }
        ).populate('movies', 'titulo miniatura rating año');
        
        if (!lista) {
            return res.status(404).json({ error: 'List not found' });
        }
        
        // Remove list from movie
        await Pelicula.findByIdAndUpdate(
            req.params.movieId,
            { $pull: { lists: req.params.id } }
        );
        
        res.json(lista);
    } catch (error) {
        console.error('Error removing movie from list:', error);
        res.status(500).json({ error: 'Error removing movie from list' });
    }
});

// ============================================================================
// TMDB API PROXY ROUTES (Public)
// ============================================================================

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
        hasApiKey: !!TMDB_API_KEY,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!TMDB_API_KEY) {
        console.warn('⚠️  WARNING: TMDB_API_KEY is not set in environment variables!');
    } else {
        console.log('✓ TMDB_API_KEY is configured');
    }
    if (!process.env.JWT_SECRET) {
        console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
    }
});
