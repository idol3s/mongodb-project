const mongoose = require('mongoose');
const getNextSequence = require('../models/counterService');

const EmployeeSchema = new mongoose.Schema({
    _id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    assignedAnimal: { type: Number, ref: 'Animal' },
});

EmployeeSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await getNextSequence('employeeId');
    }
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);
