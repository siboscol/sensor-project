const express = require('express');
const app = express();
const sensor = require('node-dht-sensor');


app.get('/temperature', (req, res) => {
    sensor.read(22, 2, (err, temperature, humidity) => {
        if(!err) {
            res.send(temperature.toFixed(1) + '°C');
        }
    });
});

app.get('/humidity', (req, res) => {
    sensor.read(22, 2, (err, temperature, humidity) => {
        if(!err) {
            res.send(humidity.toFixed(1) + '%');
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});