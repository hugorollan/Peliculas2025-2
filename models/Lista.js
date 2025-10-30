const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'List name is required'],
        trim: true,
        maxlength: [50, 'List name cannot exceed 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pelicula'
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
listaSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create compound index for userId
listaSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Lista', listaSchema);
