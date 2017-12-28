import { temperatureChart, humidityChart} from 'charts';

const fetchTemperature = () => {
    /* The fetch API uses a promise based sintax.
    It may look a little weird if you are seeing it for the first time, but it's an improvement over callbacks. */

    /* First, we instanciate a promise, which call the API /temperature of our server. */
    fetch('/temperature').then(results => {
        /* We want results converted to json, so we use the fetch results 'json' method, which returns a promise with the JSON data instead of the string. */
        return results.json();
    }).then(data => {
        /* In our server API route handler, the format of returned data was an object with a 'value' property. */
        /* Get the 'p' element as a variable, and set its inner HTML to the response we received from the server. 
        The value of the sensor reading is therefore available in 'data.value' */
        pushData(temperatureChart.data.labels, getNowTimeStamp(), 10);
        pushData(temperatureChart.data.datasets[0].data, data.value, 10);
        const temperatureDisplay = document.getElementById('temperature-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

/* Repeat the same steps for the humidity API */
const fetchHumidity = () => {
    fetch('/humidity').then(results => {
        return results.json();
    }).then(data => {
        pushData(humidityChart.data.labels, getNowTimeStamp(), 10);
        pushData(humidityChart.data.datasets[0].data, data.value, 10);
        humidityChart.update();
        const humidityDisplay = document.getElementById('humidity-display').innerHTML = '<strong>' + data.value + '</strong>';
    });
}

const pushData = (arr, value, maxLen) => {
    arr.push(value);
    if (arr.length > maxLen) {
        arr.shift();
    }
}

const getNowTimeStamp = () => {
    const now = new Date();
    const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    return timeNow;
}

/* Call the above defined function at regular intervals */
setInterval(() => {
    fetchTemperature();
    fetchHumidity();
}, 2000);