const mongoose = require('mongoose');
const getNextSequence = require('../models/counterService');

const EventSchema = new mongoose.Schema({
    _id: { type: Number },
    title: { type: String, required: true },
    description: String,
    animal: { type: Number, ref: 'Animal' },
    time: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    location: { type: String, required: true },
});

EventSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequence('eventId');
    }
    next();
});

module.exports = mongoose.model('Event', EventSchema);
