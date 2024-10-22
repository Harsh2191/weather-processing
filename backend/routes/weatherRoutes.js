const express = require('express');
const axios = require('axios');
const cron = require('node-cron'); // Ensure cron is imported
const DailySummary = require('../models/DailySummary');
const GlobalSummary = require('../models/GlobalSummary')
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const defaultCities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const API_KEY = process.env.API_KEY; // Make sure API_KEY is imported from environment variables

const {fetchWeatherData , updateOrCreateDailySummary , updateOrCreateGlobalSummary}= require('../utils/utilityfun');



// Route to get current weather for a selected city
router.get('/weather/:city', async (req, res) => {
    const { city } = req.params; // Correctly get the city parameter

    console.log(city);

    try {
        const weatherData = await fetchWeatherData([city]);
        res.json(weatherData.filter(data => data !== null)); // Filter out errors
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});




// Route to get daily summary for a specific city
router.get('/daily-summary/:city', async (req, res) => {
    const { city } = req.params;
    try {
        const summary = await DailySummary.find({ city }).sort({ date: -1 }).limit(1); // Last 7 days
        res.json(summary);
    } catch (error) {
        console.error('Error fetching daily summaries:', error);
        res.status(500).json({ error: 'Failed to fetch daily summaries' });
    }
});


// Route to get global summary
router.get('/global-summary', async (req, res) => {
    try {
        const summary = await GlobalSummary.find().sort({ date: -1 }).limit(1); // Fetch the most recent global summary
        res.json(summary);
    } catch (error) {
        console.error('Error fetching global summary:', error);
        res.status(500).json({ error: 'Failed to fetch global summary' });
    }
});




cron.schedule('*/5 * * * *', async () => {
    console.log('Fetching weather data every 5 minutes...');
    const weatherData = await fetchWeatherData(defaultCities);

    // Update or create daily summaries for each city
    weatherData.forEach(async (data) => {
        if (data) {
            await updateOrCreateDailySummary(data);
        }
    });

    // Update or create the global summary
    const validData = weatherData.filter(data => data !== null);
    if (validData.length === defaultCities.length) {
        await updateOrCreateGlobalSummary(validData);
    }
});


// Export the router using CommonJS syntax
module.exports = router;
