import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Snackbar, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import { baseUrl } from '../urls';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru', 'Kolkata', 'Hyderabad'];

function WeatherDisplay() {
    const { enqueueSnackbar } = useSnackbar();
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [weatherData, setWeatherData] = useState(null);
    const [dailySummary, setDailySummary] = useState(null);
    const [globalSummary, setGlobalSummary] = useState(null);
    const [temperatureThreshold, setTemperatureThreshold] = useState(35);
    const [humidityThreshold, setHumidityThreshold] = useState(65);
    const [windSpeedThreshold, setWindSpeedThreshold] = useState(8);
    const [selectedParameter, setSelectedParameter] = useState('temperature');
    const [unit, setUnit] = useState('C'); // Default to Celsius ('C' or 'F')

    // Other state variables...

    // Conversion Functions
    const toFahrenheit = (celsius) => (celsius * 9/5) + 32;
    
    const convertTemperature = (temp) => {
        return unit === 'F' ? toFahrenheit(temp).toFixed(2) : temp;
    };

    const unitLabel = unit === 'C' ? '°C' : '°F';

    const toggleUnit = () => {
        setUnit(prevUnit => prevUnit === 'C' ? 'F' : 'C');
    };

    // Fetch current weather
    const fetchWeather = async (city) => {
        try {
            const response = await axios.get(`${baseUrl}/api/weather/${city}`);
            const cityWeather = response.data[0];
            setWeatherData(cityWeather);
            checkThreshold(cityWeather);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            enqueueSnackbar('Error fetching weather data', { variant: 'error' });
        }
    };

    // Fetch daily summary
    const fetchDailySummary = async (city) => {
        try {
            const response = await axios.get(`${baseUrl}/api/daily-summary/${city}`);
            setDailySummary(response.data);
        } catch (error) {
            console.error('Error fetching daily summaries:', error);
            enqueueSnackbar('Error fetching daily summaries', { variant: 'error' });
        }
    };

    // Fetch global summary
    const fetchGlobalSummary = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/global-summary`);
            setGlobalSummary(response.data);
        } catch (error) {
            console.error('Error fetching global summaries:', error);
            enqueueSnackbar('Error fetching global summaries', { variant: 'error' });
        }
    };

    const checkThreshold = (cityWeather) => {
        let exceedsThreshold = false;
        let thresholdValue;

        switch (selectedParameter) {
            case 'temperature':
                thresholdValue = temperatureThreshold;
                exceedsThreshold = cityWeather.temperature > thresholdValue;
                break;
            case 'humidity':
                thresholdValue = humidityThreshold;
                exceedsThreshold = cityWeather.humidity > thresholdValue;
                break;
            case 'windSpeed':
                thresholdValue = windSpeedThreshold;
                exceedsThreshold = cityWeather.wind_speed > thresholdValue;
                break;
            default:
                break;
        }

        if (exceedsThreshold) {
            enqueueSnackbar(`${cityWeather.city} has exceeded the ${selectedParameter} threshold of ${thresholdValue}!`, { variant: 'warning' });
        }
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
        fetchWeather(city);
        fetchDailySummary(city);
    };

    const handleParameterChange = (e) => {
        setSelectedParameter(e.target.value);
        checkThreshold(weatherData);
    };

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);
        
        if (selectedParameter === 'temperature') {
            setTemperatureThreshold(parsedValue);
        } else if (selectedParameter === 'humidity') {
            setHumidityThreshold(parsedValue);
        } else if (selectedParameter === 'windSpeed') {
            setWindSpeedThreshold(parsedValue);
        }
        
        checkThreshold(weatherData);
    };

    useEffect(() => {
        fetchWeather(selectedCity);
        fetchDailySummary(selectedCity);
        fetchGlobalSummary();

        const interval = setInterval(() => {
            fetchWeather(selectedCity);
        }, 300000);

        return () => clearInterval(interval);
    }, [selectedCity]);

    // Prepare data for the Bar chart (Daily Summary)
    const chartData = {
        labels: dailySummary ? dailySummary.map(summary => new Date(summary.date).toLocaleDateString()) : [],
        datasets: [
            {
                label: `Average Temperature (${unitLabel})`,
                data: dailySummary ? dailySummary.map(summary =>convertTemperature( summary.averageTemperature)) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: `Max Temperature (${unitLabel})`,
                data: dailySummary ? dailySummary.map(summary => convertTemperature( summary.maxTemperature)) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: `Min Temperature (${unitLabel})`,
                data: dailySummary ? dailySummary.map(summary => convertTemperature(summary.minTemperature)) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    // Prepare data for the Pie chart (Global Summary)
    const globalChartData = globalSummary ? {
        labels: ['Max Temperature', 'Min Temperature' , `${globalSummary.map(summary => new Date(summary.date).toLocaleDateString())}` ],
        
        datasets: [
            {
                label: `Global Summary (${unitLabel})`,
                data: [globalSummary.map(summary => convertTemperature(summary.maxTemperature)), globalSummary.map(summary => convertTemperature(summary.minTemperature))],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
            },
        ],
    } : null;
    
    return (
        
        <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100 rounded-lg shadow-xl">
            <div className="flex justify-evenly items-center mb-6">
                <h1 className="text-4xl font-bold text-indigo-800">Weather Dashboard</h1>
                <button 
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all"
                    onClick={toggleUnit}
                >
                    Switch to {unit === 'C' ? 'Fahrenheit' : 'Celsius'}
                </button>
            </div>
    
        {/* Input Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
                <label className="block mb-2 text-lg font-semibold text-indigo-700">Select City:</label>
                <select className="p-3 border border-indigo-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300" 
                    value={selectedCity} 
                    onChange={handleCityChange}>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>
    
                <label className="block mt-6 mb-2 text-lg font-semibold text-indigo-700">Select Parameter for Threshold:</label>
                <select className="p-3 border border-indigo-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300" 
                    value={selectedParameter} 
                    onChange={handleParameterChange}>
                    <option value="temperature">Temperature</option>
                    <option value="humidity">Humidity</option>
                    <option value="windSpeed">Wind Speed</option>
                </select>
    
                <label className="block mt-6 mb-2 text-lg font-semibold text-indigo-700">Set Threshold Value:</label>
                <input
                    type="number"
                    className="p-3 border border-indigo-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    value={
                        selectedParameter === 'temperature' ? temperatureThreshold :
                        selectedParameter === 'humidity' ? humidityThreshold :
                        windSpeedThreshold
                    }
                    onChange={handleThresholdChange}
                />
            </div>
    
            <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
                {weatherData && (
                    <div>
                        <h2 className="text-2xl font-bold text-purple-700">{weatherData.city} Current Weather</h2>
<p className="text-lg mt-4 text-gray-600">Temperature: {convertTemperature(weatherData.temperature)} {unitLabel}</p>
<p className="text-lg text-gray-600">Feels Like: {convertTemperature(weatherData.feels_like)} {unitLabel}</p>
<p className="text-lg text-gray-600">Humidity: {weatherData.humidity} %</p>
<p className="text-lg text-gray-600">Wind Speed: {weatherData.wind_speed} km/h</p>
<p className="text-lg text-gray-600">Weather: {weatherData.main}</p>
<p className="text-lg font-semibold text-purple-600">Date: {new Date(weatherData.dt * 1000).toLocaleString()}</p>

                    </div>
                )}
            </div>
        </div>
    
        {/* Daily Summary and Global Summary */}
        <div className="grid grid-cols-2 gap-8">
            {/* Daily Summary Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
                {dailySummary && (
                    <div>
                        <h2 className="text-2xl font-bold text-purple-700">{selectedCity} Daily Summary</h2>
                        <p className="mt-4 text-lg text-gray-600 font-semibold">Dominant Condition: {dailySummary.map(summary => summary.dominantWeather)}</p>
                        <p className="mt-4 text-lg text-gray-600 font-semibold">Average Humidity: {dailySummary.map(summary => summary.averageHumidity.toFixed(2))} %</p>
                        <p className="mt-4 text-lg text-gray-600 font-semibold">Average WindSpeed: {dailySummary.map(summary => summary.
averageWindSpeed.toFixed(2))} Km/h</p>
                        <Bar data={chartData} />
                    </div>
                )}
            </div>
    
            {/* Global Summary */}
            <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
                {globalSummary && globalChartData && (
                    <div>
                        <h2 className="text-2xl font-bold text-purple-700">Global Summary</h2>
                        <p className="mt-4 text-lg text-gray-600">Max Temp: {globalSummary.map(summary => convertTemperature(summary.maxTemperature))} {unitLabel} (City: {globalSummary.map(summary => summary.maxTemperatureCity)})</p>
                        <p className="text-lg text-gray-600">Min Temp: {globalSummary.map(summary => convertTemperature(summary.minTemperature))} {unitLabel} (City: {globalSummary.map(summary => summary.minTemperatureCity)})</p>
                        <p className="text-lg text-gray-600">Dominant Weather Condition: {globalSummary.map(summary => summary.dominantWeather)}</p>
                        <p className="text-lg text-gray-600">Average Temp of All Cities: {globalSummary.map(summary =>  convertTemperature( summary.averageTemperature.toFixed(2)))} {unitLabel}</p>
    
                        {/* Reduced Pie chart size */}
                        <div className="mt-6 mx-auto" style={{ width: '300px', height: '300px' }}>
                            <Pie
                                data={globalChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>

    
    );
}

export default WeatherDisplay;
