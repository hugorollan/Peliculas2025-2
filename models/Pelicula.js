const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    titulo: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    director: {
        type: String,
        trim: true
    },
    año: {
        type: String,
        trim: true
    },
    miniatura: {
        type: String,
        trim: true
    },
    resumen: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    generos: [{
        type: String,
        trim: true
    }],
    cast: [{
        type: String,
        trim: true
    }],
    runtime: {
        type: Number,
        min: 0
    },
    trailerKey: {
        type: String,
        trim: true
    },
    reviews: [{
        author: String,
        content: String,
        rating: Number
    }],
    budget: {
        type: Number,
        min: 0
    },
    revenue: {
        type: Number,
        min: 0
    },
    tagline: {
        type: String,
        trim: true
    },
    popularity: {
        type: Number,
        min: 0
    },
    original_language: {
        type: String,
        trim: true
    },
    vote_count: {
        type: Number,
        min: 0
    },
    // Personal user data
    personalRating: {
        type: Number,
        min: 0,
        max: 10
    },
    personalNotes: {
        type: String,
        trim: true
    },
    // Lists this movie belongs to
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lista'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
peliculaSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create compound index for userId to optimize queries
peliculaSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Pelicula', peliculaSchema);
