const mongoose = require('mongoose');

const globalSummarySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    maxTemperature: { type: Number, required: true },
    maxTemperatureCity: { type: String, required: true }, // City with max temperature
    minTemperature: { type: Number, required: true },
    minTemperatureCity: { type: String, required: true }, // City with min temperature
    averageTemperature: { type: Number, required: true },
    dominantWeather: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('GlobalSummary', globalSummarySchema);
