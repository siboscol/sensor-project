/* Import temperature and humidity chart configuration from charts module using ES6. */
import {temperatureChart, humidityChart, temperatureChartConfig, humidityChartConfig} from './charts.js';

const fetchTemperature = () => {
    /* The fetch API uses a promise based sintax.
    It may look a little weird if you are seeing it for the first time, but it's an improvement over callbacks. */

    /* First, we instanciate a promise, which call the API /temperature of our server. */
    fetch('/temperature').then(results => {
        /* We want results converted to json, so we use the fetch results 'json' method, which returns a promise with the JSON data instead of the string. */
        return results.json();
        
    }).then(data => {
        /* Add the data to the chart dataset.
        The x-axis here is time, with the time of measurement added as its value. 
        Since it is measure in regular intervals, we do not need to scale it, and can assume a uniform regular interval.
        The y-axis is temperature, which is stored in 'data.value'.
        The data is being pushed directly into the configuration we described in charts.js.
        A maximum length of 10 is maintained. Which means that after 10 readings are filled in the dataset, the older readings will start being pushed out. */
        pushData(temperatureChart.data.labels, getTimeStamp(), 10);
        pushData(temperatureChart.data.datasets[0].data, data.value, 10);

        /* 'temperatureChart' is our ChartJs instance. 
        The 'update' method looks for changes in the dataset and axes, and animates and updates the chart accordingly. */
        temperatureChart.update();

        /* In our server API route handler, the format of returned data was an object with a 'value' property. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. 
        The value of the sensor reading is therefore available in 'data.value' */
        const temperatureDisplay = document.getElementById('temperature-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const fetchTemperatureHistory = () => {
    fetch('/temperature/history').then(results => {
        return results.json();
    }).then(data => {
        data.forEach(readings => {
            /* For each readings prsent in the 'data' array, 
            convert the time to the ISO Z format accepted by the javascript Date object.
            Format the time and push data on the chart similar to the previous API calls. */
            const time = new Date(readings.CreatedAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(temperatureChartConfig.data.labels, formattedTime, 10);
            pushData(temperatureChartConfig.data.datasets[0].data, readings.value, 10);
            temperatureChart.update();
        });
    });
}

/* Repeat the same steps for the humidity API */
const fetchHumidity = () => {
    fetch('/humidity').then(results => {
        return results.json();
    }).then(data => {
        pushData(humidityChart.data.labels, getTimeStamp(), 10);
        pushData(humidityChart.data.datasets[0].data, data.value, 10);
        humidityChart.update();
        const humidityDisplay = document.getElementById('humidity-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const fetchHumidityHistory = () => {
    fetch('/humidity/history').then(results => {
        return results.json();
    }).then(data => {
        data.forEach(readings => {
            const time = new Date(readings.CreatedAt + 'Z');
            const formattedTime = getTimeStamp(time);
            pushData(humidityChartConfig.data.labels, formattedTime, 10);
            pushData(humidityChartConfig.data.datasets[0].data, readings.value, 10);
            temperatureChart.update();
        });
    });
}

const pushData = (arr, value, maxLen) => {
    arr.push(value);
    if (arr.length > maxLen) {
        arr.shift();
    }
}

const getTimeStamp = (time) => {
    /* Note the time when the reading is obtained, and convert it to hh:mm:ss format. */
    if (!time) {
        time = new Date();
    }
    const timeStamp = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    return timeStamp;
}

/* Call the above defined function at regular intervals */
setInterval(() => {
    fetchTemperature();
    fetchHumidity();
}, 2000);