
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.API_KEY;
const axios = require('axios');
const DailySummary = require('../models/DailySummary');
const GlobalSummary = require('../models/GlobalSummary')



// Utility function to get weather data for cities
const fetchWeatherData = async (cities) => {
  return Promise.all(cities.map(async (city) => {
    

      try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
              params: {
                  q: city,
                  appid: API_KEY,
                  units: 'metric',
              },
          });
         
          return {
              city: response.data.name,
              temperature: response.data.main.temp,
              feels_like: response.data.main.feels_like,
              main: response.data.weather[0].main,
              dt: response.data.dt,
              humidity: response.data.main.humidity,
              wind_speed: response.data.wind.speed,
            
          };
      } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error.response ? error.response.data : error.message);
          return null;
      }
  }));
};

// Function to update or create daily summary
const updateOrCreateDailySummary = async (data) => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

  const existingSummary = await DailySummary.findOne({
      city: data.city,
      date: { $gte: new Date(dateString) }
  });

  if (!existingSummary) {
      // Create a new summary if it doesn't exist
      await DailySummary.create({
          city: data.city,
          date: today,
          averageTemperature: data.temperature,
          maxTemperature: data.temperature,
          minTemperature: data.temperature,
          dominantWeather: data.main,
          averageHumidity: data.humidity, // Initialize with current humidity
          averageWindSpeed: data.wind_speed, // Initialize with current wind speed
      });
  } else {
      // Update existing summary
      existingSummary.averageTemperature = (existingSummary.averageTemperature + data.temperature) / 2;
      existingSummary.maxTemperature = Math.max(existingSummary.maxTemperature, data.temperature);
      existingSummary.minTemperature = Math.min(existingSummary.minTemperature, data.temperature);
      existingSummary.averageHumidity = (existingSummary.averageHumidity + data.humidity) / 2;
      existingSummary.averageWindSpeed = (existingSummary.averageWindSpeed + data.wind_speed) / 2;
      existingSummary.dominantWeather = data.main; // For now, just take the latest condition
      await existingSummary.save();
  }
};


// Function to update or create daily summary
const updateOrCreateGlobalSummary = async (allCitiesData) => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Calculate global statistics
  const temperatures = allCitiesData.map(city => city.temperature);
  const maxTemperature = Math.max(...temperatures);
  const minTemperature = Math.min(...temperatures);
  const avgTemperature = temperatures.reduce((acc, temp) => acc + temp, 0) / temperatures.length;

  const maxTemperatureCity = allCitiesData.find(city => city.temperature === maxTemperature).city;
  const minTemperatureCity = allCitiesData.find(city => city.temperature === minTemperature).city;

  const dominantWeathers = allCitiesData.map(city => city.main);
  const dominantWeather = dominantWeathers.sort((a, b) =>
      dominantWeathers.filter(v => v === a).length - dominantWeathers.filter(v => v === b).length
  ).pop(); // Weather condition with the most occurrences

  const existingSummary = await GlobalSummary.findOne({ date: { $gte: new Date(dateString) } });

  if (!existingSummary) {
      // Create a new global summary if it doesn't exist
      await GlobalSummary.create({
          date: today,
          maxTemperature,
          maxTemperatureCity,
          minTemperature,
          minTemperatureCity,
          averageTemperature: avgTemperature,
          dominantWeather,
      });
  } else {
      // Update existing global summary
      existingSummary.averageTemperature = (existingSummary.averageTemperature + avgTemperature) / 2;
      existingSummary.maxTemperature = Math.max(existingSummary.maxTemperature, maxTemperature);
      existingSummary.maxTemperatureCity = maxTemperature > existingSummary.maxTemperature ? maxTemperatureCity : existingSummary.maxTemperatureCity;
      existingSummary.minTemperature = Math.min(existingSummary.minTemperature, minTemperature);
      existingSummary.minTemperatureCity = minTemperature < existingSummary.minTemperature ? minTemperatureCity : existingSummary.minTemperatureCity;
      existingSummary.dominantWeather = dominantWeather; // For now, just take the most frequent condition
      await existingSummary.save();
  }
};

module.exports ={fetchWeatherData , updateOrCreateDailySummary , updateOrCreateGlobalSummary}





