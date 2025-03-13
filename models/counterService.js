const Counter = require('../models/Counter');

async function getNextSequence(name) {
    const result = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
    );
    return result.seq;
}

module.exports = getNextSequence;
