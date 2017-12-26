const getSensorReadings = require('./get-sensor-readings');

/* Instanciace the cache. In this case it's a simpre variable stored in local memory */
const cache = {
    temperature: null,
    humidity: null
};

/* Run a function to get sensor readings every 2 seconds (the same sampling rate as our sensor).
No more than 0.5 Hz sampling rate (once every 2 seconds) */
setInterval( () => {
    getSensorReadings((err, temperature, humidity) => {
        if(err) {
            return console.error(error);
        }
        console.log('Live sensor readings.');
        console.log('Temperature: ' + temperature);
        console.log('Humidity: ' + humidity);
        /* Set the value of the cache on receiving new readings */
        cache.temperature = temperature;
        cache.humidity = humidity;
    });
}, 2000);

/* The function that we expose only returns the cached values, and don't make a call to the sensor interface everytime */
module.exports.getTemperature = () => cache.temperature;
module.exports.getHumidity = () => cache.humidity;