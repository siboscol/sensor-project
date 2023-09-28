const express = require('express');
const path = require('path');
const app = express();
const getCachedSensorReadings = require('./get-cached-sensor-readings');
const databaseOperations = require('./database-operations');

/**
 * Import the external dependencies required, for us this is:
    * 1. The native http module
    * 2. The socket.io module that we installed
    * 3. The subscribe and unsubscribe functions from the 
notifier module
*/
const http = require('http')
const socketIo = require('socket.io')
const { subscribe, unsubscribe } = require('./notifier')

/** Create a new HTTP server that wraps the "app" object that define our server. */
const httpServer = http.Server(app);

/** Socket.io implements its own route on the top of the existing ones by wrapping our HTTP server. */
const io = socketIo(httpServer);

io.on('connection', socket => {
    /** This callback is called every time a new client successfully makes a websocket connection with our server. */
    console.log(`User connected [${socket.id}]`);
    /** The event listeners are defined inside the callback function because we need to access the "socket" instance,   
    to emit changes to the client.
    The "pushTemperature" and "pushHumidity" listeners are called on change of temperature and humidity respectively.
    */
    const pushTemperature = newTemperature => {
        socket.emit('new-temperature', {
            value: newTemperature.toFixed(1)
        })
    };

    const pushHumidity = newHumidity => {
        socket.emit('new-humidity', {
            value: newHumidity.toFixed(1)
        })
    };

    /** Subscribe the listeners that we just defined to the "temperature" and "humidity" events*/
    subscribe(pushTemperature, 'temperature');
    subscribe(pushHumidity, 'humidity');

    socket.on('disconnect', () => {
        /** Finally, when the connection is closed, unsubscribe the listeners from their events */
        unsubscribe(pushTemperature, 'temperature');
        unsubscribe(pushHumidity, 'humidity');
    });
});

/* Here, we are introduced to express middleware.
Middleware is a fancy word to describe a set of actions that have to take place before the request handler.
In the below statement, we use the express static middleware, and bind it to the / route.*/
// Getting parent dir folder with '../'
app.use(express.static(path.join(__dirname, '../', 'public')));

// Temperature Routes
app.get('/temperature', (req, res) => {
    res.json({
        value: getCachedSensorReadings.getTemperature().toFixed(1)
    });
});

app.get('/temperature/history', (req, res) => {
    databaseOperations.fetchLastReadings('temperature', 10, (err, results) => {
        if (err) {
            /* If any error occued, send a 500 status to the frontend and log it. */
            console.error(err);
            res.status(500).end();
        }
        /* Return the reverse of the results obtained from the database. */
        res.json(results.reverse());
    });
});

app.get('/temperature/range', (req, res) => {
    /* Here, the "start" and "end" datatimes (i.e 2023-09-24 19:14:15) for the range of readings are expected to be received through the query parameters.
    This is splitted as part of the URL request. If missing it uses today's start and end datetime. */
    let { start, end } = req.query;
    if (!start && !end) {
        const today = getTodayStartEnd();
        start = today.start;
        end = today.end;
    }

    /* The "fetchReadingBetweenTime" method is called, which returns an array of results, which we return as JSON to the client side. */
    databaseOperations.fetchReadingBetweenTime('temperature', start, end, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json(results);
    });
});

app.get('/temperature/average', (req, res) => {
    let { start, end } = req.query;
    if (!start && !end) {
        const today = getTodayStartEnd();
        start = today.start;
        end = today.end;
    }
    databaseOperations.getAvarageOfReadingsBetweenTime('temperature', start, end, (err, results) => {
        if (err) {
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
        if (err) {
            /* If any error occued, send a 500 status to the frontend and log it. */
            console.error(err);
            res.status(500).end();
        }
        /* Return the reverse of the results obtained from the database. */
        res.json(results.reverse());
    });
});

app.get('/humidity/range', (req, res) => {
    let { start, end } = req.query;
    if (!start && !end) {
        const today = getTodayStartEnd();
        start = today.start;
        end = today.end;
    }
    databaseOperations.fetchReadingBetweenTime('humidity', start, end, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json(results);
    });
});

app.get('/humidity/average', (req, res) => {
    let { start, end } = req.query;
    if (!start && !end) {
        const today = getTodayStartEnd();
        start = today.start;
        end = today.end;
    }
    databaseOperations.getAvarageOfReadingsBetweenTime('humidity', start, end, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json({
            value: results['avg(value)'].toFixed(1)
        });
    });
});

app.get('/readings/today', (req, res) => {
    const {start, end } = getTodayStartEnd();

    databaseOperations.fetchTodayReadings('temperature', start, end, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).end();
        }
        return res.json(results);
    });
});

const port = process.env.PORT || 3000;
/** The httpsServer.listen method is called. This exposes the routes we defined for the "app" instance as well.*/
httpServer.listen(port, function () {
    console.log(`Server listening on port ${port}`)
});

const getTodayStartEnd = () => {
    const today = new Date();
    const end = getDateTime(today);
    // Set the time components to the beginning of the day (midnight)
    today.setHours(0, 0, 0, 0);
    const start = getDateTime(today)
    return { start, end }
}

const getDateTime = (date) => {
    // Extract the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Extract the time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Create the formatted date string
    return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}