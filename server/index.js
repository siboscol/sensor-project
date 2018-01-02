const express = require('express');
const path = require('path');
const app = express();
const getCachedSensorReadings = require('./get-cached-sensor-readings');
const databaseOperations = require('./database-operations');

/* Here, we are introduced to express middleware.
Middleware is a fancy word to describe a set of actions that have to take place before the request handler.
In the below statement, we use the express static middleware, and bind it to the /public route.*/
// Getting parent dir folder with '../'
app.use('/public', express.static(path.join(__dirname, '../', 'public')));

// Routes
app.get('/temperature', (req, res) => {
    res.json({
        value: getCachedSensorReadings.getTemperature().toFixed(1)
    });
});

app.get('/temperature/history', (req, res) => {
    databaseOperations.fetchLastReadings('temperature', 10, (err, results) => {
        if(err){
            /* If any error occued, send a 500 status to the frontend and log it. */
            console.error(err);
            res.status(500).end();
        }
        /* Return the reverse of the results obtained from the database. */
        res.json(results.reverse());
    });
});

app.get('/humidity', (req, res) => {
    res.json({
        value: getCachedSensorReadings.getHumidity().toFixed(1)
    });
});

app.get('/humidity/history', (req, res) => {
    databaseOperations.fetchLastReadings('humidity', 10, (err, results) => {
        if(err){
            /* If any error occued, send a 500 status to the frontend and log it. */
            console.error(err);
            res.status(500).end();
        }
        /* Return the reverse of the results obtained from the database. */
        res.json(results.reverse());
    });
});

// Opening the server on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});