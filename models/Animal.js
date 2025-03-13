const mongoose = require('mongoose');
const getNextSequence = require('../models/counterService');

// Schemat Animal
const AnimalSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    description: String,
    habitat: { type: String, required: true },
    diet: { type: String, required: true },
    healthStatus: { type: String, default: 'healthy' }
});

// Hook generujący _id przed zapisaniem
AnimalSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequence('animalId');
    }
    next();
});

module.exports = mongoose.model('Animal', AnimalSchema);
