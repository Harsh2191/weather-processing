const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        unique: true, // Ensure unique entries per day for each city
    },
    averageTemperature: {
        type: Number,
        required: true,
    },
    maxTemperature: {
        type: Number,
        required: true,
    },
    minTemperature: {
        type: Number,
        required: true,
    },
    dominantWeather: {
        type: String,
        required: true,
    },
    averageHumidity: { // Adding the average humidity field
        type: Number,
        required: true,
    },
    averageWindSpeed: { // Adding the average wind speed field
        type: Number,
        required: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the model
const DailySummary = mongoose.model('DailySummary', DailySummarySchema);

module.exports = DailySummary;
