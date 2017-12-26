const express = require('express');
const path = require('path');
const app = express();
const getCachedSensorReadings = require('./get-cached-sensor-readings');

/* Here, we are introduced to express middleware.
Middleware is a fancy word to describe a set of actions that have to take place before the request handler.
In the below statement, we use the express static middleware, and bind it to the /public route.*/
// Getting parent dir folder with '../'
app.use('/public', express.static(path.join(__dirname, '../', 'public')));

// Routes
app.get('/temperature', (req, res) => {
    res.send(getCachedSensorReadings.getTemperature().toFixed(1) + '°C');
});

app.get('/humidity', (req, res) => {
    res.send(getCachedSensorReadings.getHumidity().toFixed(1) + '%');
});

// Opening the server on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});