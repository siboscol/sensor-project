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

// Temperature Routes
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

app.get('/temperature/range', (req, res) => {
    /* Here, the "start" and "end" datatimes for the range of readings are expected to be received through the query parameters.
    This is splitted as part of the URL request. */
    const {start, end} = req.query;

    /* The "fetchReadingBetweenTime" method is called, which returns an array of results, which we return as JSON to the client side. */
    databaseOperations.fetchReadingBetweenTime('temperature', start, end, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json(results);
    });
});

app.get('/temperature/average', (req, res) => {
    const {start, end} = req.query;
    databaseOperations.getAvarageOfReadingsBetweenTime('temperature', start, end, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).end();
        }
        /* This is similar to the earlier API, except that we just return a singular value. */
        return res.json({
            value: results['avg(value)'].toFixed(1)
        });
    });
});

// Humidity Routes
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

app.get('/humidity/range', (req, res) => {
    const {start, end} = req.query;
    databaseOperations.fetchReadingBetweenTime('humidity', start, end, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json(results);
    });
});

app.get('/humidity/average', (req, res) => {
    const {start, end} = req.query;
    databaseOperations.getAvarageOfReadingsBetweenTime('humidity', start, end, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json({
            value: results['avg(value)'].toFixed(1)
        });
    });
});

// Opening the server on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});