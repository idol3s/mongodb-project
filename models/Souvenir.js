const mongoose = require('mongoose');
const getNextSequence = require('../models/counterService');

const SouvenirSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: String
});

SouvenirSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequence('souvenirId');
    }
    next();
});

module.exports = mongoose.model('Souvenir', SouvenirSchema);
