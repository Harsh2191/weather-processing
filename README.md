# Weather Monitoring Application

## Objective

The **Weather Monitoring Application** is a real-time data processing system designed to monitor weather conditions across six major metro cities in India (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad). It provides summarized insights using rollups and aggregates, alerts users based on configurable thresholds, and displays both current and historical weather data.

## Deployed Application

You can access the  running application at the following link: [Live Link](https://weather-processing-frontend.vercel.app/) 

## Features

### Core Features
- **City Selection**: Users can select one of the six metro cities to view the corresponding weather data.
- **Threshold Parameters**: Users can configure threshold parameters for temperature, wind speed, and humidity. Notifications are displayed when current weather conditions exceed these thresholds.
- **Current Weather Dashboard**: Displays current weather data, including temperature, perceived temperature (feels like), humidity, wind speed, and dominant weather condition.
- **Daily Weather Summary**: Fetches and displays daily summary after performing rollups/ aggregates on  data for each city, showing average, maximum, and minimum temperatures, averagehumidity , averagewindspeed along with the dominant weather condition.
- **user preference**: user can toggle between the temperature between celsius and fahrenheit
- **Visualizations**: 
  - Displays daily weather summaries using charts.
  - Pie charts visualize the distribution of maxtemp and mintemp of globalsummary.

### Bonus Features
- **Rollups and Aggregates**: Implemented rollups and aggregates for average wind speed and average humidity.
- **Auto-Refresh**: The frontend fetches current weather data from the backend at a specific interval of 5 minutes.


### Additional Features
-  **Global Summary**: Shows a global summary of the weather conditions, including maximum temperature, minimum temperature, average temperature, dominant weather condition, and the corresponding city name

## Frontend Architecture

The frontend is built using **React.js , Tailwindcss** and includes the following key functionalities and features:
- **User Interface**: Provides inputs for selecting cities and setting threshold parameters and value.
- **Data Visualization**: Utilizes libraries like Chart.js or Recharts for visualizing weather data.
- **Notifications**: Alerts users when thresholds are breached, displayed in a user-friendly manner.
- Main frontend file: `weatherdisplay.jsx` (located in `frontend/weather-ui/src/component/weatherdisplay.jsx`).

## Backend Architecture

The backend is built using **Node.js** and **Express**, and it exposes the following REST APIs:

### REST APIs
1. **Current Weather API**: Fetches current weather data for the selected city.
   - Endpoint: `/api/weather/:city`
   
2. **Daily Summary API**: Retrieves daily summary data for the specified date and city.
   - Endpoint: `/api/weather/daily-summary/:city`
   
3. **Global Summary API**: Provides a global weather summary for all cities.
   - Endpoint: `/api/weather/global-summary`

### Utility Functions
- **Data Fetching**: A utility function to fetch data from the OpenWeatherMap API and convert temperature values from Kelvin to Celsius.
- **Update/Create Daily Summary / Global summary**: A scheduled function that updates or creates daily summary records in the MongoDB database using the `cron` package, running every 5 minutes.

## MongoDB Schemas
- **dailysummary schema**:  Stores rollups/aggregated weather data for each city on a daily basis, including temperature statistics and dominant weather conditions.
- **globalsummary schema**: Aggregates the maximum, minimum, and average weather statistics along with the dominant weather condition for all cities.


## How to Run Locally

Follow these steps to run the Rule Engine project locally on your machine.

### Prerequisites

- Node.js (v14+)
- MongoDB (For storing the rules)
- Git (For cloning the repository)
- A package manager (npm or yarn)

### Backend Setup

1. **Clone the Repository**

   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/Harsh2191/weather-processing
2 .Navigate to the Backend Directory

    cd backend
3. Install Dependencies
   **npm install express nodemon mongoose dotenv cors**
4. Set Up Environment Variables
   **mongodb=url of your database**
    **,  PORT=5000**
5. Start the Backend Server
   **npm start**
6. The backend server will be running on **http://localhost:5000**
### Frontend setup
1. Navigate to the Frontend Directory
   **cd frontend/weather-ui**

2. Install Dependencies
   **npm install axios notistack react-chartjs-2**
3. TailwindCSS Setup
   **npm install -D tailwindcss postcss autoprefixer**
   **,  npx tailwindcss init -p**
4. Start the Frontend Application
    **npm run dev**
5.  The frontend server will be running on **http://localhost:5173**



