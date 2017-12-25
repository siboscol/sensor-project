// Import the sensor library
const sensor = require('node-dht-sensor');

// The first argument is the sensor number. In this case 22 represents DHT22 sensor
// The second argument is the pin number to read from, for this example pin to pin 2
sensor.read(22, 2, (err, temperature, humidity) => {
    // After reading the sensor, we get the temperature and humidity reading
    if(!err) {
        // If there is no error, log the readings to the console
        console.log('temp:' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');
    }
});