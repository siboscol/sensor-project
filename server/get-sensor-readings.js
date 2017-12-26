const sensor = require('node-dht-sensor');

/* We abstract away the functionality to read sensor information inside the getSensorReadings function.
This function is also asynchronous. It accepts a callback function as an argument.
*/

const getSensorReadings = (callback) => {
    sensor.read(22, 2, (err, temperature, humidity) => {
        if(err) {
            /* If there is an error, call the callback function with error as its first argument */
            return callback(err);
        }
        /* If everything went well, call the callback function "null" as the first argument to indicate that there was no error.
        The second and third arguments would be the results (temperature and humidity respectively). */
        callback(null, temperature, humidity);
    });
};

/* Finally, export the function so that it can be used by other parts of our code. */
module.exports = getSensorReadings;