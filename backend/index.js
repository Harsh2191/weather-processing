// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weatherRoutes'); // Correct declaration of weatherRoutes
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// MongoDB connection
mongoose.connect(process.env.mongodb).then(()=> console.log('Database is connected'))
.catch((error)=>  console.log(error))

app.use(cors());

// Middleware
app.use(express.json());

// Use weather routes
app.use('/api', weatherRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
